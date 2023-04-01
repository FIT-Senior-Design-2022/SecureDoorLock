import boto3
import cv2
import time
import websockets
import json
import asyncio
import RPi.GPIO as GPIO
import threading

# Constants
S3_BUCKET = 's3-bucket-name'
AWS_REGION = 'aws-region'
COLLECTION_ID = 'collection-id'
SERVER_URL = 'server-url'

# Initialize AWS Rekognition client and GPIO
rekognition = boto3.client('rekognition', region_name=AWS_REGION)
GPIO.setmode(GPIO.BCM)

# Set the GPIO pin numbers to control the relay module
GPIO_PIN_1 = 17
GPIO_PIN_2 = 18

# Set the pins as outputs
GPIO.setup(GPIO_PIN_1, GPIO.OUT)
GPIO.setup(GPIO_PIN_2, GPIO.OUT)

def lock_door():
    # Trigger the relay module to close the circuit and open the lock
    GPIO.output(GPIO_PIN_1, GPIO.HIGH)
    GPIO.output(GPIO_PIN_2, GPIO.LOW)

    # Wait for a few seconds
    time.sleep(2)

    # Turn off the relay module to reset the circuit and allow the lock to close
    GPIO.output(GPIO_PIN_1, GPIO.LOW)
    GPIO.output(GPIO_PIN_2, GPIO.LOW)

    # Clean up the GPIO pins
    GPIO.cleanup()
    
    return True

def unlock_door():
    # Trigger the relay module to close the circuit and open the lock
    GPIO.output(GPIO_PIN_1, GPIO.LOW)
    GPIO.output(GPIO_PIN_2, GPIO.HIGH)

    # Wait for a few seconds
    time.sleep(2)

    # Turn off the relay module to reset the circuit and allow the lock to close
    GPIO.output(GPIO_PIN_1, GPIO.LOW)
    GPIO.output(GPIO_PIN_2, GPIO.LOW)

    # Clean up the GPIO pins
    GPIO.cleanup()
    
    return False


websocket = None

async def websocket_client(uri):
    global websocket
    while True:
        try:
            async with websockets.connect(uri) as ws:
                websocket = ws
                # Send a message to the WebSocket server
                await websocket.send(json.dumps({'type': 'init', 'content': 'door-lock-0'}))

                # Receive messages from the WebSocket server
                while True:
                    response = await websocket.recv()
                    if response:
                        process_server_message(response)
        except websockets.ConnectionClosed:
            print("Connection lost: trying to reconnect...")
            await asyncio.sleep(3)  # Wait for 5 seconds before attempting to reconnect
            
        except asyncio.TimeoutError:
            print("Timeout: trying to reconnect...")
            await asyncio.sleep(3)  # Wait for 5 seconds before attempting to reconnect

async def send_message(message):
    global websocket
    if websocket is not None:
        await websocket.send(message)
        

async def process_server_message(response, face=True):
    command_data = json.loads(response)
    command_type = command_data.get('type', None)
    if command_type == 'unlock':
        command = command_data.get('content', None)
        if command is not None:
            # Unlock the door if the server sends the unlock command
            if command:
                unlock_door()
                time.sleep(10)  # Keep the door unlocked for 10 seconds
                lock_door()
            return face
            

def upload_to_s3(image_path):
    s3 = boto3.client('s3')
    s3.upload_file(image_path, S3_BUCKET, image_path)
    return f"https://{S3_BUCKET}.s3.amazonaws.com/{image_path}"

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
        return 'Known Visitor: ' + response['FaceMatches'][0]['Face']['ExternalImageId']
    else:
        return 'Unknown Visitor'

def main():
    cap = cv2.VideoCapture(0)

    door_status = lock_door()
    
    # Start a separate thread to listen for server input and keep the connection open
    server_input_thread = threading.Thread(target=lambda: asyncio.run(websocket_client(SERVER_URL)))
    server_input_thread.start()
    

    face_detected = False

    while True:
        # Capture a video frame
        ret, frame = cap.read()
        if not ret:
            break

        if not face_detected:
            # Save the frame as an image file
            frame_filename = 'frame.jpg'
            cv2.imwrite(frame_filename, frame)

            # Upload the image to S3
            s3_image_url = upload_to_s3(frame_filename)

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

                # Check if the person is in the approved list
                guest_name = search_face_in_collection(s3_image_url)

                # Notify the server about the face detection and guest_name
                send_message(json.dumps({
                    'type': 'face_detected',
                    'content':  guest_name
                }))

        else:
            # Forward the video feed to the server
            ret, buffer = cv2.imencode('.jpg', frame)
            await send_message(json.dumps({
                'type': 'video_feed',
                'content': buffer.tobytes()
            }))
            
            # Check if the server received a response from the user
            response = None  # Reset the response variable
            if websocket and websocket.open:
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=1)
                except asyncio.TimeoutError:
                    pass  # No response received within the timeout
            
            if response:
                process_server_message(response)

                # Check if the response is of the 'unlock' type
                decision_data = json.loads(response)

                if decision_data.get('type', '') == 'unlock':
                    # Stop forwarding the video feed
                    face_detected = False


    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()
