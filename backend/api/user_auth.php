<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../models/User.php';

use function App\Config\initCors;
use function App\Config\jsonResponse;
use function App\Config\getJsonInput;
use App\Models\User;

initCors();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'login';
$userModel = new User();

// Helper to extract student token from header
function getBearerToken(): ?string {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (preg_match('/Bearer\s+(\S+)/', $auth, $matches)) {
        return $matches[1];
    }
    return $headers['X-User-Token'] ?? $headers['x-user-token'] ?? null;
}

try {
    switch ($method) {
        case 'POST':
            $input = getJsonInput();
            if ($action === 'register') {
                if (!empty($input['otp'])) {
                    $verifyId = !empty($input['email']) ? $input['email'] : ($input['phone'] ?? '');
                    $userModel->verifyOtp($verifyId, $input['otp'], 'register');
                }
                $result = $userModel->register($input);
                jsonResponse([
                    'success' => true,
                    'message' => 'Student account created and verified successfully in MongoDB.',
                    'token' => $result['token'],
                    'user' => $result['user']
                ], 201);
            } elseif ($action === 'login') {
                $email = $input['email'] ?? '';
                $password = $input['password'] ?? '';
                if (empty($email) || empty($password)) {
                    jsonResponse(['success' => false, 'error' => 'Email and password are required.'], 400);
                }
                $result = $userModel->authenticate($email, $password);
                jsonResponse([
                    'success' => true,
                    'message' => 'Student authenticated successfully.',
                    'token' => $result['token'],
                    'user' => $result['user']
                ], 200);
            } elseif ($action === 'send_otp') {
                $identifier = trim($input['identifier'] ?? $input['email'] ?? $input['phone'] ?? '');
                $type = trim($input['type'] ?? (str_contains($identifier, '@') ? 'email' : 'phone'));
                $purpose = trim($input['purpose'] ?? 'login'); // 'login' | 'register' | 'forgot_password'

                if (empty($identifier)) {
                    jsonResponse(['success' => false, 'error' => 'Email address or mobile phone number is required.'], 400);
                }

                $otpData = $userModel->createOtp($identifier, $type, $purpose);
                $msg = $otpData['emailSent']
                    ? "6-Digit OTP sent directly to your Gmail / Email inbox ({$otpData['recipientEmail']})! Check inbox and spam."
                    : "6-Digit OTP generated successfully for {$otpData['type']}.";

                jsonResponse([
                    'success' => true,
                    'message' => $msg,
                    'simulatedOtp' => $otpData['otp'],
                    'type' => $otpData['type'],
                    'purpose' => $otpData['purpose'],
                    'expiresInSeconds' => $otpData['expiresInSeconds'],
                    'emailSent' => $otpData['emailSent'],
                    'mailNotice' => $otpData['mailNotice'],
                    'mailReason' => $otpData['mailReason'],
                    'recipientEmail' => $otpData['recipientEmail']
                ], 200);
            } elseif ($action === 'verify_otp_login') {
                $identifier = trim($input['identifier'] ?? $input['email'] ?? $input['phone'] ?? '');
                $otp = trim($input['otp'] ?? '');

                if (empty($identifier) || empty($otp)) {
                    jsonResponse(['success' => false, 'error' => 'Identifier (Email/Phone) and 6-digit OTP are required.'], 400);
                }

                $result = $userModel->authenticateByOtp($identifier, $otp);
                jsonResponse([
                    'success' => true,
                    'message' => 'OTP verified successfully. Welcome back!',
                    'token' => $result['token'],
                    'user' => $result['user']
                ], 200);
            } elseif ($action === 'reset_password') {
                $identifier = trim($input['identifier'] ?? $input['email'] ?? $input['phone'] ?? '');
                $otp = trim($input['otp'] ?? '');
                $newPassword = trim($input['newPassword'] ?? $input['password'] ?? '');

                if (empty($identifier) || empty($newPassword)) {
                    jsonResponse(['success' => false, 'error' => 'Registered Email or Mobile Phone and new password are required.'], 400);
                }

                $result = $userModel->resetPassword($identifier, $otp, $newPassword);
                jsonResponse([
                    'success' => true,
                    'message' => 'Password reset successfully! You are now logged in.',
                    'token' => $result['token'],
                    'user' => $result['user']
                ], 200);
            } else {
                jsonResponse(['success' => false, 'error' => 'Invalid action for POST. Use action=login, register, send_otp, verify_otp_login, or reset_password.'], 400);
            }
            break;

        case 'GET':
            if ($action === 'me') {
                $token = getBearerToken();
                if (!$token) {
                    jsonResponse(['success' => false, 'error' => 'Authentication token missing.'], 401);
                }
                $userId = User::verifyToken($token);
                if (!$userId) {
                    jsonResponse(['success' => false, 'error' => 'Invalid or expired student session.'], 401);
                }
                $user = $userModel->findById($userId);
                if (!$user) {
                    jsonResponse(['success' => false, 'error' => 'Student account not found in database.'], 404);
                }
                jsonResponse([
                    'success' => true,
                    'user' => $user
                ], 200);
            } else {
                jsonResponse(['success' => false, 'error' => 'Invalid action for GET. Use action=me.'], 400);
            }
            break;

        case 'PUT':
            if ($action === 'update') {
                $token = getBearerToken();
                if (!$token) {
                    jsonResponse(['success' => false, 'error' => 'Authentication token missing.'], 401);
                }
                $userId = User::verifyToken($token);
                if (!$userId) {
                    jsonResponse(['success' => false, 'error' => 'Invalid or expired student session.'], 401);
                }
                $input = getJsonInput();
                $updatedUser = $userModel->updateProfile($userId, $input);
                jsonResponse([
                    'success' => true,
                    'message' => 'Student profile updated successfully in MongoDB.',
                    'user' => $updatedUser
                ], 200);
            } else {
                jsonResponse(['success' => false, 'error' => 'Invalid action for PUT. Use action=update.'], 400);
            }
            break;

        default:
            jsonResponse(['error' => 'Method not allowed.'], 405);
            break;
    }
} catch (Exception $e) {
    jsonResponse([
        'success' => false,
        'error' => $e->getMessage()
    ], 400);
}
