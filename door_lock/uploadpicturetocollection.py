import boto3
import cv2

AWS_REGION = 'us-west-2'
S3_BUCKET = 'ckieferbucket'
COLLECTION_ID = 'face-collection'

rekognition = boto3.client('rekognition', region_name=AWS_REGION)

def upload_to_s3(image_path):
    s3 = boto3.client('s3')
    s3.upload_file(image_path, S3_BUCKET, image_path)
    return image_path

def add_user_to_collection(user_image_path, user_name):
    image_key = upload_to_s3(user_image_path)
    
    response = rekognition.index_faces(
        CollectionId=COLLECTION_ID,
        Image={
            'S3Object': {
                'Bucket': S3_BUCKET,
                'Name': image_key
            }
        },
        ExternalImageId=user_name,
        DetectionAttributes=['ALL'],
        MaxFaces=1,
        QualityFilter='AUTO'
    )

    print(response)

def capture_user_photo(filename):
    cap = cv2.VideoCapture(0)

    ret, frame = cap.read()

    if not ret:
        print("Error capturing image.")
        return

    cv2.imwrite(filename, frame)
    cap.release()

user_name = 'Luke_Bucher'  # Replace this with your name or identifier
user_image_path = 'user_image.jpg'  # The file name for the captured image

capture_user_photo(user_image_path)
add_user_to_collection(user_image_path, user_name)
