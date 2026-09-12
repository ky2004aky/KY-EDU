<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../models/Career.php';

use function App\Config\initCors;
use function App\Config\jsonResponse;
use function App\Config\getJsonInput;
use App\Models\Career;

initCors();

$careerModel = new Career();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            if (!empty($_GET['id'])) {
                $career = $careerModel->getById($_GET['id']);
                if (!$career) {
                    jsonResponse(['error' => 'Career pathway not found'], 404);
                }
                jsonResponse(['success' => true, 'data' => $career]);
            } else {
                $filters = [
                    'stream' => $_GET['stream'] ?? '',
                    'search' => $_GET['search'] ?? ''
                ];
                $careers = $careerModel->getAll($filters);
                jsonResponse(['success' => true, 'count' => count($careers), 'data' => $careers]);
            }
            break;

        case 'POST':
            $data = getJsonInput();
            if (empty($data['title']) || empty($data['stream'])) {
                jsonResponse(['error' => 'Title and Stream are required'], 400);
            }
            $newId = $careerModel->create($data);
            $career = $careerModel->getById($newId);
            jsonResponse(['success' => true, 'message' => 'Career path created', 'id' => $newId, 'data' => $career], 201);
            break;

        case 'PUT':
            $data = getJsonInput();
            $id = $_GET['id'] ?? $data['_id'] ?? $data['id'] ?? null;
            if (!$id) {
                jsonResponse(['error' => 'Career ID is required'], 400);
            }
            $careerModel->update($id, $data);
            $career = $careerModel->getById($id);
            jsonResponse(['success' => true, 'message' => 'Career path updated', 'data' => $career]);
            break;

        case 'DELETE':
            $id = $_GET['id'] ?? null;
            if (!$id) {
                jsonResponse(['error' => 'Career ID is required'], 400);
            }
            $deleted = $careerModel->delete($id);
            if ($deleted > 0) {
                jsonResponse(['success' => true, 'message' => 'Career path deleted']);
            } else {
                jsonResponse(['error' => 'Career not found'], 404);
            }
            break;

        default:
            jsonResponse(['error' => "Method {$method} not allowed"], 405);
    }
} catch (Exception $e) {
    jsonResponse(['error' => $e->getMessage()], 500);
}
