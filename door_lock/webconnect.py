import boto3
import cv2
import time
import websockets
import json
import asyncio
import RPi.GPIO as GPIO
import threading


SERVER_URL = 'ws://10.154.4.171:3001'


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

                print('hello')
                while True:
                    response = await websocket.recv()
                    if response:
                        print(response)
        except websockets.ConnectionClosed:
            print("Connection lost: trying to reconnect...")
            await asyncio.sleep(3)  # Wait for 5 seconds before attempting to reconnect
            
        except asyncio.TimeoutError:
            print("Timeout: trying to reconnect...")
            await asyncio.sleep(3)
            
def main():
    conn = asyncio.get_event_loop().run_until_complete(websocket_client(SERVER_URL))
    
main()