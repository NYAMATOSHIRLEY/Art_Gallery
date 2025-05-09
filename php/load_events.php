<?php
require 'config.php';
$result = $conn->query("SELECT * FROM events ORDER BY added_on DESC");
$events = $result->fetch_all(MYSQLI_ASSOC);
echo json_encode($events);
?>