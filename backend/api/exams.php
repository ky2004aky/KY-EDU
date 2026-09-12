<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../models/Exam.php';
require_once __DIR__ . '/../models/NoticeUpdate.php';
require_once __DIR__ . '/../models/AuditLog.php';

use function App\Config\initCors;
use function App\Config\jsonResponse;
use function App\Config\getJsonInput;
use function App\Config\requireAdminAuth;
use App\Models\Exam;
use App\Models\NoticeUpdate;
use App\Models\AuditLog;

initCors();

$examModel = new Exam();
$noticeModel = new NoticeUpdate();
$auditModel = new AuditLog();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            if (!empty($_GET['id'])) {
                $exam = $examModel->getById($_GET['id']);
                if (!$exam) {
                    jsonResponse(['error' => 'Exam not found'], 404);
                }
                jsonResponse(['success' => true, 'data' => $exam]);
            } else {
                $filters = [
                    'search' => $_GET['search'] ?? '',
                    'category' => $_GET['category'] ?? '',
                    'educationLevel' => $_GET['educationLevel'] ?? '',
                    'status' => $_GET['status'] ?? '',
                    'age' => $_GET['age'] ?? '',
                    'limit' => $_GET['limit'] ?? 50
                ];
                $exams = $examModel->getAll($filters);
                jsonResponse([
                    'success' => true,
                    'count' => count($exams),
                    'data' => $exams
                ]);
            }
            break;

        case 'POST':
            requireAdminAuth();
            $data = getJsonInput();
            if (empty($data['title']) || empty($data['category'])) {
                jsonResponse(['error' => 'Title and category are required fields'], 400);
            }

            $newId = $examModel->create($data);
            $createdExam = $examModel->getById($newId);

            // Create notification if marked active or upcoming
            if (!empty($data['title'])) {
                $noticeModel->create([
                    'title' => "New Exam Added: " . $data['title'],
                    'category' => 'Notification',
                    'department' => $data['conductingBody'] ?? 'Govt of India',
                    'examId' => $newId,
                    'date' => date('Y-m-d'),
                    'priority' => 'Normal',
                    'link' => $data['applyLink'] ?? '',
                    'badge' => 'NEW'
                ]);
            }

            $auditModel->log('CREATE_EXAM', 'exam', $newId, "Created new recruitment: " . ($data['title'] ?? 'Exam'));

            jsonResponse([
                'success' => true,
                'message' => 'Exam created successfully',
                'id' => $newId,
                'data' => $createdExam
            ], 201);
            break;

        case 'PUT':
            requireAdminAuth();
            $data = getJsonInput();
            $id = $_GET['id'] ?? $data['_id'] ?? $data['id'] ?? null;
            if (!$id) {
                jsonResponse(['error' => 'Exam ID is required for update'], 400);
            }

            // Check if this is an "Apply Update" action
            $action = $_GET['action'] ?? $data['action'] ?? null;
            if ($action === 'apply_update' || isset($data['updateItem'])) {
                $updateItem = $data['updateItem'] ?? $data;
                $success = $examModel->applyUpdate($id, $updateItem);
                
                if ($success) {
                    $exam = $examModel->getById($id);
                    // Also create a live Sarkari notice alert
                    $noticeModel->create([
                        'title' => ($exam['shortName'] ?? $exam['title'] ?? 'Exam') . ': ' . ($updateItem['title'] ?? 'New Official Update'),
                        'category' => $updateItem['type'] ?? 'Notification',
                        'department' => $exam['conductingBody'] ?? 'Govt Authority',
                        'examId' => $id,
                        'date' => $updateItem['date'] ?? date('Y-m-d'),
                        'priority' => 'High',
                        'link' => $updateItem['link'] ?? ($exam['applyLink'] ?? ''),
                        'badge' => 'UPDATE'
                    ]);

                    $auditModel->log('APPLY_UPDATE', 'exam', $id, "Applied status update: " . ($updateItem['title'] ?? 'Update') . " to " . ($exam['shortName'] ?? $exam['title']));

                    jsonResponse([
                        'success' => true,
                        'message' => 'Update applied successfully to exam and published to live ticker',
                        'data' => $exam
                    ]);
                } else {
                    jsonResponse(['error' => 'Failed to apply update to exam'], 500);
                }
            } else {
                // Standard full or partial update
                $modifiedCount = $examModel->update($id, $data);
                $updatedExam = $examModel->getById($id);
                $auditModel->log('UPDATE_EXAM', 'exam', $id, "Updated exam details for " . ($updatedExam['title'] ?? $id));

                jsonResponse([
                    'success' => true,
                    'message' => 'Exam updated successfully',
                    'modifiedCount' => $modifiedCount,
                    'data' => $updatedExam
                ]);
            }
            break;

        case 'DELETE':
            requireAdminAuth();
            $id = $_GET['id'] ?? null;
            if (!$id) {
                jsonResponse(['error' => 'Exam ID is required for deletion'], 400);
            }

            $deletedCount = $examModel->delete($id);
            if ($deletedCount > 0) {
                $auditModel->log('DELETE_EXAM', 'exam', $id, "Permanently deleted recruitment exam ID: {$id}");
                jsonResponse(['success' => true, 'message' => 'Exam deleted successfully']);
            } else {
                jsonResponse(['error' => 'Exam not found or already deleted'], 404);
            }
            break;

        default:
            jsonResponse(['error' => "Method {$method} not allowed"], 405);
    }
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
