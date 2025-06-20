import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app.db import models
from sqlalchemy import update
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)

async def deactivate_expired_coupons():
    async with AsyncSessionLocal() as db:
        now = datetime.now()
        result = await db.execute(
            update(models.Coupon)
            .where(models.Coupon.valid_until < now, models.Coupon.is_active == True)
            .values(is_active=False)
        )
        await db.commit()
        logging.info(f"Deactivated expired coupons at {now}")

async def aggregate_daily_analytics():
    async with AsyncSessionLocal() as db:
        # Example: just log, real implementation would aggregate and store analytics
        logging.info(f"Aggregated daily analytics at {datetime.now()}")

async def send_scheduled_notifications():
    async with AsyncSessionLocal() as db:
        # Example: just log, real implementation would send notifications
        logging.info(f"Sent scheduled notifications at {datetime.now()}")

async def main():
    scheduler = AsyncIOScheduler()
    scheduler.add_job(deactivate_expired_coupons, 'interval', hours=1)
    scheduler.add_job(aggregate_daily_analytics, 'cron', hour=2, minute=0)
    scheduler.add_job(send_scheduled_notifications, 'interval', minutes=10)
    scheduler.start()
    logging.info("Batch jobs started.")
    while True:
        await asyncio.sleep(3600)

if __name__ == "__main__":
    asyncio.run(main()) 