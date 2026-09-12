<?php
namespace App\Models;

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/Mailer.php';

use App\Config\Database;
use App\Config\Mailer;
use MongoDB\BSON\ObjectId;
use Exception;

class User {
    private Database $db;
    private string $collection = 'users';

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /**
     * Find user by email
     */
    public function findByEmail(string $email): ?array {
        $cleanEmail = strtolower(trim($email));
        return $this->db->findOne($this->collection, ['email' => $cleanEmail]);
    }

    /**
     * Find user by phone number
     */
    public function findByPhone(string $phone): ?array {
        $digits = preg_replace('/[^0-9]/', '', $phone);
        if (empty($digits)) return null;

        // Try exact match first
        $user = $this->db->findOne($this->collection, ['phone' => trim($phone)]);
        if ($user) return $user;

        // Try 10-digit suffix regex match
        $last10 = substr($digits, -10);
        $regex = new \MongoDB\BSON\Regex($last10 . '$', 'i');
        return $this->db->findOne($this->collection, ['phone' => $regex]);
    }

    /**
     * Find user by email or phone identifier
     */
    public function findByIdentifier(string $identifier): ?array {
        $clean = trim($identifier);
        if (str_contains($clean, '@')) {
            return $this->findByEmail($clean);
        }
        $byPhone = $this->findByPhone($clean);
        if ($byPhone) return $byPhone;
        return $this->findByEmail($clean);
    }

