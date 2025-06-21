import os
from dotenv import load_dotenv
from typing import List

load_dotenv()

class Settings:
    # Database
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    # JWT
    JWT_SECRET = os.getenv("JWT_SECRET", "supersecretkey")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    
    # Razorpay
    RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
    RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")
    
    # S3/MinIO
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
    AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME", "united-karts-images")
    AWS_ENDPOINT_URL = os.getenv("AWS_ENDPOINT_URL")  # For MinIO
    AWS_USE_SSL = os.getenv("AWS_USE_SSL", "true").lower() == "true"
    
    # Environment
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    
    # Server Configuration
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", "8001"))
    
    # Logging
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    
    # CORS
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", '["http://localhost:3000", "http://localhost:8080"]')
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", "100"))
    
    # File Upload Limits
    MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", "10485760"))  # 10MB
    ALLOWED_IMAGE_TYPES = os.getenv("ALLOWED_IMAGE_TYPES", '["image/jpeg", "image/png", "image/webp"]')
    
    # GST Configuration (for Indian tax)
    GST_PERCENTAGE = float(os.getenv("GST_PERCENTAGE", "18.0"))
    
    # Delivery Configuration
    DEFAULT_DELIVERY_FEE = float(os.getenv("DEFAULT_DELIVERY_FEE", "50.0"))
    MIN_ORDER_AMOUNT = float(os.getenv("MIN_ORDER_AMOUNT", "100.0"))
    
    # Notification Configuration
    PUSH_NOTIFICATION_ENABLED = os.getenv("PUSH_NOTIFICATION_ENABLED", "true").lower() == "true"
    EMAIL_NOTIFICATION_ENABLED = os.getenv("EMAIL_NOTIFICATION_ENABLED", "true").lower() == "true"
    
    # Analytics Configuration
    ANALYTICS_RETENTION_DAYS = int(os.getenv("ANALYTICS_RETENTION_DAYS", "365"))
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from JSON string"""
        import json
        try:
            return json.loads(self.CORS_ORIGINS)
        except:
            return ["http://localhost:3000", "http://localhost:8080"]
    
    @property
    def allowed_image_types_list(self) -> List[str]:
        """Parse allowed image types from JSON string"""
        import json
        try:
            return json.loads(self.ALLOWED_IMAGE_TYPES)
        except:
            return ["image/jpeg", "image/png", "image/webp"]

settings = Settings() 