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
      $today = date("l\<\b\\r>M j");
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
            $tmp["CurrentStudent"] = $row["CurrentStudent"];
            $tmp["Halls"] = $row['Halls'];
            $tmp["Residence"] = $row['Residence'];
            $tmp["Homestay"] = $row['Homestay'];
            $c = new cafeteriaClass();
        		$tmp["NumberOfMeal"] = $c->findNumofMeal($param);
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
      $today = date("l\<\b\\r>M j");
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
            $tmp["Department"] = $row["Department2"];
            $tmp["FullPart"] = $row['FullPart'];

            $c = new cafeteriaClass();
        		$tmp["NumberOfMeal"] = $c->findNumofMeal($row["StaffID"]);
            array_push($response, $tmp);
          }
         return $response;
      } else {
          return NULL;
      }
    }

    public function findNumofMeal($param) {
      $query_search = $this->getSql('find-numberofmeal');
      $stmt_search = $this->db->prepare($query_search);
      $today = date('Y-m-d');
      $stmt_search->bindParam(1, $param);
      $stmt_search->bindParam(2, $today);
      $stmt_search->execute();
      while ($row_search = $stmt_search->fetch()) {
        $tmp = $row_search["num"] + 1;
      }
      return $tmp;
    }

    public function addPersonRow($param, $ScanPerDay, $UserSubCategory, $mealStatus, $mealAmount){
      $query = $this->getSql('insert-meal-row');
      $query_search = $this->getSql('find-numberofmeal');
      $stmt = $this->db->prepare($query);

      $today = date('Y-m-d');
      $time = date('H:i:s');
      $personCategory = '';

      if(!is_numeric($param[0])){
        $personCategory = 'Staff';
      } else {
        $personCategory = 'Student';
      }

      $scanCategory = 'SL-CAF';
      $scannerID = '101';
      $schoolID = 'BHS';
      $v = new cafeteriaClass();
      $semesterID = $v->findCurrentSemester();

      $stmt->bindParam(1, $today);
      $stmt->bindParam(2, $time);
      $stmt->bindParam(3, $ScanPerDay);
      $stmt->bindParam(4, $scanCategory);
      $stmt->bindParam(5, $scannerID);
      $stmt->bindParam(6, $param);
      $stmt->bindParam(7, $personCategory);
      $stmt->bindParam(8, $UserSubCategory);
      $stmt->bindParam(9, $schoolID);
      $stmt->bindParam(10, $semesterID);
      $stmt->bindParam(11, $param);
      $stmt->bindParam(12, $mealStatus);
      $stmt->bindParam(13, $mealAmount);



      if ($stmt->execute()) {
          $response = array();
            $tmp = array();
            $tmp['result'] = 1;
            array_push($response, $tmp);
         return $response;
      } else {
          return NULL;
      }
    }

    public function findCurrentSemester() {
      $query = $this->getSql('find-currentsemester');
      $stmt = $this->db->prepare($query);
      $stmt->execute();
      while ($row = $stmt->fetch()) {
        $tmp = $row["SemesterID"];
      }
      return $tmp;
    }
}
?>
