<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../models/Exam.php';
require_once __DIR__ . '/../models/Career.php';
require_once __DIR__ . '/../models/NoticeUpdate.php';

use function App\Config\initCors;
use function App\Config\jsonResponse;
use App\Models\Exam;
use App\Models\Career;
use App\Models\NoticeUpdate;

initCors();

try {
    $examModel = new Exam();
    $careerModel = new Career();
    $noticeModel = new NoticeUpdate();

    $exams = $examModel->getAll();
    $careers = $careerModel->getAll();
    $notices = $noticeModel->getAll(['limit' => 10]);

    $totalExams = count($exams);
    $activeExams = 0;
    $upcomingExams = 0;
    $totalVacancies = 0;
    $categoryCounts = [];

    foreach ($exams as $exam) {
        $status = $exam['status'] ?? '';
        if ($status === 'Active' || $status === 'Admit Card Out' || $status === 'Exam Ongoing') {
            $activeExams++;
        } elseif ($status === 'Upcoming') {
            $upcomingExams++;
        }

        if (!empty($exam['vacancies']) && is_numeric($exam['vacancies'])) {
            $totalVacancies += (int)$exam['vacancies'];
        }

        $cat = $exam['category'] ?? 'Other';
        $categoryCounts[$cat] = ($categoryCounts[$cat] ?? 0) + 1;
    }

    jsonResponse([
        'success' => true,
        'stats' => [
            'totalExams' => $totalExams,
            'activeExams' => $activeExams,
            'upcomingExams' => $upcomingExams,
            'totalVacancies' => $totalVacancies,
            'totalCareers' => count($careers),
            'totalNotices' => count($notices),
            'categoryCounts' => $categoryCounts
        ],
        'latestNotices' => $notices
    ]);
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
