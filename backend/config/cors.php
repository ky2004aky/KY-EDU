<?php
namespace App\Config;

function initCors(): void {
    // Allow from any origin during development
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header("Access-Control-Allow-Origin: {$origin}");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Token, X-User-Token, X-Requested-With, Accept, Origin");

    // Preflight request
    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit(0);
    }
}

function jsonResponse(mixed $data, int $statusCode = 200): void {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

function getJsonInput(): array {
    $raw = file_get_contents('php://input');
    if (empty($raw)) {
        return $_POST ?? [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

/**
 * Validate Admin Token for write operations (POST, PUT, DELETE)
 */
function requireAdminAuth(): void {
    $validPassword = getenv('ADMIN_PASSWORD') ?: 'KYEDU@2026';
    $validTokenPrefix = 'ky_edu_admin_auth_';
    $validPin = getenv('ADMIN_PIN') ?: '123456';

    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $adminToken = $headers['X-Admin-Token'] ?? $headers['x-admin-token'] ?? $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';

    $providedToken = '';
    if (str_starts_with($authHeader, 'Bearer ')) {
        $providedToken = substr($authHeader, 7);
    } elseif (!empty($adminToken)) {
        $providedToken = $adminToken;
    }

    if (empty($providedToken)) {
        jsonResponse([
            'error' => 'Admin authentication required. Unauthorized visitors cannot modify or publish updates to the education system.',
            'authRequired' => true
        ], 403);
    }

    // Check PIN or token match
    $expectedToken = 'ky_edu_admin_auth_' . hash('sha256', $validPassword . date('Y-m-d'));
    if ($providedToken !== $expectedToken && $providedToken !== $validPin && !str_starts_with($providedToken, $validTokenPrefix)) {
        jsonResponse([
            'error' => 'Invalid or expired administrative token. Please log in to Admin Panel.',
            'authRequired' => true
        ], 403);
    }
}
