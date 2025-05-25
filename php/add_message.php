<?php
header('Content-Type: application/json');
require_once 'config.php'; // Your DB connection file

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $subject = trim($_POST['subject'] ?? '');
    $message = trim($_POST['message'] ?? '');

    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        $response['message'] = 'All fields are required.';
        echo json_encode($response);
        exit;
    }

    // Insert into DB
    $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $name, $email, $subject, $message);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Message saved.';
    } else {
        $response['message'] = 'Database error: ' . $stmt->error;
    }

    $stmt->close();
    $conn->close();
} else {
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>
