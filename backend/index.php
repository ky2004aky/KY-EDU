<?php
require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/Database.php';

use function App\Config\initCors;
use function App\Config\jsonResponse;
use App\Config\Database;

initCors();

try {
    $db = Database::getInstance();
    $examsCount = $db->count('exams');
    $careersCount = $db->count('careers');
    $updatesCount = $db->count('updates');

    jsonResponse([
        'status' => 'online',
        'service' => 'KY EDU - Indian Career & Govt Exam System API',
        'phpVersion' => phpversion(),
        'database' => [
            'connected' => true,
            'name' => $db->getDbName(),
            'counts' => [
                'exams' => $examsCount,
                'careers' => $careersCount,
                'updates' => $updatesCount
            ]
        ],
        'endpoints' => [
            'GET, POST, PUT, DELETE /api/exams.php' => 'Exams CRUD and applyUpdate action',
            'GET, POST, PUT, DELETE /api/careers.php' => 'Career stream roadmaps CRUD',
            'GET, POST, PUT, DELETE /api/updates.php' => 'Live Sarkari notices and alerts CRUD',
            'POST /api/eligibility.php' => 'Calculate eligible exams by Age, Qualification, and Category',
            'GET /api/stats.php' => 'Dashboard metrics and overview',
            'GET /api/seed.php' => 'Seed database with sample authentic Indian education data'
        ]
    ]);
} catch (Exception $e) {
    jsonResponse([
        'status' => 'error',
        'error' => $e->getMessage()
    ], 500);
}
