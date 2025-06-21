import boto3
from botocore.exceptions import ClientError
from app.core.config import settings
import aiofiles
import os
from typing import Optional, Dict, Any
import uuid
from datetime import datetime

class S3Service:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
            endpoint_url=settings.AWS_ENDPOINT_URL,  # For MinIO
            use_ssl=settings.AWS_USE_SSL
        )
        self.bucket_name = settings.AWS_BUCKET_NAME
    
    def upload_file(self, file_path: str, object_name: Optional[str] = None) -> Dict[str, Any]:
        """Upload a file to S3/MinIO"""
        if object_name is None:
            object_name = os.path.basename(file_path)
        
        # Add timestamp and unique ID to prevent conflicts
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = uuid.uuid4().hex[:8]
        file_extension = os.path.splitext(object_name)[1]
        object_name = f"{timestamp}_{unique_id}{file_extension}"
        
        try:
            self.s3_client.upload_file(file_path, self.bucket_name, object_name)
            return {
                "success": True,
                "object_name": object_name,
                "url": self._get_file_url(object_name)
            }
        except ClientError as e:
            return {"success": False, "error": str(e)}
    
    def upload_fileobj(self, file_obj, object_name: str) -> Dict[str, Any]:
        """Upload a file object to S3/MinIO"""
        try:
            self.s3_client.upload_fileobj(file_obj, self.bucket_name, object_name)
            return {
                "success": True,
                "object_name": object_name,
                "url": self._get_file_url(object_name)
            }
        except ClientError as e:
            return {"success": False, "error": str(e)}
    
    def download_file(self, object_name: str, file_path: str) -> Dict[str, Any]:
        """Download a file from S3/MinIO"""
        try:
            self.s3_client.download_file(self.bucket_name, object_name, file_path)
            return {"success": True, "file_path": file_path}
        except ClientError as e:
            return {"success": False, "error": str(e)}
    
    def delete_file(self, object_name: str) -> Dict[str, Any]:
        """Delete a file from S3/MinIO"""
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=object_name)
            return {"success": True}
        except ClientError as e:
            return {"success": False, "error": str(e)}
    
    def get_file_url(self, object_name: str) -> str:
        """Get the URL for a file"""
        return self._get_file_url(object_name)
    
    def _get_file_url(self, object_name: str) -> str:
        """Generate file URL based on environment"""
        if settings.ENVIRONMENT == "production":
            # Use S3 URL
            return f"https://{self.bucket_name}.s3.{settings.AWS_REGION}.amazonaws.com/{object_name}"
        else:
            # Use MinIO URL
            if settings.AWS_ENDPOINT_URL:
                return f"{settings.AWS_ENDPOINT_URL}/{self.bucket_name}/{object_name}"
            else:
                return f"http://localhost:9000/{self.bucket_name}/{object_name}"
    
    def list_files(self, prefix: str = "") -> Dict[str, Any]:
        """List files in bucket with optional prefix"""
        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix
            )
            files = []
            if 'Contents' in response:
                for obj in response['Contents']:
                    files.append({
                        "key": obj['Key'],
                        "size": obj['Size'],
                        "last_modified": obj['LastModified'],
                        "url": self._get_file_url(obj['Key'])
                    })
            return {"success": True, "files": files}
        except ClientError as e:
            return {"success": False, "error": str(e)}

s3_service = S3Service() 