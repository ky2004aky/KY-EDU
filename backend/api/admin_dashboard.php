<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../models/Exam.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/AuditLog.php';
require_once __DIR__ . '/../models/Admin.php';

use function App\Config\initCors;
use function App\Config\jsonResponse;
use function App\Config\requireAdminAuth;
use App\Models\Exam;
use App\Models\User;
use App\Models\AuditLog;
use App\Models\Admin;

initCors();
requireAdminAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'Method not allowed. Use GET.'], 405);
}

try {
    $examModel = new Exam();
    $userModel = new User();
    $auditModel = new AuditLog();
    $db = \App\Config\Database::getInstance();

    // 1. Total Students
    $totalStudents = $userModel->count();

    // 2. Total Exams & Active
    $allExams = $examModel->getAll();
    $totalExams = count($allExams);
    $activeExams = 0;
    $totalVacancies = 0;
    $closingSoon = [];

    $now = new DateTime();
    $todayStr = $now->format('Y-m-d');
    $sevenDaysLater = (new DateTime())->modify('+14 days')->format('Y-m-d');

    foreach ($allExams as $exam) {
        $status = strtolower($exam['status'] ?? '');
        if ($status !== 'concluded' && $status !== 'cancelled') {
            $activeExams++;
        }

        // Vacancies sum
        $vacStr = preg_replace('/[^0-9]/', '', (string)($exam['vacancies'] ?? '0'));
        $vacVal = (int)$vacStr;
        $totalVacancies += $vacVal;

        // Check application end date
        $endDate = $exam['applicationDates']['end'] ?? null;
        if ($endDate) {
            $endParsed = date('Y-m-d', strtotime($endDate));
            if ($endParsed >= $todayStr && $endParsed <= $sevenDaysLater) {
                $closingSoon[] = [
                    'id' => $exam['_id'],
                    'title' => $exam['title'],
                    'shortName' => $exam['shortName'] ?? $exam['title'],
                    'endDate' => $endDate,
                    'category' => $exam['category'] ?? 'General',
                    'vacancies' => $exam['vacancies'] ?? 'N/A'
                ];
            }
        }
    }

    // 3. Total Circulars
    $totalCirculars = $db->count('updates', []);

    // 4. Department stats
    $deptStats = $userModel->getDepartmentStats();

    // 5. Exam categories breakdown
    $categoryStats = [];
    foreach ($allExams as $exam) {
        $cat = $exam['category'] ?? 'General';
        $categoryStats[$cat] = ($categoryStats[$cat] ?? 0) + 1;
    }

    // 6. Recent Audit Logs
    $recentLogs = $auditModel->getRecent(20);

    jsonResponse([
        'success' => true,
        'stats' => [
            'totalStudents' => $totalStudents,
            'totalExams' => $totalExams,
            'activeExams' => $activeExams,
            'totalVacancies' => $totalVacancies,
            'totalCirculars' => $totalCirculars,
            'closingSoonCount' => count($closingSoon)
        ],
        'closingSoon' => $closingSoon,
        'departmentStats' => $deptStats,
        'categoryStats' => $categoryStats,
        'recentLogs' => $recentLogs
    ]);
} catch (Exception $e) {
    jsonResponse([
        'success' => false,
        'error' => 'Failed to load admin dashboard analytics: ' . $e->getMessage()
    ], 500);
}