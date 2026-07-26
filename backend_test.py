#!/usr/bin/env python3
"""
Comprehensive backend API tests for Northwest Haul Rentals
Tests all endpoints under /api prefix using REACT_APP_BACKEND_URL
"""

import requests
import json
from pathlib import Path
from dotenv import dotenv_values

# Load environment variables
frontend_env = dotenv_values("/app/frontend/.env")
backend_env = dotenv_values("/app/backend/.env")

BASE_URL = frontend_env.get("REACT_APP_BACKEND_URL", "").rstrip("/")
ADMIN_TOKEN = backend_env.get("ADMIN_TOKEN", "nwh-admin-2026")

print(f"🔧 Testing backend at: {BASE_URL}")
print(f"🔑 Using admin token: {ADMIN_TOKEN}")
print("=" * 80)

# Test results tracking
passed = 0
failed = 0
test_results = []

def test(name, func):
    """Run a test and track results"""
    global passed, failed
    try:
        func()
        passed += 1
        test_results.append(("✅", name))
        print(f"✅ {name}")
    except AssertionError as e:
        failed += 1
        test_results.append(("❌", name, str(e)))
        print(f"❌ {name}")
        print(f"   Error: {e}")
    except Exception as e:
        failed += 1
        test_results.append(("❌", name, f"Exception: {str(e)}"))
        print(f"❌ {name}")
        print(f"   Exception: {e}")

# Store booking IDs for later tests
created_booking_ids = []

# ============================================================================
# PUBLIC ENDPOINTS
# ============================================================================

print("\n📋 PUBLIC ENDPOINTS")
print("-" * 80)

def test_root():
    """GET /api/ should return welcome message"""
    resp = requests.get(f"{BASE_URL}/api/")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    assert "message" in data, "Response should contain 'message' field"
    assert "Northwest Haul Rentals API" in data["message"], f"Unexpected message: {data['message']}"

test("GET /api/ returns 200 with welcome message", test_root)

def test_get_trailers():
    """GET /api/trailers should return list of trailers with proper structure"""
    resp = requests.get(f"{BASE_URL}/api/trailers")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    assert isinstance(data, list), "Response should be a list"
    assert len(data) > 0, "Trailers list should not be empty"
    
    # Check first trailer has required fields
    trailer = data[0]
    required_fields = ["id", "name", "category", "pricing", "features", "gvwr", "image"]
    for field in required_fields:
        assert field in trailer, f"Trailer missing required field: {field}"
    
    # Check pricing structure
    pricing = trailer["pricing"]
    pricing_fields = ["hourly", "weekday", "weekend", "weekly", "monthly"]
    for field in pricing_fields:
        assert field in pricing, f"Pricing missing field: {field}"

test("GET /api/trailers returns non-empty list with proper structure", test_get_trailers)

def test_create_booking_valid():
    """POST /api/bookings with valid payload should create booking"""
    payload = {
        "name": "John Smith",
        "email": "john.smith@example.com",
        "phone": "(555) 123-4567",
        "trailer": "car-hauler-20",
        "pickup": "2026-08-01",
        "duration": "24 Hours",
        "message": "Test booking for car hauler"
    }
    resp = requests.post(f"{BASE_URL}/api/bookings", json=payload)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
    data = resp.json()
    
    # Check response structure
    assert "id" in data, "Response should contain booking id"
    assert data["status"] == "pending", f"Expected status 'pending', got {data['status']}"
    assert "created_at" in data, "Response should contain created_at timestamp"
    assert data["name"] == payload["name"], "Name mismatch"
    assert data["email"] == payload["email"].lower(), "Email mismatch"
    assert data["trailer"] == payload["trailer"], "Trailer mismatch"
    
    # Store booking ID for later tests
    created_booking_ids.append(data["id"])

test("POST /api/bookings with valid payload returns 200 with booking", test_create_booking_valid)

def test_create_booking_missing_name():
    """POST /api/bookings without name should return 422"""
    payload = {
        "email": "test@example.com",
        "phone": "555-1234",
        "trailer": "car-hauler-20"
    }
    resp = requests.post(f"{BASE_URL}/api/bookings", json=payload)
    assert resp.status_code == 422, f"Expected 422, got {resp.status_code}"

test("POST /api/bookings missing name returns 422", test_create_booking_missing_name)

def test_create_booking_missing_email():
    """POST /api/bookings without email should return 422"""
    payload = {
        "name": "John Doe",
        "phone": "555-1234",
        "trailer": "car-hauler-20"
    }
    resp = requests.post(f"{BASE_URL}/api/bookings", json=payload)
    assert resp.status_code == 422, f"Expected 422, got {resp.status_code}"

test("POST /api/bookings missing email returns 422", test_create_booking_missing_email)

