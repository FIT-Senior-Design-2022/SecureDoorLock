import boto3
import cv2
import time
import websockets
import json
import asyncio
import RPi.GPIO as GPIO
import threading
import os
import subprocess
import sys
import uuid
import base64
import socket

# Constants
S3_BUCKET = 'ckieferbucket'
AWS_REGION = 'us-west-2'
COLLECTION_ID = 'face-collection'
SERVER_URL = 'ws://10.154.7.3:3001'
RTMP_URL = 'rtmp://10.154.0.110:1935/live/stream'

# Initialize AWS Rekognition client and GPIO
rekognition = boto3.client('rekognition', region_name=AWS_REGION)
GPIO.setmode(GPIO.BCM)

# Set the GPIO pin numbers to control the relay module
GPIO_PIN_1 = 17
GPIO_PIN_2 = 18

# Set the pins as outputs
GPIO.setup(GPIO_PIN_1, GPIO.OUT)
GPIO.setup(GPIO_PIN_2, GPIO.OUT)

def unlock_door():
    # Trigger the relay module to close the circuit and open the lock
    GPIO.output(GPIO_PIN_1, GPIO.HIGH)
    GPIO.output(GPIO_PIN_2, GPIO.LOW)

    # Wait for a few seconds
    time.sleep(2)

    # Turn off the relay module to reset the circuit and allow the lock to close
    GPIO.output(GPIO_PIN_1, GPIO.LOW)
    GPIO.output(GPIO_PIN_2, GPIO.LOW)

    return True

def lock_door():
    # Trigger the relay module to close the circuit and open the lock
    GPIO.output(GPIO_PIN_1, GPIO.LOW)
    GPIO.output(GPIO_PIN_2, GPIO.HIGH)

    # Wait for a few seconds
    time.sleep(2)

    # Turn off the relay module to reset the circuit and allow the lock to close
    GPIO.output(GPIO_PIN_1, GPIO.LOW)
    GPIO.output(GPIO_PIN_2, GPIO.LOW)

    return False


websocket = None

async def websocket_client(uri):
    global websocket
    while True:
        try:
            async with websockets.connect(uri) as ws:
                websocket = ws
                output = subprocess.check_output(['hostname', '-I']).decode('utf-8')
                # Send a message to the WebSocket server
                await websocket.send(json.dumps({'type': 'init', 'content': 'door-lock-0', 'url': output.strip().split()[0]}))

                # Receive messages from the WebSocket server
                while True:
                    response = await websocket.recv()
                    if response:
                        print(response)
                        await process_server_message(response)
        except websockets.ConnectionClosed:
            print("Connection lost: trying to reconnect...")
            await asyncio.sleep(5)  # Wait for 5 seconds before attempting to reconnect

        except asyncio.TimeoutError:
            print("Timeout: trying to reconnect...")
            await asyncio.sleep(5)  # Wait for 5 seconds before attempting to reconnect

async def send_message(message):
    global websocket
    if websocket is not None:
        await websocket.send(message)

async def process_server_message(response, face=True):
    decision = response
    if response == 'Command:Unlock':
        unlock_door()
    if response == 'Command:Lock':
        lock_door() 
    return decision

def upload_to_s3(image_path):
    s3 = boto3.client('s3')
    s3.upload_file(image_path, S3_BUCKET, image_path)
    return image_path

def search_face_in_collection(s3_image_url):
    response = rekognition.search_faces_by_image(
    CollectionId=COLLECTION_ID,
    Image={
    'S3Object': {
        'Bucket': S3_BUCKET,
        'Name': s3_image_url
        }
    },
    FaceMatchThreshold=85,
    MaxFaces=1
    )
    if len(response['FaceMatches']) > 0:
        print("known")
        return 'Known Visitor: ' + response['FaceMatches'][0]['Face']['ExternalImageId']
    else:
        print("unknown")
        return 'Unknown Visitor'
    
def detect_faces(s3_image_url):
    response = rekognition.detect_faces(
        Image={
            'S3Object': {
                'Bucket': S3_BUCKET,
                'Name': s3_image_url
            }
        },
        Attributes=['ALL']
    )
    face_details = response['FaceDetails']
    return len(face_details) > 0


async def async_main():
    # Start the FFmpeg process for streaming video to Nginx
    ffmpeg_stream_cmd = (
        f"ffmpeg -f video4linux2 -i /dev/video0 -vf fps=1/10 -f image2 -strftime 1 frame-%s.jpg "
        f"-c:v libx264 -f flv {RTMP_URL}"
    )
    ffmpeg_process = subprocess.Popen(ffmpeg_stream_cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    door_status = lock_door()

    # Start a separate thread to listen for server input and keep the connection open
    server_input_thread = threading.Thread(target=lambda: asyncio.run(websocket_client(SERVER_URL)))
    server_input_thread.start()

    face_detected = False
    waiting_for_server = False

    # Add a delay to wait for the first frame.jpg file to be created
    time.sleep(5)
    
    while True:
        # Check for the most recent frame
        most_recent_frame = None
        for file in os.listdir('.'):
            if file.startswith('frame-') and file.endswith('.jpg'):
                if most_recent_frame is None or file > most_recent_frame:
                    most_recent_frame = file

        if not waiting_for_server:
            
            if most_recent_frame:
                # Read the frame
                frame = cv2.imread(most_recent_frame)

                if not face_detected:
                    # Upload the image to S3
                    s3_image_url = upload_to_s3(most_recent_frame)

                    # Check if there's a face in the image
                    response = rekognition.detect_faces(
                        Image={
                            'S3Object': {
                                'Bucket': S3_BUCKET,
                                'Name': s3_image_url
                            }
                        },
                        Attributes=['ALL']
                    )

                    face_details = response['FaceDetails']
                    if len(face_details) > 0:
                        face_detected = True
                        print("face detected")

                        # Check if the person is in the approved list
                        guest_name = search_face_in_collection(s3_image_url).replace('_', ' ')

                        print(guest_name)
                    
                        with open(most_recent_frame, 'rb') as mrf:
                            encode_face = base64.b64encode(mrf.read()).decode('utf-8')
                            # Notify the server about the face detection and guest_name
                            await send_message(json.dumps({
                                'type': 'face_detected',
                                'content': guest_name,
                                'image' : encode_face
                            }))
                            waiting_for_server = True
                    
                    
                    else:
                        print("no face detected")

                # Remove the processed frame
                os.remove(most_recent_frame)
                face_detected = False
            
        decision_data = await websocket_client(SERVER_URL)
        if decision_data == "Command:Unlock" or decision_data == "Command:Lock":
            waiting_for_server = False
    # Terminate the FFmpeg process when the script ends
    ffmpeg_process.terminate()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    asyncio.run(async_main())

