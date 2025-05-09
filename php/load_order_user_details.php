<?php
require 'config.php';
$id = $_GET['id'];

$stmt = $conn->prepare("
    SELECT o.*, u.full_name AS user_name, u.email AS user_email 
    FROM orders o 
    JOIN users u ON o.user_id = u.id 
    WHERE o.id = ?
");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
echo json_encode($result->fetch_assoc());
?>
