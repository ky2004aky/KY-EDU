<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../models/Admin.php';
require_once __DIR__ . '/../models/AuditLog.php';

use function App\Config\initCors;
use function App\Config\jsonResponse;
use function App\Config\getJsonInput;
use App\Models\Admin;
use App\Models\AuditLog;

initCors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed. Use POST.'], 405);
}

$input = getJsonInput();
$email = trim($input['email'] ?? '');
$password = trim($input['password'] ?? '');
$pin = trim($input['pin'] ?? '');

try {
    $adminModel = new Admin();
    $auditModel = new AuditLog();

    if (!empty($pin)) {
        // Authenticate with PIN
        $result = $adminModel->authenticate('', $pin, true);
        $auditModel->log('ADMIN_LOGIN', 'admin', (string)($result['admin']['_id'] ?? 'pin_login'), 'Admin logged in via 6-digit PIN', $result['admin']['name'] ?? 'Admin');
        jsonResponse([
            'success' => true,
            'message' => 'Admin authenticated successfully via PIN',
            'token' => $result['token'],
            'admin' => $result['admin']
        ]);
    } elseif (!empty($email) && !empty($password)) {
        // Authenticate with Email & Password
        $result = $adminModel->authenticate($email, $password, false);
        $auditModel->log('ADMIN_LOGIN', 'admin', (string)($result['admin']['_id'] ?? 'email_login'), 'Admin logged in via Email & Password', $result['admin']['name'] ?? 'Admin');
        jsonResponse([
            'success' => true,
            'message' => 'Admin authenticated successfully',
            'token' => $result['token'],
            'admin' => $result['admin']
        ]);
    } else {
        jsonResponse([
            'success' => false,
            'error' => 'Please provide either a 6-digit PIN or Email and Password.'
        ], 400);
    }
} catch (Exception $e) {
    jsonResponse([
        'success' => false,
        'error' => $e->getMessage()
    ], 401);
}