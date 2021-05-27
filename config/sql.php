<?php

$_SQL = array(
    'student-info' => "SELECT a.StudentID, a.LastName, a.FirstName, a.EnglishName, t.Halls, t.Residence, t.Homestay, a.CurrentStudent
                        FROM tblBHSStudent as a
                        LEFT JOIN tblBHSHomestay as t on t.StudentID = a.StudentID
                        WHERE a.StudentID = ? AND a.CurrentStudent IN ('Y', 'A', 'N')",

    'insert-meal-row' => "INSERT INTO tblBHSScanHistory (ScanDate, ScanTime, ScanPerDay, ScanCategory, ScannerID, UserID, UserCategory, UserSubCategory, SchoolID, SemesterID, CreateUserID, Status, Amount)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ",

    'find-numberofmeal' => "SELECT COUNT(ScanID) as num FROM tblBHSScanHistory
                            WHERE UserID = ? AND ScanDate = ? ",

    'staff-info' => "SELECT StaffID, FirstName, LastName, PositionTitle2, Department2, FullPart FROM tblStaff
                      WHERE MealTagID = ? ",

    'find-currentsemester' => "SELECT SemesterID FROM tblBHSSemester WHERE CurrentSemester = 'Y' "

    );



?>
