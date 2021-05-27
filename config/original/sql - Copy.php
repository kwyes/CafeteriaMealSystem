<?php

$_SQL = array(
    'student-info' => "SELECT a.StudentID, a.LastName, a.FirstName, a.EnglishName, t.Halls
                        FROM tblBHSStudent as a
                        LEFT JOIN tblBHSHomestay as t on t.StudentID = a.StudentID
                        WHERE a.StudentID = ?",

    'insert-meal-row' => "INSERT INTO tblBHSScanHistory (ScanDate, ScanTime, ScanCategory, ScannerID, UserID, UserCategory, SchoolID, SemesterID, CreateUserID)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ",

    'find-numberofmeal' => "SELECT COUNT(ScanID) as num FROM tblBHSScanHistory
                            WHERE UserID = ? AND ScanDate = ? ",

    'staff-info' => "SELECT StaffID, FirstName, LastName, PositionTitle FROM tblStaff
                      WHERE StaffID = ? "


    );



?>