def test_create_booking_missing_phone():
    """POST /api/bookings without phone should return 422"""
    payload = {
        "name": "John Doe",
        "email": "test@example.com",
        "trailer": "car-hauler-20"
    }
    resp = requests.post(f"{BASE_URL}/api/bookings", json=payload)
    assert resp.status_code == 422, f"Expected 422, got {resp.status_code}"

test("POST /api/bookings missing phone returns 422", test_create_booking_missing_phone)

def test_create_booking_invalid_email():
    """POST /api/bookings with invalid email should return 422"""
    payload = {
        "name": "John Doe",
        "email": "not-an-email",
        "phone": "555-1234",
        "trailer": "car-hauler-20"
    }
    resp = requests.post(f"{BASE_URL}/api/bookings", json=payload)
    assert resp.status_code == 422, f"Expected 422, got {resp.status_code}"

test("POST /api/bookings with invalid email returns 422", test_create_booking_invalid_email)

def test_create_booking_unknown_trailer():
    """POST /api/bookings with unknown trailer id should return 400"""
    payload = {
        "name": "John Doe",
        "email": "test@example.com",
        "phone": "555-1234",
        "trailer": "does-not-exist"
    }
    resp = requests.post(f"{BASE_URL}/api/bookings", json=payload)
    assert resp.status_code == 400, f"Expected 400, got {resp.status_code}"
    data = resp.json()
    assert "Unknown trailer id" in data.get("detail", ""), f"Expected 'Unknown trailer id' in error, got: {data}"

test("POST /api/bookings with unknown trailer id returns 400", test_create_booking_unknown_trailer)

def test_create_booking_empty_trailer():
    """POST /api/bookings with empty trailer should succeed (allowed)"""
    payload = {
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "phone": "555-9876",
        "trailer": "",
        "pickup": "2026-08-15",
        "duration": "48 Hours",
        "message": "General inquiry"
    }
    resp = requests.post(f"{BASE_URL}/api/bookings", json=payload)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
    data = resp.json()
    assert "id" in data, "Response should contain booking id"
    created_booking_ids.append(data["id"])

test("POST /api/bookings with empty trailer returns 200", test_create_booking_empty_trailer)

# ============================================================================
# ADMIN AUTH
# ============================================================================

print("\n🔐 ADMIN AUTHENTICATION")
print("-" * 80)

def test_admin_verify_no_header():
    """POST /api/admin/verify without header should return 401"""
    resp = requests.post(f"{BASE_URL}/api/admin/verify")
    assert resp.status_code == 401, f"Expected 401, got {resp.status_code}"

test("POST /api/admin/verify without header returns 401", test_admin_verify_no_header)

def test_admin_verify_wrong_header():
    """POST /api/admin/verify with wrong token should return 401"""
    headers = {"X-Admin-Token": "wrong-token"}
    resp = requests.post(f"{BASE_URL}/api/admin/verify", headers=headers)
    assert resp.status_code == 401, f"Expected 401, got {resp.status_code}"

test("POST /api/admin/verify with wrong token returns 401", test_admin_verify_wrong_header)

def test_admin_verify_correct():
    """POST /api/admin/verify with correct token should return 200"""
    headers = {"X-Admin-Token": ADMIN_TOKEN}
    resp = requests.post(f"{BASE_URL}/api/admin/verify", headers=headers)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    assert data.get("ok") == True, f"Expected ok=true, got {data}"

test("POST /api/admin/verify with correct token returns 200", test_admin_verify_correct)

# ============================================================================
# ADMIN LISTING / STATS
# ============================================================================

print("\n📊 ADMIN LISTING & STATS")
print("-" * 80)

def test_admin_list_bookings():
    """GET /api/admin/bookings should return list sorted by created_at desc"""
    headers = {"X-Admin-Token": ADMIN_TOKEN}
    resp = requests.get(f"{BASE_URL}/api/admin/bookings", headers=headers)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    assert isinstance(data, list), "Response should be a list"
    
    # Check that our created bookings are in the list
    booking_ids_in_response = [b["id"] for b in data]
    for booking_id in created_booking_ids:
        assert booking_id in booking_ids_in_response, f"Created booking {booking_id} not found in list"
    
    # Check sorting (most recent first)
    if len(data) > 1:
        for i in range(len(data) - 1):
            assert data[i]["created_at"] >= data[i+1]["created_at"], "Bookings not sorted by created_at desc"

test("GET /api/admin/bookings returns list sorted by created_at desc", test_admin_list_bookings)

