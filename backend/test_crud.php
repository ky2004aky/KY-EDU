<?php
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/models/Exam.php';
require_once __DIR__ . '/models/Career.php';
require_once __DIR__ . '/models/NoticeUpdate.php';

use App\Config\Database;
use App\Models\Exam;
use App\Models\Career;
use App\Models\NoticeUpdate;

echo "--- KY EDU CRUD Test ---\n";

$examModel = new Exam();

// 1. Read test
$allExams = $examModel->getAll();
echo "Total exams in DB: " . count($allExams) . "\n";
assert(count($allExams) >= 8, "Exams count should be >= 8");
echo "[PASS] Read all exams (count: " . count($allExams) . ")\n";

// 2. Create test
$testExam = [
    'title' => 'Test Indian Forest Service (IFS)',
    'shortName' => 'UPSC IFS',
    'conductingBody' => 'UPSC',
    'category' => 'UPSC',
    'stream' => 'Science / Engineering',
    'vacancies' => 150,
    'status' => 'Upcoming',
    'eligibility' => [
        'minAge' => 21,
        'maxAge' => 32,
        'education' => 'Degree with Animal Husbandry, Botany, Chemistry, Geology, Math, Physics, Zoology',
        'educationLevel' => 'Graduate'
    ],
    'salary' => [
        'payLevel' => 'Level 10',
        'payScale' => '₹56,100 - ₹1,77,500'
    ]
];
$createdId = $examModel->create($testExam);
echo "Created new exam with ID: $createdId\n";
$fetched = $examModel->getById($createdId);
assert($fetched['title'] === 'Test Indian Forest Service (IFS)', "Title mismatch");
echo "[PASS] Create exam\n";

// 3. Update test (Standard Update)
$updatePayload = [
    'vacancies' => 180,
    'status' => 'Active'
];
$examModel->update($createdId, $updatePayload);
$fetchedAfterUpdate = $examModel->getById($createdId);
assert($fetchedAfterUpdate['vacancies'] == 180, "Vacancies update failed");
assert($fetchedAfterUpdate['status'] === 'Active', "Status update failed");
echo "[PASS] Standard Update exam\n";

// 4. Apply Update test ("crud rules applay the update")
$noticePayload = [
    'title' => 'Admit Card 2026 Released for IFS Prelims',
    'type' => 'Admit Card',
    'date' => '2026-09-11',
    'description' => 'Hall tickets available at upsconline.nic.in',
    'link' => 'https://upsconline.nic.in',
    'newStatus' => 'Admit Card Out'
];
$applySuccess = $examModel->applyUpdate($createdId, $noticePayload);
assert($applySuccess === true, "applyUpdate should return true");
$fetchedAfterNotice = $examModel->getById($createdId);
assert(count($fetchedAfterNotice['updates']) === 1, "Updates array should have 1 item");
assert($fetchedAfterNotice['status'] === 'Admit Card Out', "Status should be updated to Admit Card Out");
assert($fetchedAfterNotice['updates'][0]['title'] === 'Admit Card 2026 Released for IFS Prelims', "Notice title mismatch");
echo "[PASS] Apply Update on exam (timeline appended and status updated)\n";

// 5. Delete test
$delCount = $examModel->delete($createdId);
assert($delCount === 1, "Delete count should be 1");
$fetchedDeleted = $examModel->getById($createdId);
assert($fetchedDeleted === null, "Deleted exam should not exist");
echo "[PASS] Delete exam\n";

echo "\nALL BACKEND CRUD TESTS PASSED SUCCESSFULLY!\n";
