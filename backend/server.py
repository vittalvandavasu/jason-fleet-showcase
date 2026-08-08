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
        "id": "maxxd-c4x-7k",
        "name": "MAXX-D C4X 7K Car Hauler",
        "manufacturer": "MAXX-D (Maxey Trailers)",
        "model": "C4X 7K Channel",
        "year": "2022",
        "category": "Car Hauler",
        "tag": "Most Popular",
        "image": "https://cdn.prod.website-files.com/5e934f5984b55d1317689cd8/6a3d890dffee5b3be7951a87_IMG_7478.jpeg",
        "gvwr": "7,000 lbs",
        "gawr": "3,500 lbs / axle",
        "axles": "Tandem 3,500 lb brake axles",
        "deck": "2\u00d78 treated wood \u00b7 83\" wide",
        "payload": "~4,500\u20135,000 lbs",
        "bestFor": ["Cars & light trucks", "ATVs & UTVs", "Small equipment", "Flatbed hauls"],
        "features": [
            "5\u2033 channel main frame + wrap tongue",
            "Slide-in rear ramps",
            "Double-broke diamond-plate fenders",
            "Stake pockets + rub rail",
            "7K drop-leg jack",
            "LED lighting, dual spare tires included",
        ],
        "pricing": {"hourly": 25, "weekday": 120, "weekend": 160, "weekly": 700, "monthly": 2100},
    },
    {
        "id": "continental-cargo",
        "name": "Continental Enclosed Cargo",
        "manufacturer": "Continental Cargo",
        "model": "Bumper-pull Enclosed",
        "year": None,
        "category": "Cargo",
        "tag": "Best Value",
        "image": "https://customer-assets-agu9un31.emergentagent.net/job_fleet-showcase-20/artifacts/wcgnabxf_087b66f8-3396-4591-90d1-05f9abf33926.jfif",
        "gvwr": "Up to 7,000 lbs",
        "gawr": "3,500 lbs / axle",
        "axles": "Single or tandem (tandem in-fleet)",
        "deck": "Fully enclosed \u00b7 diamond-plate lower",
        "payload": "~1,500\u20135,000+ lbs",
        "bestFor": ["Secure moves", "Weather-sensitive loads", "Motorcycles", "Small vehicles"],
        "features": [
            "Fully enclosed weather-proof body",
            "Rear ramp / barn-door access",
            "Diamond-plate lower protection",
            "Interior 6\u20137 ft height",
            "E-track walls & floor",
            "Lockable for high-value hauls",
        ],
        "pricing": {"hourly": 35, "weekday": 180, "weekend": 220, "weekly": 1000, "monthly": 3000},
    },
    {
        "id": "olympic-utility",
        "name": "Olympic Open Utility",
        "manufacturer": "Olympic",
        "model": "Single-axle Utility",
        "year": None,
        "category": "Utility",
        "tag": None,
        "image": "https://d17qgzvii7d4wm.cloudfront.net/s3/img.rv/39740/i/5221979/o/1_39740_5221979_320614211.jpg",
        "gvwr": "2,990 lbs",
        "gawr": "3,500 lbs",
        "axles": "Single axle",
        "deck": "Open box, solid ribbed sides",
        "payload": "~1,800\u20132,400 lbs",
        "bestFor": ["Furniture & appliances", "Lawn equipment", "General cargo", "Light construction"],
        "features": [
            "Solid ribbed metal side panels",
            "Fold-down / ramp-style rear gate",
            "A-frame tongue with swivel jack",
            "Single axle with fenders",
            "Safety chains included",
            "Better weather protection than mesh",
        ],
        "pricing": {"hourly": 20, "weekday": 90, "weekend": 130, "weekly": 550, "monthly": 1700},
    },
    {
        "id": "eagle-landscape",
        "name": "Eagle Landscape Trailer",
        "manufacturer": "Eagle",
        "model": "Open Landscape / Utility",
        "year": None,
        "category": "Landscape",
        "tag": None,
        "image": "https://www.trailersuperstore.com/content/uploads/2023/06/2025-CARRY-ON-7X18-LANDSCAPE-UTILITY-TRAILER-RAMP-GATE-1.jpg",
        "gvwr": "2,990\u20133,500 lbs",
        "gawr": "3,500 lbs",
        "axles": "Single axle",
        "deck": "Open flat deck \u00b7 mesh sides",
        "payload": "~1,500\u20132,500+ lbs",
        "bestFor": ["Yard debris & brush", "Landscaping crews", "ATVs", "Loose material"],
        "features": [
            "High expanded-metal mesh sides",
            "Solid front, rear access ramp/gate",
            "Tongue jack + safety chains",
            "White modular wheels",
            "Red side markers & reflectors",
            "Easy load / unload",
        ],
        "pricing": {"hourly": 20, "weekday": 80, "weekend": 120, "weekly": 500, "monthly": 1500},
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