def test_admin_stats():
    """GET /api/admin/stats should return counts"""
    headers = {"X-Admin-Token": ADMIN_TOKEN}
    resp = requests.get(f"{BASE_URL}/api/admin/stats", headers=headers)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    
    # Check required fields
    required_fields = ["total", "pending", "confirmed", "completed", "rejected", "week_count"]
    for field in required_fields:
        assert field in data, f"Stats missing field: {field}"
        assert isinstance(data[field], int), f"Field {field} should be an integer"
    
    # Total should be at least the number of bookings we created
    assert data["total"] >= len(created_booking_ids), f"Total count {data['total']} less than created bookings {len(created_booking_ids)}"

test("GET /api/admin/stats returns proper counts", test_admin_stats)

# ============================================================================
# ADMIN UPDATE / DELETE
# ============================================================================

print("\n✏️  ADMIN UPDATE & DELETE")
print("-" * 80)

def test_admin_update_status_valid():
    """PATCH /api/admin/bookings/{id} with valid status should update"""
    if not created_booking_ids:
        raise AssertionError("No bookings created to test update")
    
    booking_id = created_booking_ids[0]
    headers = {"X-Admin-Token": ADMIN_TOKEN}
    payload = {"status": "confirmed"}
    resp = requests.patch(f"{BASE_URL}/api/admin/bookings/{booking_id}", json=payload, headers=headers)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
    data = resp.json()
    assert data["status"] == "confirmed", f"Expected status 'confirmed', got {data['status']}"
    assert data["id"] == booking_id, "Booking ID mismatch"

test("PATCH /api/admin/bookings/{id} with valid status returns 200", test_admin_update_status_valid)

def test_admin_update_status_invalid():
    """PATCH /api/admin/bookings/{id} with invalid status should return 400"""
    if not created_booking_ids:
        raise AssertionError("No bookings created to test update")
    
    booking_id = created_booking_ids[0]
    headers = {"X-Admin-Token": ADMIN_TOKEN}
    payload = {"status": "banana"}
    resp = requests.patch(f"{BASE_URL}/api/admin/bookings/{booking_id}", json=payload, headers=headers)
    assert resp.status_code == 400, f"Expected 400, got {resp.status_code}"

test("PATCH /api/admin/bookings/{id} with invalid status returns 400", test_admin_update_status_invalid)

def test_admin_update_nonexistent():
    """PATCH /api/admin/bookings/nonexistent-id should return 404"""
    headers = {"X-Admin-Token": ADMIN_TOKEN}
    payload = {"status": "confirmed"}
    resp = requests.patch(f"{BASE_URL}/api/admin/bookings/nonexistent-id", json=payload, headers=headers)
    assert resp.status_code == 404, f"Expected 404, got {resp.status_code}"

test("PATCH /api/admin/bookings/nonexistent-id returns 404", test_admin_update_nonexistent)

def test_admin_delete_valid():
    """DELETE /api/admin/bookings/{id} should delete booking"""
    if not created_booking_ids:
        raise AssertionError("No bookings created to test delete")
    
    booking_id = created_booking_ids[-1]  # Delete the last one
    headers = {"X-Admin-Token": ADMIN_TOKEN}
    resp = requests.delete(f"{BASE_URL}/api/admin/bookings/{booking_id}", headers=headers)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
    data = resp.json()
    assert data.get("ok") == True, f"Expected ok=true, got {data}"
    
    # Verify it's actually deleted
    resp = requests.get(f"{BASE_URL}/api/admin/bookings", headers=headers)
    bookings = resp.json()
    booking_ids = [b["id"] for b in bookings]
    assert booking_id not in booking_ids, "Booking still exists after deletion"

test("DELETE /api/admin/bookings/{id} returns 200 and deletes booking", test_admin_delete_valid)

def test_admin_delete_nonexistent():
    """DELETE /api/admin/bookings/nonexistent-id should return 404"""
    headers = {"X-Admin-Token": ADMIN_TOKEN}
    resp = requests.delete(f"{BASE_URL}/api/admin/bookings/nonexistent-id", headers=headers)
    assert resp.status_code == 404, f"Expected 404, got {resp.status_code}"

test("DELETE /api/admin/bookings/nonexistent-id returns 404", test_admin_delete_nonexistent)

# ============================================================================
# SUMMARY
# ============================================================================

print("\n" + "=" * 80)
print("📊 TEST SUMMARY")
print("=" * 80)
print(f"✅ Passed: {passed}")
print(f"❌ Failed: {failed}")
print(f"📈 Total:  {passed + failed}")
print(f"🎯 Success Rate: {(passed / (passed + failed) * 100):.1f}%")
print("=" * 80)

if failed > 0:
    print("\n❌ FAILED TESTS:")
    for result in test_results:
        if result[0] == "❌":
            print(f"  • {result[1]}")
            if len(result) > 2:
                print(f"    {result[2]}")

exit(0 if failed == 0 else 1)
