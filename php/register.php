<?php
ob_start(); // Start output buffering early
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS and Content-Type headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require 'config.php';

$response = [
    'success' => false,
    'message' => '',
    'redirect' => ''
];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Sanitize inputs with null-safe trimming
    $full_name = trim($_POST['full_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $role = $_POST['role'] ?? '';

    // Validate required fields
    if (empty($full_name) || empty($email) || empty($password) || empty($role)) {
        $response['message'] = 'All fields are required.';
        ob_end_clean();
        echo json_encode($response);
        exit;
    }

    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $response['message'] = 'Email already exists.';
        $stmt->close();
        ob_end_clean();
        echo json_encode($response);
        exit;
    }
    $stmt->close();

    // Hash password
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);

    // Insert user
    $stmt = $conn->prepare("INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $full_name, $email, $hashed_password, $role);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Registered successfully!';
        $response['redirect'] = 'catalogue.html';
    } else {
        $response['message'] = 'Registration failed: ' . $stmt->error;
    }

    $stmt->close();
} else {
    $response['message'] = 'Invalid request method.';
}

ob_end_clean();
echo json_encode($response);
?>
