#!/usr/bin/env python3
"""
Test suite for Northwest Haul Rentals backend - NEW ENDPOINTS
Tests single trailer detail, booked-dates, date range bookings, and overlap detection
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
# TEST 1: GET /api/trailers/{id} - Single Trailer Detail
# ============================================================================

print("\n🚛 TEST 1: GET /api/trailers/{id} - Single Trailer Detail")
print("-" * 80)

def test_get_single_trailer_success():
    """GET /api/trailers/maxxd-c4x-7k should return 200 with complete trailer object"""
    resp = requests.get(f"{BASE_URL}/api/trailers/maxxd-c4x-7k")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    
    # Verify required fields
    assert data["id"] == "maxxd-c4x-7k", f"Expected id 'maxxd-c4x-7k', got {data.get('id')}"
    assert "image" in data, "Missing 'image' field"
    assert "gallery" in data, "Missing 'gallery' field"
    assert isinstance(data["gallery"], list), "Gallery should be a list"
    assert len(data["gallery"]) >= 1, f"Gallery should have at least 1 item, got {len(data['gallery'])}"
    assert "manufacturer" in data, "Missing 'manufacturer' field"
    assert "pricing" in data, "Missing 'pricing' field"
    assert "features" in data, "Missing 'features' field"
    assert "bestFor" in data, "Missing 'bestFor' field"
    
    print(f"   ✓ Trailer 'maxxd-c4x-7k' returned with all required fields")
    print(f"   ✓ Gallery has {len(data['gallery'])} images")

test("GET /api/trailers/maxxd-c4x-7k returns 200 with complete object", test_get_single_trailer_success)

def test_get_single_trailer_not_found():
    """GET /api/trailers/does-not-exist should return 404"""
    resp = requests.get(f"{BASE_URL}/api/trailers/does-not-exist")
    assert resp.status_code == 404, f"Expected 404, got {resp.status_code}"
    data = resp.json()
    assert "not found" in data.get("detail", "").lower(), f"Expected 'not found' error, got: {data}"
    print(f"   ✓ Non-existent trailer correctly returns 404")

test("GET /api/trailers/does-not-exist returns 404", test_get_single_trailer_not_found)

# ============================================================================
# TEST 2: GET /api/trailers/{id}/booked-dates
# ============================================================================

print("\n📅 TEST 2: GET /api/trailers/{id}/booked-dates")
print("-" * 80)

def test_get_booked_dates_success():
    """GET /api/trailers/maxxd-c4x-7k/booked-dates should return 200 with structure"""
    resp = requests.get(f"{BASE_URL}/api/trailers/maxxd-c4x-7k/booked-dates")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    
    assert "trailer" in data, "Missing 'trailer' field"
    assert data["trailer"] == "maxxd-c4x-7k", f"Expected trailer 'maxxd-c4x-7k', got {data['trailer']}"
    assert "ranges" in data, "Missing 'ranges' field"
    assert isinstance(data["ranges"], list), "Ranges should be a list"
    
    print(f"   ✓ Booked-dates endpoint returns correct structure")
    print(f"   ✓ Currently {len(data['ranges'])} booked ranges for maxxd-c4x-7k")

test("GET /api/trailers/maxxd-c4x-7k/booked-dates returns 200", test_get_booked_dates_success)

def test_get_booked_dates_not_found():
    """GET /api/trailers/does-not-exist/booked-dates should return 404"""
    resp = requests.get(f"{BASE_URL}/api/trailers/does-not-exist/booked-dates")
    assert resp.status_code == 404, f"Expected 404, got {resp.status_code}"
    data = resp.json()
    assert "not found" in data.get("detail", "").lower(), f"Expected 'not found' error, got: {data}"
    print(f"   ✓ Non-existent trailer correctly returns 404")

test("GET /api/trailers/does-not-exist/booked-dates returns 404", test_get_booked_dates_not_found)

# ============================================================================
# TEST 3: POST /api/bookings with Date Range
# ============================================================================

print("\n📝 TEST 3: POST /api/bookings with Date Range")
print("-" * 80)

def test_create_booking_with_date_range():
    """Create booking with trailer=maxxd-c4x-7k, pickup=2027-01-10, end_date=2027-01-15"""
    payload = {
        "name": "James Wilson",
        "email": "james.wilson@example.com",
        "phone": "(206) 555-0100",
        "trailer": "maxxd-c4x-7k",
        "pickup": "2027-01-10",
        "end_date": "2027-01-15",
        "duration": "5 Days",
        "message": "Need car hauler for a week"
    }
    resp = requests.post(f"{BASE_URL}/api/bookings", json=payload)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
    data = resp.json()
    
    assert "id" in data, "Response should contain booking id"
    assert data["status"] == "pending", f"Expected status 'pending', got {data['status']}"
    assert data["trailer"] == "maxxd-c4x-7k", "Trailer ID mismatch"
    assert data["pickup"] == "2027-01-10", f"Expected pickup '2027-01-10', got {data['pickup']}"
    assert data["end_date"] == "2027-01-15", f"Expected end_date '2027-01-15', got {data['end_date']}"
    
    created_booking_ids.append(data["id"])
    print(f"   ✓ Created booking {data['id']} for 2027-01-10 to 2027-01-15")

test("POST /api/bookings with date range (2027-01-10 to 2027-01-15) returns 200", test_create_booking_with_date_range)

def test_create_overlapping_booking():
    """Create ANOTHER booking with overlapping dates (2027-01-12 to 2027-01-14) should return 409"""
    payload = {
        "name": "Sarah Martinez",
        "email": "sarah.martinez@example.com",
        "phone": "(425) 555-0200",
        "trailer": "maxxd-c4x-7k",
        "pickup": "2027-01-12",
        "end_date": "2027-01-14",
        "duration": "3 Days",
        "message": "Trying to book overlapping dates"
    }
    resp = requests.post(f"{BASE_URL}/api/bookings", json=payload)
    assert resp.status_code == 409, f"Expected 409 for overlapping dates, got {resp.status_code}: {resp.text}"
    data = resp.json()
    assert "already booked" in data.get("detail", "").lower(), f"Expected 'already booked' error, got: {data}"
    print(f"   ✓ Overlapping booking correctly rejected with 409")

test("POST /api/bookings with overlapping dates (2027-01-12 to 2027-01-14) returns 409", test_create_overlapping_booking)

def test_create_booking_end_before_start():
    """Create booking with end_date before pickup should return 400"""
    payload = {
        "name": "Michael Chen",
        "email": "michael.chen@example.com",
        "phone": "(360) 555-0300",
        "trailer": "maxxd-c4x-7k",
        "pickup": "2027-01-20",
        "end_date": "2027-01-18",
        "duration": "Invalid",
        "message": "End date before start"
    }
    resp = requests.post(f"{BASE_URL}/api/bookings", json=payload)
    assert resp.status_code == 400, f"Expected 400 for end before start, got {resp.status_code}: {resp.text}"
    data = resp.json()
    assert "before" in data.get("detail", "").lower(), f"Expected 'before' error message, got: {data}"
    print(f"   ✓ End date before start correctly rejected with 400")

test("POST /api/bookings with end_date before pickup (2027-01-20 to 2027-01-18) returns 400", test_create_booking_end_before_start)

def test_create_booking_different_trailer_same_dates():
    """Create booking with different trailer (eagle-landscape) on same dates should succeed"""
    payload = {
        "name": "Emily Rodriguez",
        "email": "emily.rodriguez@example.com",
        "phone": "(253) 555-0400",
        "trailer": "eagle-landscape",
        "pickup": "2027-01-10",
        "end_date": "2027-01-15",
        "duration": "5 Days",
        "message": "Different trailer, same dates"
    }
    resp = requests.post(f"{BASE_URL}/api/bookings", json=payload)
    assert resp.status_code == 200, f"Expected 200 for different trailer, got {resp.status_code}: {resp.text}"
    data = resp.json()
    
    assert data["trailer"] == "eagle-landscape", "Trailer ID mismatch"
    assert data["pickup"] == "2027-01-10", "Pickup date mismatch"
    assert data["end_date"] == "2027-01-15", "End date mismatch"
    
    created_booking_ids.append(data["id"])
    print(f"   ✓ Different trailer booking on same dates succeeded: {data['id']}")

test("POST /api/bookings with different trailer (eagle-landscape) on same dates returns 200", test_create_booking_different_trailer_same_dates)

def test_verify_booked_dates_includes_range():
    """Verify GET /api/trailers/maxxd-c4x-7k/booked-dates now includes 2027-01-10 to 2027-01-15"""
    resp = requests.get(f"{BASE_URL}/api/trailers/maxxd-c4x-7k/booked-dates")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    
    ranges = data.get("ranges", [])
    found = False
    for r in ranges:
        if r.get("start") == "2027-01-10" and r.get("end") == "2027-01-15":
            found = True
            break
    
    assert found, f"Expected to find range 2027-01-10 to 2027-01-15 in booked-dates, got: {ranges}"
    print(f"   ✓ Booked-dates correctly includes range 2027-01-10 to 2027-01-15")

test("GET /api/trailers/maxxd-c4x-7k/booked-dates includes range 2027-01-10 to 2027-01-15", test_verify_booked_dates_includes_range)

# ============================================================================
# TEST 4: Backward Compatibility
# ============================================================================

print("\n🔄 TEST 4: Backward Compatibility")
print("-" * 80)

def test_booking_without_end_date():
    """POST /api/bookings without end_date (only pickup) should return 200"""
    payload = {
        "name": "David Thompson",
        "email": "david.thompson@example.com",
        "phone": "(509) 555-0500",
        "trailer": "continental-cargo",
        "pickup": "2027-02-01",
        "duration": "24 Hours",
        "message": "Old-style booking without end_date"
    }
    resp = requests.post(f"{BASE_URL}/api/bookings", json=payload)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
    data = resp.json()
    
    assert "id" in data, "Response should contain booking id"
    assert data["pickup"] == "2027-02-01", "Pickup date mismatch"
    assert data["end_date"] == "", f"Expected empty end_date, got {data['end_date']}"
    
    created_booking_ids.append(data["id"])
    print(f"   ✓ Booking without end_date succeeded: {data['id']}")

test("POST /api/bookings without end_date (only pickup) returns 200", test_booking_without_end_date)

def test_admin_get_bookings_includes_end_date():
    """GET /api/admin/bookings should return all bookings including new ones with end_date field"""
    headers = {"X-Admin-Token": ADMIN_TOKEN}
    resp = requests.get(f"{BASE_URL}/api/admin/bookings", headers=headers)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    
    assert isinstance(data, list), "Response should be a list"
    
    # Verify all bookings have end_date field (even if empty)
    for booking in data:
        assert "end_date" in booking, f"Booking {booking.get('id')} missing end_date field"
    
    # Verify our created bookings are present
    booking_ids = [b["id"] for b in data]
    for created_id in created_booking_ids:
        assert created_id in booking_ids, f"Created booking {created_id} not found"
    
    print(f"   ✓ All bookings have end_date field (including empty strings)")
    print(f"   ✓ Retrieved {len(data)} bookings, including {len(created_booking_ids)} test bookings")

test("GET /api/admin/bookings returns all bookings with end_date field", test_admin_get_bookings_includes_end_date)

# ============================================================================
# TEST 5: Admin Flow with Date Ranges
# ============================================================================

print("\n🔐 TEST 5: Admin Flow with Date Ranges")
print("-" * 80)

def test_admin_patch_booking_status():
    """PATCH /api/admin/bookings/{id} with status=confirmed should return 200"""
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

test("PATCH /api/admin/bookings/{id} with status=confirmed returns 200", test_admin_patch_booking_status)

def test_booked_dates_after_confirmation():
    """After confirmation, booked-dates should still list the range"""
    resp = requests.get(f"{BASE_URL}/api/trailers/maxxd-c4x-7k/booked-dates")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    
    ranges = data.get("ranges", [])
    found = False
    for r in ranges:
        if r.get("start") == "2027-01-10" and r.get("end") == "2027-01-15":
            found = True
            assert r.get("status") == "confirmed", f"Expected status 'confirmed', got {r.get('status')}"
            break
    
    assert found, f"Expected to find confirmed range 2027-01-10 to 2027-01-15, got: {ranges}"
    print(f"   ✓ Booked-dates still includes confirmed range 2027-01-10 to 2027-01-15")

test("After confirmation, booked-dates still lists the range with status=confirmed", test_booked_dates_after_confirmation)

def test_admin_delete_booking():
    """DELETE /api/admin/bookings/{id} should return 200"""
    if not created_booking_ids:
        raise AssertionError("No bookings to test DELETE")
    
    booking_id = created_booking_ids[0]
    headers = {"X-Admin-Token": ADMIN_TOKEN}
    resp = requests.delete(f"{BASE_URL}/api/admin/bookings/{booking_id}", headers=headers)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
    data = resp.json()
    assert data.get("ok") == True, f"Expected ok=true, got {data}"
    
    print(f"   ✓ Deleted booking {booking_id}")
    created_booking_ids.remove(booking_id)

test("DELETE /api/admin/bookings/{id} returns 200", test_admin_delete_booking)

def test_booked_dates_after_deletion():
    """After deletion, booked-dates should no longer list that range"""
    resp = requests.get(f"{BASE_URL}/api/trailers/maxxd-c4x-7k/booked-dates")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    
    ranges = data.get("ranges", [])
    found = False
    for r in ranges:
        if r.get("start") == "2027-01-10" and r.get("end") == "2027-01-15":
            found = True
            break
    
    assert not found, f"Range 2027-01-10 to 2027-01-15 should be deleted, but still found in: {ranges}"
    print(f"   ✓ Booked-dates no longer includes deleted range 2027-01-10 to 2027-01-15")

test("After deletion, booked-dates no longer lists that range", test_booked_dates_after_deletion)

# ============================================================================
# TEST 6: Cleanup
# ============================================================================

print("\n🧹 TEST 6: Cleanup")
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
    
    print(f"   ✓ Cleaned up {deleted_count} remaining test bookings")

test("Cleanup: Delete all remaining test bookings", cleanup_test_bookings)

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
else:
    print("\n✅ ALL TESTS PASSED!")
    print("   • GET /api/trailers/{id} - Single trailer detail working")
    print("   • GET /api/trailers/{id}/booked-dates - Booked dates endpoint working")
    print("   • POST /api/bookings with date range - Date range bookings working")
    print("   • Overlap detection - 409 conflict correctly returned")
    print("   • Date validation - End before start correctly rejected")
    print("   • Different trailers - Same dates allowed for different trailers")
    print("   • Backward compatibility - Bookings without end_date still work")
    print("   • Admin flow - Confirmation and deletion work with date ranges")
    print("   • Test bookings cleaned up")

exit(0 if failed == 0 else 1)