    /**
     * Create 6-digit OTP for email or phone
     */
    public function createOtp(string $identifier, string $type, string $purpose): array {
        $cleanId = trim($identifier);
        $cleanType = strtolower(trim($type));
        if ($cleanType !== 'phone' && $cleanType !== 'email') {
            $cleanType = str_contains($cleanId, '@') ? 'email' : 'phone';
        }

        if (empty($cleanId)) {
            throw new Exception("Please provide an " . ($cleanType === 'email' ? 'email address' : 'mobile number') . ".");
        }

        if ($cleanType === 'email' && !filter_var($cleanId, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Please enter a valid email address.");
        }

        if ($cleanType === 'phone') {
            $digits = preg_replace('/[^0-9]/', '', $cleanId);
            if (strlen($digits) < 10) {
                throw new Exception("Please enter a valid 10-digit mobile number.");
            }
        }

        // Check user existence based on purpose
        $user = null;
        if ($purpose === 'login' || $purpose === 'forgot_password') {
            $user = $this->findByIdentifier($cleanId);
            if (!$user) {
                throw new Exception("No student account found registered with this " . ($cleanType === 'email' ? 'email' : 'mobile number') . ".");
            }
        } elseif ($purpose === 'register') {
            if ($cleanType === 'email' && $this->findByEmail($cleanId)) {
                throw new Exception("An account with this email address already exists. Please sign in instead.");
            }
        }

        // Generate 6-digit cryptographic random OTP
        $otp = sprintf("%06d", random_int(100000, 999999));
        $now = time();
        $expiresAt = $now + 600; // 10 minutes

        // Invalidate previous OTPs for this identifier and purpose
        $this->db->delete('otps', [
            'identifier' => strtolower($cleanId),
            'purpose' => $purpose
        ]);

        $otpDoc = [
            'identifier' => strtolower($cleanId),
            'type' => $cleanType,
            'otp' => $otp,
            'purpose' => $purpose,
            'createdAt' => date('c', $now),
            'expiresAt' => date('c', $expiresAt),
            'expiresTimestamp' => $expiresAt,
            'verified' => false
        ];

        $this->db->insertOne('otps', $otpDoc);

        // Attempt Real Email Delivery (to Gmail or student's registered email)
        $destEmail = null;
        if ($cleanType === 'email') {
            $destEmail = $cleanId;
        } elseif ($user && !empty($user['email'])) {
            $destEmail = $user['email'];
        }

        $mailResult = [
            'sent' => false,
            'message' => 'Email dispatch was not attempted (no email address found).',
            'reason' => 'NO_EMAIL'
        ];

        if ($destEmail) {
            $mailResult = Mailer::sendOtp($destEmail, $otp, $purpose);
        }

        return [
            'otp' => $otp,
            'identifier' => $cleanId,
            'type' => $cleanType,
            'purpose' => $purpose,
            'expiresInSeconds' => 600,
            'emailSent' => $mailResult['sent'],
            'mailNotice' => $mailResult['message'],
            'mailReason' => $mailResult['reason'] ?? null,
            'recipientEmail' => $destEmail
        ];
    }

    /**
     * Verify OTP code
     */
    public function verifyOtp(string $identifier, string $otp, string $purpose): bool {
        $cleanId = strtolower(trim($identifier));
        $cleanOtp = trim($otp);

        if (empty($cleanOtp)) {
            throw new Exception("Please enter the 6-digit OTP code.");
        }

        $record = $this->db->findOne('otps', [
            'identifier' => $cleanId,
            'otp' => $cleanOtp,
            'purpose' => $purpose,
            'verified' => false
        ]);

        // If not found by exact string, try matching by phone digits
        if (!$record && !str_contains($cleanId, '@')) {
            $digits = preg_replace('/[^0-9]/', '', $cleanId);
            $last10 = substr($digits, -10);
            $regex = new \MongoDB\BSON\Regex($last10 . '$', 'i');
            $record = $this->db->findOne('otps', [
                'identifier' => $regex,
                'otp' => $cleanOtp,
                'purpose' => $purpose,
                'verified' => false
            ]);
        }

        if (!$record) {
            throw new Exception("Invalid OTP code. Please check your verification code and try again.");
        }

        $now = time();
        $exp = $record['expiresTimestamp'] ?? strtotime($record['expiresAt'] ?? '');
        if ($now > $exp) {
            throw new Exception("This verification code has expired. Please request a new OTP.");
        }

        // Mark OTP as verified
        $oid = $this->db->toObjectId($record['_id']);
        $this->db->update('otps', ['_id' => $oid], ['$set' => ['verified' => true, 'verifiedAt' => date('c')]]);

        return true;
    }

    /**
     * Authenticate student user via OTP
     */
    public function authenticateByOtp(string $identifier, string $otp): array {
        $this->verifyOtp($identifier, $otp, 'login');

        $user = $this->findByIdentifier($identifier);
        if (!$user) {
            throw new Exception("Account not found for this identifier.");
        }

        // Update last login
        $oid = $this->db->toObjectId($user['_id']);
        $now = date('c');
        $this->db->update(
            $this->collection,
            ['_id' => $oid],
            ['$set' => ['lastLogin' => $now]]
        );

        $user['lastLogin'] = $now;
        unset($user['password']);

        $token = $this->generateToken($user['_id'], $user['email']);

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    /**
     * Reset password (supports direct reset or optional OTP verification)
     */
    public function resetPassword(string $identifier, ?string $otp = null, string $newPassword = ''): array {
        $cleanPassword = trim($newPassword);
        if (empty($cleanPassword) || strlen($cleanPassword) < 6) {
            throw new Exception("New password must be at least 6 characters long.");
        }

        if (!empty($otp)) {
            $this->verifyOtp($identifier, $otp, 'forgot_password');
        }

        $user = $this->findByIdentifier($identifier);
        if (!$user) {
            throw new Exception("No student account found registered with this email or mobile number.");
        }

        $hashedPassword = password_hash($cleanPassword, PASSWORD_BCRYPT);
        $oid = $this->db->toObjectId($user['_id']);
        $now = date('c');

        $this->db->update(
            $this->collection,
            ['_id' => $oid],
            ['$set' => [
                'password' => $hashedPassword,
                'updatedAt' => $now
            ]]
        );

        unset($user['password']);
        $token = $this->generateToken($user['_id'], $user['email']);

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    /**
     * Find user by ID
     */
    public function findById(string $id): ?array {
        $oid = $this->db->toObjectId($id);
        $user = $this->db->findOne($this->collection, ['_id' => $oid]);
        if ($user) {
            unset($user['password']); // Never expose hashed password
        }
        return $user;
    }

    /**
     * Register a new student user
     */
    public function register(array $data): array {
        // Validation
        $name = trim($data['name'] ?? '');
        $email = strtolower(trim($data['email'] ?? ''));
        $password = trim($data['password'] ?? '');
        $age = isset($data['age']) ? (int)$data['age'] : null;
        $std = trim($data['std'] ?? '');
        $department = trim($data['department'] ?? '');
        $phone = trim($data['phone'] ?? '');

        if (empty($name)) {
            throw new Exception("Full Name is required.");
        }
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("A valid email address is required.");
        }
        if (empty($password) || strlen($password) < 6) {
            throw new Exception("Password must be at least 6 characters long.");
        }
        if (empty($age) || $age < 12 || $age > 80) {
            throw new Exception("Please enter a valid age between 12 and 80.");
        }
        if (empty($std)) {
            throw new Exception("Educational standard (std / class / qualification) is required.");
        }
        if (empty($department)) {
            throw new Exception("Studying department / stream is required.");
        }

        // Check if user already exists
        $existing = $this->findByEmail($email);
        if ($existing) {
            throw new Exception("An account with this email address already exists. Please login instead.");
        }

        // Hash password securely
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $now = date('c');

        $userDoc = [
            'name' => $name,
            'email' => $email,
            'password' => $hashedPassword,
            'age' => $age,
            'std' => $std,
            'department' => $department,
            'phone' => $phone,
            'role' => 'student',
            'createdAt' => $now,
            'updatedAt' => $now,
            'lastLogin' => $now
        ];

        $insertedId = $this->db->insertOne($this->collection, $userDoc);

        // Return sanitized user profile with token
        $userDoc['_id'] = $insertedId;
        unset($userDoc['password']);

        $token = $this->generateToken($insertedId, $email);

        return [
            'user' => $userDoc,
            'token' => $token
        ];
    }

    /**
     * Authenticate student user
     */
    public function authenticate(string $email, string $password): array {
        $cleanEmail = strtolower(trim($email));
        $user = $this->findByEmail($cleanEmail);

        if (!$user) {
            throw new Exception("Invalid email or password.");
        }

        if (!password_verify($password, $user['password'] ?? '')) {
            throw new Exception("Invalid email or password.");
        }

        // Update last login
        $oid = $this->db->toObjectId($user['_id']);
        $now = date('c');
        $this->db->update(
            $this->collection,
            ['_id' => $oid],
            ['$set' => ['lastLogin' => $now]]
        );

        $user['lastLogin'] = $now;
        unset($user['password']);

        $token = $this->generateToken($user['_id'], $cleanEmail);

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    /**
     * Update student profile (Name, Age, Std, Department, Phone)
     */
    public function updateProfile(string $id, array $data): array {
        $oid = $this->db->toObjectId($id);
        $existing = $this->db->findOne($this->collection, ['_id' => $oid]);

        if (!$existing) {
            throw new Exception("User account not found.");
        }

        $fieldsToUpdate = [
            'updatedAt' => date('c')
        ];

        if (!empty($data['name'])) {
            $fieldsToUpdate['name'] = trim($data['name']);
        }
        if (isset($data['age']) && is_numeric($data['age'])) {
            $age = (int)$data['age'];
            if ($age >= 12 && $age <= 80) {
                $fieldsToUpdate['age'] = $age;
            }
        }
        if (!empty($data['std'])) {
            $fieldsToUpdate['std'] = trim($data['std']);
        }
        if (!empty($data['department'])) {
            $fieldsToUpdate['department'] = trim($data['department']);
        }
        if (isset($data['phone'])) {
            $fieldsToUpdate['phone'] = trim($data['phone']);
        }

        $this->db->update(
            $this->collection,
            ['_id' => $oid],
            ['$set' => $fieldsToUpdate]
        );

        return $this->findById($id);
    }

    /**
     * Generate secure student token
     */
    private function generateToken(string $userId, string $email): string {
        $secret = getenv('JWT_SECRET') ?: 'ky_edu_student_jwt_secret_key_2026';
        $payload = $userId . ':' . $email . ':' . time();
        $signature = hash_hmac('sha256', $payload, $secret);
        return base64_encode($payload . ':' . $signature);
    }

    /**
     * Verify student token and extract userId
     */
    public static function verifyToken(string $token): ?string {
        try {
            $decoded = base64_decode($token);
            $parts = explode(':', $decoded);
            if (count($parts) < 4) return null;

            $userId = $parts[0];
            $email = $parts[1];
            $timestamp = $parts[2];
            $sig = $parts[3];

            $secret = getenv('JWT_SECRET') ?: 'ky_edu_student_jwt_secret_key_2026';
            $expectedSig = hash_hmac('sha256', "{$userId}:{$email}:{$timestamp}", $secret);

            if (hash_equals($expectedSig, $sig)) {
                return $userId;
            }
            return null;
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Get all users for admin directory with search & filters
     */
    public function getAll(array $filters = [], int $limit = 100, int $skip = 0): array {
        $mongoFilter = [];

        if (!empty($filters['search'])) {
            $regex = new \MongoDB\BSON\Regex(preg_quote($filters['search']), 'i');
            $mongoFilter['$or'] = [
                ['name' => $regex],
                ['email' => $regex],
                ['std' => $regex],
                ['department' => $regex]
            ];
        }

        if (!empty($filters['department']) && $filters['department'] !== 'All') {
            $mongoFilter['department'] = $filters['department'];
        }

        if (!empty($filters['std']) && $filters['std'] !== 'All') {
            $mongoFilter['std'] = $filters['std'];
        }

        $options = [
            'sort' => ['createdAt' => -1],
            'limit' => $limit,
            'skip' => $skip
        ];

        $users = $this->db->find($this->collection, $mongoFilter, $options);
        // Sanitize password from all users
        foreach ($users as &$u) {
            unset($u['password']);
        }
        return $users;
    }

    /**
     * Count users matching filter
     */
    public function count(array $filters = []): int {
        $mongoFilter = [];
        if (!empty($filters['search'])) {
            $regex = new \MongoDB\BSON\Regex(preg_quote($filters['search']), 'i');
            $mongoFilter['$or'] = [
                ['name' => $regex],
                ['email' => $regex],
                ['std' => $regex],
                ['department' => $regex]
            ];
        }
        if (!empty($filters['department']) && $filters['department'] !== 'All') {
            $mongoFilter['department'] = $filters['department'];
        }
        if (!empty($filters['std']) && $filters['std'] !== 'All') {
            $mongoFilter['std'] = $filters['std'];
        }
        return $this->db->count($this->collection, $mongoFilter);
    }

    /**
     * Delete user by ID (Admin only)
     */
    public function delete(string $id): bool {
        $oid = $this->db->toObjectId($id);
        return $this->db->delete($this->collection, ['_id' => $oid]) > 0;
    }

    /**
     * Aggregate department counts for analytics
     */
    public function getDepartmentStats(): array {
        try {
            $users = $this->db->find($this->collection, [], ['projection' => ['department' => 1]]);
            $deptCounts = [];
            foreach ($users as $u) {
                $dept = $u['department'] ?? 'Other';
                $deptCounts[$dept] = ($deptCounts[$dept] ?? 0) + 1;
            }
            arsort($deptCounts);
            return $deptCounts;
        } catch (Exception $e) {
            return [];
        }
    }
}
