<?php
/**
 * Test Admin Authentication & API Security
 */
$baseUrl = 'http://localhost:8000/api';

function httpRequest($url, $method = 'GET', $data = null, $token = null) {
    $ch = curl_init($url);
    $headers = ['Content-Type: application/json', 'Accept: application/json'];
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if ($data !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return ['code' => $httpCode, 'data' => json_decode($response, true), 'raw' => $response];
}

echo "=== KY EDU API Security & Auth Verification ===\n";

// 1. Public GET on exams (should succeed)
$res = httpRequest("$baseUrl/exams.php");
assert($res['code'] === 200, "Public GET exams failed with code " . $res['code']);
echo "[PASS] Public GET /api/exams.php works without authentication (200 OK)\n";

// 2. Unauthenticated POST to exams (should fail with 401/403)
$res = httpRequest("$baseUrl/exams.php", 'POST', ['title' => 'Unauthorized Exam']);
assert($res['code'] === 403 || $res['code'] === 401, "Expected 401 or 403 Forbidden, got " . $res['code']);
echo "[PASS] Unauthenticated POST /api/exams.php blocked with " . $res['code'] . " Forbidden/Unauthorized\n";

// 3. Login with wrong PIN (should fail with 401)
$res = httpRequest("$baseUrl/login.php", 'POST', ['pin' => '000000']);
assert($res['code'] === 401, "Expected 401 for wrong PIN, got " . $res['code']);
echo "[PASS] Wrong PIN blocked with 401 Unauthorized\n";

// 4. Login with correct PIN 123456
$res = httpRequest("$baseUrl/login.php", 'POST', ['pin' => '123456']);
assert($res['code'] === 200, "Login failed with code " . $res['code']);
assert(isset($res['data']['token']), "Token missing in login response");
$adminToken = $res['data']['token'];
echo "[PASS] Admin Login successful with PIN 123456. Token received.\n";

// 5. Authenticated POST to exams with Bearer token
$newExam = [
    'title' => 'Indian Engineering Services (UPSC ESE)',
    'shortName' => 'UPSC ESE',
    'conductingBody' => 'UPSC',
    'category' => 'UPSC',
    'stream' => 'Technical / Engineering',
    'vacancies' => 250,
    'status' => 'Upcoming',
    'eligibility' => [
        'minAge' => 21,
        'maxAge' => 30,
        'education' => 'Degree in Engineering (Civil, Mechanical, Electrical, E&T)',
        'educationLevel' => 'Graduate'
    ],
    'salary' => [
        'payLevel' => 'Level 10',
        'payScale' => '₹56,100 - ₹1,77,500'
    ]
];

$res = httpRequest("$baseUrl/exams.php", 'POST', $newExam, $adminToken);
assert($res['code'] === 201, "Authenticated POST failed with code " . $res['code']);
$examId = $res['data']['data']['id'] ?? $res['data']['data']['_id'];
echo "[PASS] Authenticated POST /api/exams.php succeeded (201 Created). New Exam ID: $examId\n";

// 6. Authenticated Apply Update (Live circular notice)
$updatePayload = [
    'examId' => $examId,
    'title' => 'Notification 2026 Released for ESE Prelims',
    'type' => 'Notification',
    'date' => date('Y-m-d'),
    'description' => 'Detailed notification published on upsc.gov.in',
    'newStatus' => 'Active'
];
$res = httpRequest("$baseUrl/updates.php", 'POST', $updatePayload, $adminToken);
assert($res['code'] === 201, "Apply update failed with code " . $res['code']);
echo "[PASS] Authenticated POST /api/updates.php applied live circular successfully (201 Created)\n";

// 7. Clean up: Authenticated DELETE
$res = httpRequest("$baseUrl/exams.php?id=$examId", 'DELETE', null, $adminToken);
assert($res['code'] === 200, "Authenticated DELETE failed with code " . $res['code']);
echo "[PASS] Authenticated DELETE /api/exams.php succeeded (200 OK)\n";

echo "\nALL API SECURITY AND AUTH CHECKS PASSED!\n";
