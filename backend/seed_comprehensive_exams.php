<?php
require_once __DIR__ . '/config/Database.php';

use App\Config\Database;

$db = Database::getInstance();

echo "=== SEEDING COMPREHENSIVE FIELD-WISE INDIAN EXAMS INTO MONGODB ===\n\n";

$newExams = require __DIR__ . '/config/field_exams.php';

$count = 0;
foreach ($newExams as $examDoc) {
    // Check if exam already exists by shortName or title
    $existing = $db->findOne('exams', [
        '$or' => [
            ['shortName' => $examDoc['shortName']],
            ['title' => $examDoc['title']]
        ]
    ]);

    if (!$existing) {
        $db->insertOne('exams', $examDoc);
        echo " [+] Added: " . $examDoc['shortName'] . " (" . $examDoc['category'] . " | " . $examDoc['stream'] . " | " . $examDoc['eligibility']['educationLevel'] . ")\n";
        $count++;
    } else {
        echo " [=] Already exists: " . $examDoc['shortName'] . "\n";
    }
}

$totalInDb = $db->count('exams', []);
echo "\nSuccessfully verified field-specific exams! Total exams now in MongoDB: {$totalInDb}\n";
