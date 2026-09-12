<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/Database.php';

use function App\Config\initCors;
use function App\Config\jsonResponse;
use App\Config\Database;

initCors();

$db = Database::getInstance();

try {
    $db->dropCollection('exams');
    $db->dropCollection('careers');
    $db->dropCollection('updates');

    $now = date('Y-m-d H:i:s');
    $seedFile = __DIR__ . '/../data/seed_data.json';

    if (!file_exists($seedFile)) {
        throw new Exception('Seed data file not found at ' . $seedFile);
    }

    $rawContent = file_get_contents($seedFile);
    $data = json_decode($rawContent, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON in seed file: ' . json_last_error_msg());
    }

    $exams = $data['exams'] ?? [];
    $careers = $data['careers'] ?? [];
    $updates = $data['updates'] ?? [];

    foreach ($exams as &$exam) {
        if (empty($exam['createdAt'])) $exam['createdAt'] = $now;
        if (empty($exam['updatedAt'])) $exam['updatedAt'] = $now;
    }
    unset($exam);

    foreach ($careers as &$career) {
        if (empty($career['createdAt'])) $career['createdAt'] = $now;
        if (empty($career['updatedAt'])) $career['updatedAt'] = $now;
    }
    unset($career);

    foreach ($updates as &$update) {
        if (empty($update['createdAt'])) $update['createdAt'] = $now;
        if (empty($update['updatedAt'])) $update['updatedAt'] = $now;
    }
    unset($update);

    if (!empty($exams)) {
        $db->insertMany('exams', $exams);
    }
    if (!empty($careers)) {
        $db->insertMany('careers', $careers);
    }
    if (!empty($updates)) {
        $db->insertMany('updates', $updates);
    }

    jsonResponse([
        'success' => true,
        'message' => 'KY EDU Database successfully seeded with 32+ deep-dive exams and 14+ career pathways!',
        'stats' => [
            'examsInserted' => count($exams),
            'careersInserted' => count($careers),
            'updatesInserted' => count($updates)
        ]
    ]);
} catch (Exception $e) {
    jsonResponse(['error' => 'Seeding failed: ' . $e->getMessage()], 500);
}
