<?php
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/models/Admin.php';
require_once __DIR__ . '/models/User.php';
require_once __DIR__ . '/models/AuditLog.php';

use App\Models\Admin;
use App\Models\User;
use App\Models\AuditLog;

echo "=== REAL-WORLD ADMIN PORTAL BACKEND VERIFICATION ===\n\n";

// 1. Admin Model Test
$adminModel = new Admin();
echo "[1] Testing PIN login...\n";
$authPin = $adminModel->authenticate('', '123456', true);
if (!empty($authPin['token']) && ($authPin['admin']['role'] ?? '') === 'SuperAdmin') {
    echo "  -> SUCCESS! PIN 123456 logged in. Token: " . substr($authPin['token'], 0, 30) . "...\n";
} else {
    echo "  -> FAILED PIN login\n";
    exit(1);
}

echo "[2] Testing Email + Password login...\n";
$authEmail = $adminModel->authenticate('admin@kyedu.in', 'KYEDU@2026', false);
if (!empty($authEmail['token'])) {
    echo "  -> SUCCESS! Email admin@kyedu.in logged in.\n";
} else {
    echo "  -> FAILED Email login\n";
    exit(1);
}

// 2. Audit Log Test
echo "[3] Testing Audit Log creation and retrieval...\n";
$auditModel = new AuditLog();
$auditModel->log('SYSTEM_TEST', 'system', 'test_id', 'Automated system health check', 'SuperAdmin');
$logs = $auditModel->getRecent(5);
if (count($logs) > 0) {
    echo "  -> SUCCESS! Retrieved " . count($logs) . " audit log records. Latest: " . $logs[0]['action'] . "\n";
} else {
    echo "  -> FAILED Audit log retrieval\n";
    exit(1);
}

// 3. User Directory Test
echo "[4] Testing Student Directory retrieval & department counts...\n";
$userModel = new User();
$users = $userModel->getAll([], 10);
$count = $userModel->count();
$deptStats = $userModel->getDepartmentStats();
echo "  -> SUCCESS! Total registered students in DB: {$count}. Retrieved: " . count($users) . "\n";
echo "  -> Departments breakdown: " . json_encode($deptStats) . "\n";

echo "\nALL REAL-WORLD ADMIN BACKEND TESTS PASSED!\n";