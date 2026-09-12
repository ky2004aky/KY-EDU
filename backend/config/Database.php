<?php
namespace App\Config;

use MongoDB\Driver\Manager;
use MongoDB\Driver\Query;
use MongoDB\Driver\BulkWrite;
use MongoDB\Driver\Command;
use MongoDB\BSON\ObjectId;
use Exception;

class Database {
    private static ?Database $instance = null;
    private Manager $manager;
    private string $dbName;

    private function __construct() {
        $uri = getenv('MONGODB_URI') ?: 'mongodb://localhost:27017';
        $this->dbName = getenv('MONGODB_DB') ?: 'ky_edu_db';
        try {
            $this->manager = new Manager($uri);
        } catch (Exception $e) {
            throw new Exception("MongoDB Connection Error: " . $e->getMessage());
        }
    }

    public static function getInstance(): Database {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function getDbName(): string {
        return $this->dbName;
    }

    public function getManager(): Manager {
        return $this->manager;
    }

    /**
     * Convert string ID to ObjectId if valid
     */
    public function toObjectId(string $id): ObjectId|string {
        if (preg_match('/^[a-f\d]{24}$/i', $id)) {
            try {
                return new ObjectId($id);
            } catch (Exception $e) {
                return $id;
            }
        }
        return $id;
    }

    /**
     * Normalize a MongoDB document/object to an associative array with string _id
     */
    public function formatDoc(object|array $doc): array {
        $arr = (array)$doc;
        if (isset($arr['_id'])) {
            if ($arr['_id'] instanceof ObjectId) {
                $arr['_id'] = (string)$arr['_id'];
            } elseif (is_object($arr['_id']) && isset($arr['_id']->{'$oid'})) {
                $arr['_id'] = (string)$arr['_id']->{'$oid'};
            }
        }
        // Recursively convert stdClass to array
        foreach ($arr as $key => $value) {
            if (is_object($value)) {
                $arr[$key] = $this->formatDoc($value);
            } elseif (is_array($value)) {
                $arr[$key] = array_map(fn($item) => is_object($item) ? $this->formatDoc($item) : $item, $value);
            }
        }
        return $arr;
    }

    /**
     * Query documents
     */
    public function find(string $collection, array $filter = [], array $options = []): array {
        $namespace = "{$this->dbName}.{$collection}";
        $query = new Query($filter, $options);
        $cursor = $this->manager->executeQuery($namespace, $query);
        $results = [];
        foreach ($cursor as $document) {
            $results[] = $this->formatDoc($document);
        }
        return $results;
    }

    /**
     * Find single document
     */
    public function findOne(string $collection, array $filter = []): ?array {
        $options = ['limit' => 1];
        $results = $this->find($collection, $filter, $options);
        return !empty($results) ? $results[0] : null;
    }

    /**
     * Insert a single document and return its string ID
     */
    public function insertOne(string $collection, array $data): string {
        $namespace = "{$this->dbName}.{$collection}";
        $bulk = new BulkWrite();
        
        if (!isset($data['_id'])) {
            $oid = new ObjectId();
            $data['_id'] = $oid;
            $returnId = (string)$oid;
        } else {
            $returnId = is_string($data['_id']) ? $data['_id'] : (string)$data['_id'];
        }

        $bulk->insert($data);
        $this->manager->executeBulkWrite($namespace, $bulk);
        return $returnId;
    }

    /**
     * Insert multiple documents
     */
    public function insertMany(string $collection, array $docs): int {
        if (empty($docs)) return 0;
        $namespace = "{$this->dbName}.{$collection}";
        $bulk = new BulkWrite();
        foreach ($docs as $doc) {
            if (!isset($doc['_id'])) {
                $doc['_id'] = new ObjectId();
            }
            $bulk->insert($doc);
        }
        $result = $this->manager->executeBulkWrite($namespace, $bulk);
        return $result->getInsertedCount();
    }

    /**
     * Update documents matching filter
     */
    public function update(string $collection, array $filter, array $update, array $options = ['multi' => false]): int {
        $namespace = "{$this->dbName}.{$collection}";
        $bulk = new BulkWrite();
        $bulk->update($filter, $update, $options);
        $result = $this->manager->executeBulkWrite($namespace, $bulk);
        return $result->getModifiedCount();
    }

    /**
     * Delete documents matching filter
     */
    public function delete(string $collection, array $filter, array $options = ['limit' => 1]): int {
        $namespace = "{$this->dbName}.{$collection}";
        $bulk = new BulkWrite();
        $bulk->delete($filter, $options);
        $result = $this->manager->executeBulkWrite($namespace, $bulk);
        return $result->getDeletedCount();
    }

    /**
     * Drop a collection
     */
    public function dropCollection(string $collection): bool {
        try {
            $cmd = new Command(['drop' => $collection]);
            $this->manager->executeCommand($this->dbName, $cmd);
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Count documents matching filter
     */
    public function count(string $collection, array $filter = []): int {
        $cmd = new Command([
            'count' => $collection,
            'query' => (object)$filter
        ]);
        try {
            $res = $this->manager->executeCommand($this->dbName, $cmd)->toArray();
            return isset($res[0]->n) ? (int)$res[0]->n : 0;
        } catch (Exception $e) {
            return count($this->find($collection, $filter));
        }
    }
}
