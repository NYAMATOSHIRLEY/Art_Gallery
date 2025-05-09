<?php
require 'config.php';

$result = $conn->query("
    SELECT o.*, u.full_name AS user_name 
    FROM orders o 
    JOIN users u ON o.user_id = u.id
");

$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

echo json_encode($orders);
?>
