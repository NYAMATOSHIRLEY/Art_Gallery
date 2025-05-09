<?php
require 'config.php';
session_start();

// Set the correct header for JSON response
header('Content-Type: application/json');

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

$response = ['success' => false];

if (!$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'email and password are required.']);
    exit;
}

// Fetch user with admin role
$stmt = $conn->prepare("SELECT id, password, full_name, email FROM users WHERE email = ? AND role = 'admin'");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 1) {
    $stmt->bind_result($id, $hashed_password, $full_name, $email);
    $stmt->fetch();

    if (password_verify($password, $hashed_password)) {
        // Store in PHP session if needed
        $_SESSION['user_id'] = $id;
        $_SESSION['username'] = $email;
        $_SESSION['role'] = 'admin';

        // Return user info to JS
        $response['success'] = true;
        $response['full_name'] = $full_name;
        $response['email'] = $email;
    } else {
        $response['message'] = 'Invalid password.';
    }
} else {
    $response['message'] = 'Admin user not found.';
}

echo json_encode($response);
?>
