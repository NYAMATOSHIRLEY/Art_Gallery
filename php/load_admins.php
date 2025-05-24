<?php
require 'config.php';

// Set JSON response header
header('Content-Type: application/json');

// Fetch all users
$sql = "SELECT id, full_name, email, role, registered_on FROM users WHERE role = 'admin'";
$result = $conn->query($sql);

$admins = [];
while ($row = $result->fetch_assoc()) {
    $admins[] = $row;
}

echo json_encode($admins);
?>
