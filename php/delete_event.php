<?php
require 'config.php';
$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];
$stmt = $conn->prepare("DELETE FROM events WHERE id = ?");
$stmt->bind_param("i", $id);
$response = ['success' => $stmt->execute(), 'message' => $stmt->execute() ? 'Event Deletion Successful' : 'Error deleting'];
echo json_encode($response);
?>