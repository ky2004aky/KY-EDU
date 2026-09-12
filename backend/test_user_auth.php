<?php
require_once __DIR__ . '/models/User.php';
require_once __DIR__ . '/config/Database.php';

use App\Models\User;
use App\Config\Database;

echo "=== KY EDU Student User Auth & MongoDB Test ===\n";

$userModel = new User();
$db = Database::getInstance();

// Clean up any previous test user
$testEmail = 'student_test_' . time() . '@kyedu.in';

$testPayload = [
    'name' => 'Aditya Verma',
    'email' => $testEmail,
    'password' => 'Pass@12345',
    'age' => 21,
    'std' => '12th Science (PCM)',
    'department' => 'Science & Technology (Engineering)',
    'phone' => '+91 9876543210'
];

try {
    // 1. Test Registration
    echo "[TEST 1] Registering student in MongoDB...\n";
    $regResult = $userModel->register($testPayload);
    assert(!empty($regResult['token']), 'Token must not be empty');
    assert($regResult['user']['name'] === 'Aditya Verma', 'Name must match');
    assert($regResult['user']['age'] === 21, 'Age must match');
    assert($regResult['user']['std'] === '12th Science (PCM)', 'Std must match');
    assert($regResult['user']['department'] === 'Science & Technology (Engineering)', 'Department must match');
    assert(!isset($regResult['user']['password']), 'Password must not be in returned profile');
    $userId = $regResult['user']['_id'];
    echo "  -> SUCCESS! User ID created in MongoDB: {$userId}\n";

    // 2. Direct MongoDB Collection Query Check
    echo "[TEST 2] Verifying document directly in MongoDB 'users' collection...\n";
    $mongoDoc = $db->findOne('users', ['email' => $testEmail]);
    assert($mongoDoc !== null, 'Document must exist in MongoDB');
    assert($mongoDoc['age'] === 21, 'Age in MongoDB must be 21');
    assert($mongoDoc['std'] === '12th Science (PCM)', 'Std in MongoDB must match');
    assert($mongoDoc['department'] === 'Science & Technology (Engineering)', 'Department in MongoDB must match');
    assert(password_verify('Pass@12345', $mongoDoc['password']), 'Hashed password in MongoDB must verify');
    echo "  -> SUCCESS! Verified Name, Age, Std, and Department persisted correctly in MongoDB!\n";

    // 3. Test Authentication (Login)
    echo "[TEST 3] Testing user login with email and password...\n";
    $loginResult = $userModel->authenticate($testEmail, 'Pass@12345');
    assert(!empty($loginResult['token']), 'Login token must not be empty');
    assert($loginResult['user']['name'] === 'Aditya Verma', 'User profile returned on login');
    echo "  -> SUCCESS! Student login authenticated successfully!\n";

    // 4. Test Token Verification & Fetch
    echo "[TEST 4] Verifying token and fetching student profile...\n";
    $verifiedId = User::verifyToken($loginResult['token']);
    assert($verifiedId === $userId, 'Verified user ID must match registered ID');
    $profile = $userModel->findById($verifiedId);
    assert($profile['name'] === 'Aditya Verma', 'Profile fetch must match');
    echo "  -> SUCCESS! Token verified and profile retrieved!\n";

    // 5. Test Profile Update (e.g. Std and Department)
    echo "[TEST 5] Updating student Age, Std, and Department in MongoDB...\n";
    $updateData = [
        'age' => 22,
        'std' => 'B.Tech / B.E (Engineering)',
        'department' => 'Computer Science & AI'
    ];
    $updatedProfile = $userModel->updateProfile($userId, $updateData);
    assert($updatedProfile['age'] === 22, 'Updated age must be 22');
    assert($updatedProfile['std'] === 'B.Tech / B.E (Engineering)', 'Updated std must match');
    assert($updatedProfile['department'] === 'Computer Science & AI', 'Updated department must match');
    echo "  -> SUCCESS! Updated profile in MongoDB: Std={$updatedProfile['std']}, Dept={$updatedProfile['department']}, Age={$updatedProfile['age']}\n";

    // Clean up test user
    $db->delete('users', ['email' => $testEmail]);
    echo "  -> Cleaned up test record.\n";

    echo "\nALL USER AUTHENTICATION & MONGODB CHECKS PASSED!\n";
} catch (Exception $e) {
    echo "FAIL: " . $e->getMessage() . "\n";
    exit(1);
}
