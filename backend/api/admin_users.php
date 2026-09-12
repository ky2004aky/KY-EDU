<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/AuditLog.php';

use function App\Config\initCors;
use function App\Config\jsonResponse;
use function App\Config\requireAdminAuth;
use App\Models\User;
use App\Models\AuditLog;

initCors();
requireAdminAuth();

$method = $_SERVER['REQUEST_METHOD'];

try {
    $userModel = new User();
    $auditModel = new AuditLog();

    if ($method === 'GET') {
        $search = trim($_GET['search'] ?? '');
        $department = trim($_GET['department'] ?? '');
        $std = trim($_GET['std'] ?? '');
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
        $skip = isset($_GET['skip']) ? (int)$_GET['skip'] : 0;

        $filters = [];
        if (!empty($search)) $filters['search'] = $search;
        if (!empty($department) && $department !== 'All') $filters['department'] = $department;
        if (!empty($std) && $std !== 'All') $filters['std'] = $std;

        $users = $userModel->getAll($filters, $limit, $skip);
        $totalCount = $userModel->count($filters);

        jsonResponse([
            'success' => true,
            'users' => $users,
            'total' => $totalCount,
            'count' => count($users)
        ]);
    } elseif ($method === 'DELETE') {
        $id = trim($_GET['id'] ?? '');
        if (empty($id)) {
            jsonResponse(['error' => 'Student ID is required.'], 400);
        }

        $student = $userModel->findById($id);
        $studentName = $student ? ($student['name'] ?? 'Unknown Student') : $id;

        $deleted = $userModel->delete($id);
        if ($deleted) {
            $auditModel->log('DELETE_STUDENT', 'student', $id, "Deleted student record: {$studentName}", 'System Admin');
            jsonResponse([
                'success' => true,
                'message' => 'Student record removed successfully.'
            ]);
        } else {
            jsonResponse(['error' => 'Failed to delete student record.'], 404);
        }
    } else {
        jsonResponse(['error' => 'Method not allowed.'], 405);
    }
} catch (Exception $e) {
    jsonResponse([
        'success' => false,
        'error' => $e->getMessage()
    ], 500);
}