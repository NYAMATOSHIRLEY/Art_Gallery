<?php
require 'config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';

if (!$email) {
    echo json_encode(['success' => false, 'message' => 'Email is required']);
    exit;
}

$stmt = $conn->prepare("SELECT id, full_name, role FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    echo json_encode(['success' => true, 'id' => $user['id'], 'full_name' => $user['full_name'], 'role' => $user['role']]);
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
}

$stmt->close();
?>
