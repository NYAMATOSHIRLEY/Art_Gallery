<?php
require 'config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;
$attended = $data['attended_to'] ?? null;

$response = ['success' => false, 'message' => ''];

if (!$id || !is_numeric($attended)) {
    $response['message'] = 'Invalid data.';
    echo json_encode($response);
    exit;
}

$stmt = $conn->prepare("UPDATE contact_messages SET attended_to = ? WHERE id = ?");
$stmt->bind_param("ii", $attended, $id);

if ($stmt->execute()) {
    $response['success'] = true;
    $response['message'] = 'Attendance status updated.';
} else {
    $response['message'] = 'Database error: ' . $stmt->error;
}

$stmt->close();
echo json_encode($response);
?>
