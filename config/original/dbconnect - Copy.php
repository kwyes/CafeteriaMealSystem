<?php
class DBController {
    protected $db;
    function __construct() {
        $this->db = $this->connectDB();
    }
    function __destruct() {
		    $this->db = null;
    }
    private function connectDB() {

        return $conn;
    }
}
?>
