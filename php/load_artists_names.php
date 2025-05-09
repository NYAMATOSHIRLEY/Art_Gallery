<?php
require 'config.php'; // assumes $conn is your mysqli connection

$query = "SELECT id, name FROM artists ORDER BY name ASC";
$result = $conn->query($query);

$artists = [];
while ($row = $result->fetch_assoc()) {
    $artists[] = $row;
}

echo json_encode($artists);
?>
