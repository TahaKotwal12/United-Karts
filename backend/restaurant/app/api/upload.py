from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.s3_service import s3_service
from app.core.security import get_current_user
from app.core.config import settings
import aiofiles
import os
import tempfile
from typing import List

router = APIRouter()

@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user)
):
    """Upload an image to S3/MinIO"""
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Validate file type
    if file.content_type not in settings.allowed_image_types_list:
        raise HTTPException(
            status_code=400, 
            detail=f"File type not allowed. Allowed types: {settings.allowed_image_types_list}"
        )
    
    # Validate file size
    content = await file.read()
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400, 
            detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE} bytes"
        )
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
        temp_file.write(content)
        temp_file_path = temp_file.name
    
    try:
        # Upload to S3/MinIO
        result = s3_service.upload_file(temp_file_path, file.filename)
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=f"Upload failed: {result['error']}")
        
        return {
            "success": True,
            "url": result["url"],
            "object_name": result["object_name"],
            "filename": file.filename,
            "size": len(content)
        }
    
    finally:
        # Clean up temporary file
        os.unlink(temp_file_path)

@router.delete("/image/{object_name}")
async def delete_image(
    object_name: str,
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user)
):
    """Delete an image from S3/MinIO"""
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = s3_service.delete_file(object_name)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=f"Delete failed: {result['error']}")
    
    return {"success": True, "message": "Image deleted successfully"}

@router.get("/images")
async def list_images(
    prefix: str = "",
    db: AsyncSession = Depends(get_db),
    user=Depends(get_current_user)
):
    """List images in S3/MinIO bucket"""
    if user.role not in ["admin", "restaurant_owner"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = s3_service.list_files(prefix)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=f"List failed: {result['error']}")
    
    return result

@router.get("/image/{object_name}/url")
async def get_image_url(
    object_name: str,
    db: AsyncSession = Depends(get_db)
):
    """Get the URL for an image (public endpoint)"""
    url = s3_service.get_file_url(object_name)
    return {"url": url} 