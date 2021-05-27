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
        $hostName = $_SERVER['SERVER_NAME'];

        if($hostName == 'admin.bodwell.edu') {
        } elseif ($hostName == 'dev.bodwell.edu') {
        } elseif ($hostName == 'cafe.bodwell.edu') {
        } else {
        }

        $conn = new PDO($dsn);

        return $conn;
    }
}
?>
