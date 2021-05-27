<?php

session_start();

require_once 'sql.php';
class cafeteriaClass extends DBController {
    function getSql($name) {
        global $_SQL;
        return $_SQL[$name];
    }

    public function studentinfo($param){
      $query = $this->getSql('student-info');
      $stmt = $this->db->prepare($query);
      $stmt->bindParam(1, $param);
      $today = date("D\, F j");
      $time = date("h:i A");
      if ($stmt->execute()) {
          $response = array();
          while ($row = $stmt->fetch()) {
            $tmp = array();
            $tmp["StudentID"] = $row["StudentID"];
            $tmp["FirstName"] = $row["FirstName"];
            $tmp["LastName"] = strtoupper($row["LastName"]);
            $tmp["EnglishName"] = $row["EnglishName"];
            $tmp["currentdate"] = $today;
            $tmp["currenttime"] = $time;
            $tmp["Halls"] = $row['Halls'];
            array_push($response, $tmp);
          }
         return $response;
      } else {
          return NULL;
      }
    }

    public function staffinfo($param){
      $query = $this->getSql('staff-info');
      $stmt = $this->db->prepare($query);
      $stmt->bindParam(1, $param);
      $today = date("D \, F j");
      $time = date("h:i A");

      if ($stmt->execute()) {
          $response = array();
          while ($row = $stmt->fetch()) {
            $tmp = array();
            $tmp["StaffID"] = $row["StaffID"];
            $tmp["FirstName"] = $row["FirstName"];
            $tmp["LastName"] = strtoupper($row["LastName"]);
            $tmp["EnglishName"] = "";
            $tmp["currentdate"] = $today;
            $tmp["currenttime"] = $time;
            $tmp["PositionTitle"] = $row["PositionTitle"];
            array_push($response, $tmp);
          }
         return $response;
      } else {
          return NULL;
      }
    }

    public function addPersonRow($param){
      $query = $this->getSql('insert-meal-row');
      $query_search = $this->getSql('find-numberofmeal');

      $stmt = $this->db->prepare($query);
      $stmt_search = $this->db->prepare($query_search);

      $today = date('Y-m-d');
      $time = date('H:i:s');
      $personCategory = '';

      if($param[0] == 'F'){
        $personCategory = 'Staff';
      } else {
        $personCategory = 'Student';
      }

      $scanCategory = 'SL-CAF';
      $scannerID = '101';
      $schoolID = 'BHS';
      $semesterID = '72';

      $stmt->bindParam(1, $today);
      $stmt->bindParam(2, $time);
      $stmt->bindParam(3, $scanCategory);
      $stmt->bindParam(4, $scannerID);
      $stmt->bindParam(5, $param);
      $stmt->bindParam(6, $personCategory);
      $stmt->bindParam(7, $schoolID);
      $stmt->bindParam(8, $semesterID);
      $stmt->bindParam(9, $param);

      $stmt_search->bindParam(1, $param);
      $stmt_search->bindParam(2, $today);

      if ($stmt->execute()) {
          $response = array();
            $tmp = array();
            $tmp['result'] = 1;

            $stmt_search->execute();
            while ($row_search = $stmt_search->fetch()) {
              $tmp["num"] = $row_search["num"];
              $tmp["category"] = $personCategory;
            }
            array_push($response, $tmp);
         return $response;
      } else {
          return NULL;
      }
    }
}
?>
