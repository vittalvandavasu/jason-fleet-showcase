from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timedelta, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# ---------- Mongo ----------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "nwh-admin-2026")

# ---------- App ----------
app = FastAPI(title="Northwest Haul Rentals API")
api_router = APIRouter(prefix="/api")

# ---------- Trailer data (source of truth on backend) ----------
TRAILERS = [
    {
        "id": "car-hauler-20",
        "name": "Car Hauler 102\" x 20'",
        "category": "Car Hauler",
        "image": "https://images.unsplash.com/photo-1761917904658-2a9ecb84a169?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwxfHxjYXIlMjBoYXVsZXJ8ZW58MHx8fHwxNzg1MTA3MTM2fDA&ixlib=rb-4.1.0&q=85",
        "gvwr": "10,400 lbs",
        "features": ["Drive-over fenders", "12k lb winch", "Ramp extensions for low cars", "Heavy duty straps"],
        "pricing": {"hourly": 25, "weekday": 120, "weekend": 160, "weekly": 700, "monthly": 2100},
        "tag": "Most Popular",
    },
    {
        "id": "tilt-deck-22",
        "name": "Deckover Tilt 102\" x 22'",
        "category": "Tilt Deck",
        "image": "https://images.unsplash.com/photo-1682980799090-c4c6342be01a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHw0fHxjYXIlMjBoYXVsZXJ8ZW58MHx8fHwxNzg1MTA3MTM2fDA&ixlib=rb-4.1.0&q=85",
        "gvwr": "14,000 lbs",
        "features": ["Hydraulic tilt deck", "12k lb winch", "Heavy duty binders", "Chains + straps included"],
        "pricing": {"hourly": 30, "weekday": 140, "weekend": 180, "weekly": 800, "monthly": 2400},
        "tag": None,
    },
    {
        "id": "tilt-deck-24",
        "name": "Deckover Tilt 102\" x 24'",
        "category": "Tilt Deck",
        "image": "https://images.unsplash.com/photo-1756888218811-76f80423861b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwzfHxmbGF0YmVkJTIwdHJhaWxlcnxlbnwwfHx8fDE3ODUxMDcxNDN8MA&ixlib=rb-4.1.0&q=85",
        "gvwr": "14,000 lbs",
        "features": ["Hydraulic tilt deck", "12k lb winch", "Chains + binders", "Extra long deck length"],
        "pricing": {"hourly": 35, "weekday": 160, "weekend": 200, "weekly": 900, "monthly": 2700},
        "tag": None,
    },
    {
        "id": "2-car-36",
        "name": "2-Car Hauler 102\" x 36'",
        "category": "Car Hauler",
        "image": "https://images.unsplash.com/photo-1698998882426-39a6609ab10a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwyfHxmbGF0YmVkJTIwdHJhaWxlcnxlbnwwfHx8fDE3ODUxMDcxNDN8MA&ixlib=rb-4.1.0&q=85",
        "gvwr": "16,000 lbs",
        "features": ["Fits two full-size cars", "12k lb winch", "8 straps included", "Ramp extensions"],
        "pricing": {"hourly": 50, "weekday": 220, "weekend": 260, "weekly": 1200, "monthly": 3600},
        "tag": "Best Value",
    },
    {
        "id": "enclosed-20",
        "name": "Enclosed Cargo 20' + 2' Nose",
        "category": "Cargo",
        "image": "https://images.unsplash.com/photo-1520101244246-293f77ffc39e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHw0fHx0cmFpbGVyJTIwcmVudGFsfGVufDB8fHx8MTc4NTEwNzEzN3ww&ixlib=rb-4.1.0&q=85",
        "gvwr": "9,999 lbs",
        "features": ["E-track walls & floor", "Dollies + moving blankets", "12k lb winch", "Weather-proof interior"],
        "pricing": {"hourly": 35, "weekday": 180, "weekend": 220, "weekly": 1000, "monthly": 3000},
        "tag": None,
    },
    {
        "id": "enclosed-24",
        "name": "Enclosed Cargo 24' + 2' Nose",
        "category": "Cargo",
        "image": "https://images.unsplash.com/photo-1499147463149-adc471bbc639?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwzfHx0cmFpbGVyJTIwcmVudGFsfGVufDB8fHx8MTc4NTEwNzEzN3ww&ixlib=rb-4.1.0&q=85",
        "gvwr": "9,999 lbs",
        "features": ["Extra length for big loads", "E-track walls & floor", "Moving supplies included", "12k lb winch"],
        "pricing": {"hourly": 40, "weekday": 200, "weekend": 240, "weekly": 1100, "monthly": 3300},
        "tag": None,
    },
    {
        "id": "utility-16",
        "name": "16ft Utility Trailer",
        "category": "Utility",
        "image": "https://images.unsplash.com/photo-1772852336286-933f5b460e33?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwzfHx1dGlsaXR5JTIwdHJhaWxlcnxlbnwwfHx8fDE3ODUxMDcxMzZ8MA&ixlib=rb-4.1.0&q=85",
        "gvwr": "7,000 lbs",
        "features": ["Removable side rails", "Side-loading ramps", "E-track on floor", "Perfect for landscaping"],
        "pricing": {"hourly": 20, "weekday": 100, "weekend": 140, "weekly": 600, "monthly": 1800},
        "tag": None,
    },
    {
        "id": "utility-12",
        "name": "12ft Utility Trailer",
        "category": "Utility",
        "image": "https://images.unsplash.com/photo-1767651871489-146f3815f310?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHw0fHx1dGlsaXR5JTIwdHJhaWxlcnxlbnwwfHx8fDE3ODUxMDcxMzZ8MA&ixlib=rb-4.1.0&q=85",
        "gvwr": "3,500 lbs",
        "features": ["Compact & maneuverable", "Removable side rails", "Ramps included", "Great for small hauls"],
        "pricing": {"hourly": 20, "weekday": 80, "weekend": 120, "weekly": 500, "monthly": 1500},
        "tag": "Budget Pick",
    },
]

