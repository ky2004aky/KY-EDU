<?php
namespace App\Models;

require_once __DIR__ . '/../config/Database.php';

use App\Config\Database;
use MongoDB\BSON\ObjectId;
use Exception;

class AuditLog {
    private Database $db;
    private string $collection = 'audit_logs';

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /**
     * Record an administrative event
     */
    public function log(string $action, string $entityType, ?string $entityId, array|string $details, ?string $adminName = 'System Admin'): void {
        try {
            $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $doc = [
                'action' => $action,
                'entityType' => $entityType,
                'entityId' => $entityId,
                'details' => is_array($details) ? json_encode($details, JSON_UNESCAPED_UNICODE) : (string)$details,
                'adminName' => $adminName,
                'ip' => $ip,
                'createdAt' => date('c')
            ];
            $this->db->insertOne($this->collection, $doc);
        } catch (Exception $e) {
            // Silently ignore audit log failure to not disrupt main transaction
        }
    }

    /**
     * Get recent audit logs
     */
    public function getRecent(int $limit = 30): array {
        try {
            return $this->db->find(
                $this->collection,
                [],
                [
                    'sort' => ['createdAt' => -1],
                    'limit' => $limit
                ]
            );
        } catch (Exception $e) {
            return [];
        }
    }
}