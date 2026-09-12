<?php
namespace App\Models;

require_once __DIR__ . '/../config/Database.php';

use App\Config\Database;
use MongoDB\BSON\ObjectId;

class Career {
    private Database $db;
    private string $collection = 'careers';

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll(array $filters = []): array {
        $mongoFilter = [];

        if (!empty($filters['search'])) {
            $regex = new \MongoDB\BSON\Regex(preg_quote($filters['search']), 'i');
            $mongoFilter['$or'] = [
                ['title' => $regex],
                ['stream' => $regex],
                ['overview' => $regex],
                ['topRoles' => $regex]
            ];
        }

        if (!empty($filters['stream']) && $filters['stream'] !== 'All') {
            $mongoFilter['stream'] = $filters['stream'];
        }

        $options = ['sort' => ['title' => 1]];
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
        return $this->db->insertOne($this->collection, $data);
    }

    public function update(string $id, array $data): int {
        $oid = $this->db->toObjectId($id);
        unset($data['_id']);
        $data['updatedAt'] = date('Y-m-d H:i:s');
        return $this->db->update($this->collection, ['_id' => $oid], ['$set' => $data]);
    }

    public function delete(string $id): int {
        $oid = $this->db->toObjectId($id);
        return $this->db->delete($this->collection, ['_id' => $oid]);
    }
}