VALID_TRAILER_IDS = {t["id"] for t in TRAILERS}
VALID_STATUSES = {"pending", "confirmed", "completed", "rejected"}


# ---------- Models ----------
class BookingCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=3, max_length=40)
    trailer: Optional[str] = ""
    pickup: Optional[str] = ""
    duration: Optional[str] = "24 Hours"
    message: Optional[str] = ""


class Booking(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    trailer: str
    pickup: str
    duration: str
    message: str
    status: str
    created_at: str


class StatusUpdate(BaseModel):
    status: str


# ---------- Auth ----------
async def require_admin(x_admin_token: Optional[str] = Header(default=None)):
    if not x_admin_token or x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid or missing admin token")
    return True


# ---------- Public routes ----------
@api_router.get("/")
async def root():
    return {"message": "Northwest Haul Rentals API"}


@api_router.get("/trailers")
async def get_trailers():
    return TRAILERS


@api_router.post("/bookings", response_model=Booking)
async def create_booking(payload: BookingCreate):
    trailer_id = (payload.trailer or "").strip()
    if trailer_id and trailer_id not in VALID_TRAILER_IDS:
        raise HTTPException(status_code=400, detail="Unknown trailer id")

    doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name.strip(),
        "email": payload.email.strip().lower(),
        "phone": payload.phone.strip(),
        "trailer": trailer_id,
        "pickup": (payload.pickup or "").strip(),
        "duration": (payload.duration or "24 Hours").strip(),
        "message": (payload.message or "").strip(),
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.bookings.insert_one(doc)
    return Booking(**doc)


# ---------- Admin routes ----------
@api_router.get("/admin/bookings", response_model=List[Booking])
async def list_bookings(_: bool = Depends(require_admin)):
    docs = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(length=1000)
    return [Booking(**d) for d in docs]


@api_router.patch("/admin/bookings/{booking_id}", response_model=Booking)
async def update_booking_status(
    booking_id: str, payload: StatusUpdate, _: bool = Depends(require_admin)
):
    if payload.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.bookings.find_one_and_update(
        {"id": booking_id},
        {"$set": {"status": payload.status}},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Booking not found")
    return Booking(**result)


@api_router.delete("/admin/bookings/{booking_id}")
async def delete_booking(booking_id: str, _: bool = Depends(require_admin)):
    result = await db.bookings.delete_one({"id": booking_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"ok": True}


@api_router.get("/admin/stats")
async def stats(_: bool = Depends(require_admin)):
    total = await db.bookings.count_documents({})
    counts = {}
    for s in VALID_STATUSES:
        counts[s] = await db.bookings.count_documents({"status": s})
    week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    week_count = await db.bookings.count_documents({"created_at": {"$gte": week_ago}})
    return {"total": total, **counts, "week_count": week_count}


@api_router.post("/admin/verify")
async def verify_admin(_: bool = Depends(require_admin)):
    return {"ok": True}


# ---------- Mount ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
