<?php
$host = "localhost";
$db_user = "root";
$db_pass = "";  // Assuming no password for XAMPP default
$db_name = "art_gallery";

$conn = new mysqli($host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
// echo "Connection successful!";
?>
