<?php
require 'config.php';

// Set JSON response header
header('Content-Type: application/json');

// Get the POST data
$data = json_decode(file_get_contents('php://input'), true);
$user_id = $data['user_id'] ?? null;
$new_role = $data['new_role'] ?? null;

// Validate inputs
$valid_roles = ['client', 'artist'];
if (!$user_id || !$new_role || !in_array($new_role, $valid_roles)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input.']);
    exit;
}

// Update the user's role
$stmt = $conn->prepare("UPDATE users SET role = ? WHERE id = ?");
$stmt->bind_param("si", $new_role, $user_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Database update failed.']);
}

$stmt->close();
?>
