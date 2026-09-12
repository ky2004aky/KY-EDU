<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../models/Admin.php';
require_once __DIR__ . '/../models/AuditLog.php';

use function App\Config\initCors;
use function App\Config\jsonResponse;
use function App\Config\getJsonInput;
use function App\Config\requireAdminAuth;
use App\Models\Admin;
use App\Models\AuditLog;

initCors();
requireAdminAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
    jsonResponse(['error' => 'Method not allowed. Use POST or PUT.'], 405);
}

$input = getJsonInput();
$currentPassword = trim($input['currentPassword'] ?? '');
$newPassword = trim($input['newPassword'] ?? '');

if (empty($currentPassword) || empty($newPassword)) {
    jsonResponse(['error' => 'Both current and new password are required.'], 400);
}

try {
    $adminModel = new Admin();
    $auditModel = new AuditLog();

    // Find default admin or logged-in admin
    $admin = $adminModel->findByEmail(getenv('ADMIN_EMAIL') ?: 'admin@kyedu.in');
    if (!$admin) {
        jsonResponse(['error' => 'Admin account not found.'], 404);
    }

    $adminModel->updatePassword((string)$admin['_id'], $currentPassword, $newPassword);
    $auditModel->log('PASSWORD_CHANGE', 'admin', (string)$admin['_id'], 'Administrator password updated successfully', $admin['name'] ?? 'Admin');

    jsonResponse([
        'success' => true,
        'message' => 'Admin password has been updated securely.'
    ]);
} catch (Exception $e) {
    jsonResponse([
        'success' => false,
        'error' => $e->getMessage()
    ], 400);
}