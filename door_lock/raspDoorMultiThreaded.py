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

async def send_and_receive_message(url, message=None):
    async with websockets.connect(url) as websocket:
        if message:
            await websocket.send(message)

        response = await websocket.recv()
    return response

async def listen_for_server_input():
    while True:
        # Check if the server sends a command to unlock the door
        response = await send_and_receive_message(SERVER_URL + '/server_command')
        command_data = json.loads(response)
        command = command_data.get('unlock', None)

        if command is not None:
            # Unlock the door if the server sends the unlock command
            if command:
                unlock_door()
                time.sleep(10)  # Keep the door unlocked for 10 seconds
                lock_door()

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
    
    # Start a separate thread to listen for server input
    server_input_thread = threading.Thread(target=lambda: asyncio.run(listen_for_server_input()))
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
                response = send_and_receive_message(SERVER_URL + '/face_detected', json.dumps({
                    'external_ip': 'your-external-ip',
                    'guest_name': guest_name
                }))

        else:
            # Forward the video feed to the server
            ret, buffer = cv2.imencode('.jpg', frame)
            send_and_receive_message(SERVER_URL + '/video_feed', buffer.tobytes())

            # Check if the server received a response from the user
            response = send_and_receive_message(SERVER_URL + '/user_decision')
            decision_data = json.loads(response)
            decision = decision_data.get('unlock', None)

            if decision is not None:
                # Unlock the door if the user allows it
                if decision:
                    unlock_door()
                    time.sleep(10)  # Keep the door unlocked for 10 seconds
                    lock_door()

                # Stop forwarding the video feed
                face_detected = False

    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()
