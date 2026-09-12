<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../models/NoticeUpdate.php';
require_once __DIR__ . '/../models/AuditLog.php';

use function App\Config\initCors;
use function App\Config\jsonResponse;
use function App\Config\getJsonInput;
use function App\Config\requireAdminAuth;
use App\Models\NoticeUpdate;
use App\Models\AuditLog;

initCors();

$noticeModel = new NoticeUpdate();
$auditModel = new AuditLog();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            if (!empty($_GET['id'])) {
                $notice = $noticeModel->getById($_GET['id']);
                if (!$notice) {
                    jsonResponse(['error' => 'Notice not found'], 404);
                }
                jsonResponse(['success' => true, 'data' => $notice]);
            } else {
                $filters = [
                    'category' => $_GET['category'] ?? '',
                    'priority' => $_GET['priority'] ?? '',
                    'limit' => $_GET['limit'] ?? 50
                ];
                $updates = $noticeModel->getAll($filters);
                jsonResponse(['success' => true, 'count' => count($updates), 'data' => $updates]);
            }
            break;

        case 'POST':
            requireAdminAuth();
            $data = getJsonInput();
            if (empty($data['title'])) {
                jsonResponse(['error' => 'Notice title is required'], 400);
            }
            $newId = $noticeModel->create($data);
            $created = $noticeModel->getById($newId);
            $auditModel->log('CREATE_CIRCULAR', 'circular', $newId, "Published circular: " . ($data['title'] ?? 'Notice'));
            jsonResponse(['success' => true, 'message' => 'Notice created', 'id' => $newId, 'data' => $created], 201);
            break;

        case 'PUT':
            requireAdminAuth();
            $data = getJsonInput();
            $id = $_GET['id'] ?? $data['_id'] ?? $data['id'] ?? null;
            if (!$id) {
                jsonResponse(['error' => 'Notice ID is required'], 400);
            }
            $noticeModel->update($id, $data);
            $updated = $noticeModel->getById($id);
            $auditModel->log('UPDATE_CIRCULAR', 'circular', $id, "Updated circular: " . ($updated['title'] ?? $id));
            jsonResponse(['success' => true, 'message' => 'Notice updated', 'data' => $updated]);
            break;

        case 'DELETE':
            requireAdminAuth();
            $id = $_GET['id'] ?? null;
            if (!$id) {
                jsonResponse(['error' => 'Notice ID is required'], 400);
            }
            $deleted = $noticeModel->delete($id);
            if ($deleted > 0) {
                $auditModel->log('DELETE_CIRCULAR', 'circular', $id, "Deleted circular ID: {$id}");
                jsonResponse(['success' => true, 'message' => 'Notice deleted']);
            } else {
                jsonResponse(['error' => 'Notice not found'], 404);
            }
            break;

        default:
            jsonResponse(['error' => "Method {$method} not allowed"], 405);
    }
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
