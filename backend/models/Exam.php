<?php
namespace App\Models;

require_once __DIR__ . '/../config/Database.php';

use App\Config\Database;
use MongoDB\BSON\ObjectId;
use Exception;

class Exam {
    private Database $db;
    private string $collection = 'exams';

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll(array $filters = []): array {
        $mongoFilter = [];

        // Search text (title, shortName, conductingBody, posts)
        if (!empty($filters['search'])) {
            $regex = new \MongoDB\BSON\Regex(preg_quote($filters['search']), 'i');
            $mongoFilter['$or'] = [
                ['title' => $regex],
                ['shortName' => $regex],
                ['conductingBody' => $regex],
                ['posts' => $regex],
                ['category' => $regex]
            ];
        }

        // Category filter
        if (!empty($filters['category']) && $filters['category'] !== 'All') {
            $mongoFilter['category'] = $filters['category'];
        }

        // Education level filter
        if (!empty($filters['educationLevel']) && $filters['educationLevel'] !== 'All') {
            $mongoFilter['eligibility.educationLevel'] = $filters['educationLevel'];
        }

        // Status filter
        if (!empty($filters['status']) && $filters['status'] !== 'All') {
            $mongoFilter['status'] = $filters['status'];
        }

        // Min/Max age filter
        if (!empty($filters['age'])) {
            $age = (int)$filters['age'];
            $mongoFilter['eligibility.minAge'] = ['$lte' => $age];
            $mongoFilter['eligibility.maxAge'] = ['$gte' => $age];
        }

        $options = [
            'sort' => ['featured' => -1, 'updatedAt' => -1]
        ];

        if (!empty($filters['limit'])) {
            $options['limit'] = (int)$filters['limit'];
        }

        return $this->db->find($this->collection, $mongoFilter, $options);
    }

    public function getById(string $id): ?array {
        $oid = $this->db->toObjectId($id);
        return $this->db->findOne($this->collection, ['_id' => $oid]);
    }

    public function create(array $data): string {
        $now = date('Y-m-d H:i:s');
        $data['createdAt'] = $now;
        $data['updatedAt'] = $now;
        
        if (!isset($data['updates']) || !is_array($data['updates'])) {
            $data['updates'] = [];
        }
        if (!isset($data['featured'])) {
            $data['featured'] = false;
        }

        // Ensure numeric fields
        if (isset($data['eligibility']['minAge'])) {
            $data['eligibility']['minAge'] = (int)$data['eligibility']['minAge'];
        }
        if (isset($data['eligibility']['maxAge'])) {
            $data['eligibility']['maxAge'] = (int)$data['eligibility']['maxAge'];
        }

        return $this->db->insertOne($this->collection, $data);
    }

    public function update(string $id, array $data): int {
        $oid = $this->db->toObjectId($id);
        unset($data['_id']); // Don't overwrite _id
        $data['updatedAt'] = date('Y-m-d H:i:s');

        // Cast numeric types if provided
        if (isset($data['eligibility']['minAge'])) {
            $data['eligibility']['minAge'] = (int)$data['eligibility']['minAge'];
        }
        if (isset($data['eligibility']['maxAge'])) {
            $data['eligibility']['maxAge'] = (int)$data['eligibility']['maxAge'];
        }

        return $this->db->update(
            $this->collection,
            ['_id' => $oid],
            ['$set' => $data]
        );
    }

    /**
     * Apply an official update / notice to an exam
     * Fulfills "crud rules applay the update"
     */
    public function applyUpdate(string $id, array $updateItem): bool {
        $oid = $this->db->toObjectId($id);
        $now = date('Y-m-d H:i:s');

        $updateNotice = [
            'id' => uniqid('upd_'),
            'title' => $updateItem['title'] ?? 'Official Exam Update',
            'type' => $updateItem['type'] ?? 'Notification', // Admit Card, Result, Date Change, Vacancy Revision
            'date' => $updateItem['date'] ?? date('Y-m-d'),
            'description' => $updateItem['description'] ?? '',
            'link' => $updateItem['link'] ?? '',
            'appliedAt' => $now
        ];

        $setPayload = [
            'updatedAt' => $now,
            'lastNotice' => $updateNotice['title']
        ];

        // Optional status change
        if (!empty($updateItem['newStatus'])) {
            $setPayload['status'] = $updateItem['newStatus'];
        }
        if (!empty($updateItem['vacancies'])) {
            $setPayload['vacancies'] = $updateItem['vacancies'];
        }
        if (!empty($updateItem['examDate'])) {
            $setPayload['importantDates.examDate'] = $updateItem['examDate'];
        }
        if (!empty($updateItem['applicationDeadline'])) {
            $setPayload['importantDates.applicationDeadline'] = $updateItem['applicationDeadline'];
        }

        $modified = $this->db->update(
            $this->collection,
            ['_id' => $oid],
            [
                '$push' => ['updates' => ['$each' => [$updateNotice], '$position' => 0]],
                '$set' => $setPayload
            ]
        );

        return $modified > 0;
    }

    public function delete(string $id): int {
        $oid = $this->db->toObjectId($id);
        return $this->db->delete($this->collection, ['_id' => $oid]);
    }
}
