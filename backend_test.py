#!/usr/bin/env python3
"""
Regression test for Northwest Haul Rentals backend after trailer inventory update
Tests the 4 new trailers: maxxd-c4x-7k, continental-cargo, olympic-utility, eagle-landscape
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

# Store booking IDs for cleanup
created_booking_ids = []

# ============================================================================
# REGRESSION TEST: NEW TRAILER INVENTORY
# ============================================================================

print("\n🚛 TRAILER INVENTORY REGRESSION TEST")
print("-" * 80)

def test_trailers_count_and_ids():
    """GET /api/trailers should return exactly 4 trailers with new IDs"""
    resp = requests.get(f"{BASE_URL}/api/trailers")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    assert isinstance(data, list), "Response should be a list"
    assert len(data) == 4, f"Expected exactly 4 trailers, got {len(data)}"
    
    # Check for the 4 new trailer IDs
    expected_ids = {"maxxd-c4x-7k", "continental-cargo", "olympic-utility", "eagle-landscape"}
    actual_ids = {t["id"] for t in data}
    assert actual_ids == expected_ids, f"Expected IDs {expected_ids}, got {actual_ids}"
    
    print(f"   ✓ Found all 4 new trailers: {', '.join(sorted(actual_ids))}")

test("GET /api/trailers returns exactly 4 trailers with correct IDs", test_trailers_count_and_ids)

def test_trailer_structure():
    """Each trailer should have all required fields"""
    resp = requests.get(f"{BASE_URL}/api/trailers")
    data = resp.json()
    
    required_fields = [
        "id", "name", "manufacturer", "category", "gvwr", "gawr", "axles", 
        "deck", "payload", "bestFor", "features", "pricing"
    ]
    pricing_fields = ["hourly", "weekday", "weekend", "weekly", "monthly"]
    
    for trailer in data:
        trailer_id = trailer.get("id", "unknown")
        for field in required_fields:
            assert field in trailer, f"Trailer {trailer_id} missing field: {field}"
        
        # Check pricing structure
        pricing = trailer["pricing"]
        for field in pricing_fields:
            assert field in pricing, f"Trailer {trailer_id} pricing missing: {field}"
    
    print(f"   ✓ All trailers have required fields: manufacturer, gvwr, gawr, axles, deck, payload, bestFor, features, pricing")

test("All trailers have complete structure with required fields", test_trailer_structure)

# ============================================================================
# BOOKING TESTS WITH NEW TRAILER IDS
# ============================================================================

print("\n📝 BOOKING TESTS")
print("-" * 80)

def test_booking_with_new_trailer():
    """POST /api/bookings with new trailer 'maxxd-c4x-7k' should succeed"""
    payload = {
        "name": "Michael Rodriguez",
        "email": "michael.rodriguez@example.com",
        "phone": "(206) 555-0123",
        "trailer": "maxxd-c4x-7k",
        "pickup": "2026-08-15",
        "duration": "Weekend",
        "message": "Need to haul a car to Seattle"
    }
    resp = requests.post(f"{BASE_URL}/api/bookings", json=payload)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
    data = resp.json()
    
    assert "id" in data, "Response should contain booking id"
    assert data["status"] == "pending", f"Expected status 'pending', got {data['status']}"
    assert data["trailer"] == "maxxd-c4x-7k", "Trailer ID mismatch"
    assert "created_at" in data, "Response should contain created_at"
    
    created_booking_ids.append(data["id"])
    print(f"   ✓ Created booking {data['id']} with trailer maxxd-c4x-7k")

test("POST /api/bookings with new trailer 'maxxd-c4x-7k' returns 200", test_booking_with_new_trailer)

def test_booking_with_old_trailer():
    """POST /api/bookings with old trailer 'car-hauler-20' should return 400"""
    payload = {
        "name": "Sarah Johnson",
        "email": "sarah.johnson@example.com",
        "phone": "(425) 555-0199",
        "trailer": "car-hauler-20",
        "pickup": "2026-08-20",
        "duration": "24 Hours",
        "message": "Trying to book old trailer"
    }
    resp = requests.post(f"{BASE_URL}/api/bookings", json=payload)
    assert resp.status_code == 400, f"Expected 400 for old trailer ID, got {resp.status_code}"
    data = resp.json()
    assert "Unknown trailer id" in data.get("detail", ""), f"Expected 'Unknown trailer id' error, got: {data}"
    print(f"   ✓ Old trailer 'car-hauler-20' correctly rejected with 400")

test("POST /api/bookings with old trailer 'car-hauler-20' returns 400", test_booking_with_old_trailer)

def test_booking_with_empty_trailer():
    """POST /api/bookings with empty trailer should still be allowed"""
    payload = {
        "name": "Emily Chen",
        "email": "emily.chen@example.com",
        "phone": "(360) 555-0177",
        "trailer": "",
        "pickup": "2026-08-25",
        "duration": "48 Hours",
        "message": "General inquiry about rentals"
    }
    resp = requests.post(f"{BASE_URL}/api/bookings", json=payload)
    assert resp.status_code == 200, f"Expected 200 for empty trailer, got {resp.status_code}: {resp.text}"
    data = resp.json()
    assert "id" in data, "Response should contain booking id"
    assert data["trailer"] == "", "Trailer should be empty string"
    
    created_booking_ids.append(data["id"])
    print(f"   ✓ Empty trailer booking allowed, created {data['id']}")

test("POST /api/bookings with empty trailer returns 200", test_booking_with_empty_trailer)

# ============================================================================
# ADMIN ENDPOINTS
# ============================================================================

print("\n🔐 ADMIN ENDPOINTS")
print("-" * 80)

def test_admin_get_bookings():
    """GET /api/admin/bookings with X-Admin-Token should work"""
    headers = {"X-Admin-Token": ADMIN_TOKEN}
    resp = requests.get(f"{BASE_URL}/api/admin/bookings", headers=headers)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    assert isinstance(data, list), "Response should be a list"
    
    # Verify our created bookings are in the list
    booking_ids = [b["id"] for b in data]
    for created_id in created_booking_ids:
        assert created_id in booking_ids, f"Created booking {created_id} not found"
    
    print(f"   ✓ Retrieved {len(data)} bookings, including {len(created_booking_ids)} test bookings")

test("GET /api/admin/bookings with X-Admin-Token returns 200", test_admin_get_bookings)

def test_admin_get_stats():
    """GET /api/admin/stats with X-Admin-Token should work"""
    headers = {"X-Admin-Token": ADMIN_TOKEN}
    resp = requests.get(f"{BASE_URL}/api/admin/stats", headers=headers)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    
    required_fields = ["total", "pending", "confirmed", "completed", "rejected", "week_count"]
    for field in required_fields:
        assert field in data, f"Stats missing field: {field}"
        assert isinstance(data[field], int), f"Field {field} should be integer"
    
    print(f"   ✓ Stats: {data['total']} total, {data['pending']} pending, {data['week_count']} this week")

test("GET /api/admin/stats with X-Admin-Token returns 200", test_admin_get_stats)

def test_admin_patch_booking():
    """PATCH /api/admin/bookings/{id} with X-Admin-Token should work"""
    if not created_booking_ids:
        raise AssertionError("No bookings to test PATCH")
    
    booking_id = created_booking_ids[0]
    headers = {"X-Admin-Token": ADMIN_TOKEN}
    payload = {"status": "confirmed"}
    resp = requests.patch(f"{BASE_URL}/api/admin/bookings/{booking_id}", json=payload, headers=headers)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
    data = resp.json()
    assert data["status"] == "confirmed", f"Expected status 'confirmed', got {data['status']}"
    print(f"   ✓ Updated booking {booking_id} status to 'confirmed'")

test("PATCH /api/admin/bookings/{id} with X-Admin-Token returns 200", test_admin_patch_booking)

def test_admin_delete_booking():
    """DELETE /api/admin/bookings/{id} with X-Admin-Token should work"""
    if not created_booking_ids:
        raise AssertionError("No bookings to test DELETE")
    
    booking_id = created_booking_ids[-1]
    headers = {"X-Admin-Token": ADMIN_TOKEN}
    resp = requests.delete(f"{BASE_URL}/api/admin/bookings/{booking_id}", headers=headers)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
    data = resp.json()
    assert data.get("ok") == True, f"Expected ok=true, got {data}"
    
    # Verify deletion
    resp = requests.get(f"{BASE_URL}/api/admin/bookings", headers=headers)
    bookings = resp.json()
    booking_ids = [b["id"] for b in bookings]
    assert booking_id not in booking_ids, "Booking still exists after deletion"
    
    created_booking_ids.remove(booking_id)
    print(f"   ✓ Deleted booking {booking_id}")

test("DELETE /api/admin/bookings/{id} with X-Admin-Token returns 200", test_admin_delete_booking)

# ============================================================================
# CLEANUP
# ============================================================================

print("\n🧹 CLEANUP")
print("-" * 80)

def cleanup_test_bookings():
    """Delete all remaining test bookings"""
    headers = {"X-Admin-Token": ADMIN_TOKEN}
    deleted_count = 0
    for booking_id in created_booking_ids[:]:
        try:
            resp = requests.delete(f"{BASE_URL}/api/admin/bookings/{booking_id}", headers=headers)
            if resp.status_code == 200:
                deleted_count += 1
                created_booking_ids.remove(booking_id)
        except Exception as e:
            print(f"   ⚠️  Failed to delete {booking_id}: {e}")
    
    print(f"   ✓ Cleaned up {deleted_count} test bookings")

test("Cleanup: Delete all test bookings", cleanup_test_bookings)

# ============================================================================
# SUMMARY
# ============================================================================

print("\n" + "=" * 80)
print("📊 REGRESSION TEST SUMMARY")
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
else:
    print("\n✅ ALL REGRESSION TESTS PASSED!")
    print("   • 4 new trailers verified (maxxd-c4x-7k, continental-cargo, olympic-utility, eagle-landscape)")
    print("   • Old trailer 'car-hauler-20' correctly rejected")
    print("   • All admin endpoints working with X-Admin-Token")
    print("   • Test bookings cleaned up")

exit(0 if failed == 0 else 1)
