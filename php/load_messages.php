<?php
require 'config.php';

header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$response = ['success' => false, 'messages' => [], 'message' => ''];

$query = "SELECT id, name, email, subject, message, attended_to, created_at 
          FROM contact_messages 
          ORDER BY attended_to ASC, created_at DESC";

$result = $conn->query($query);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $response['messages'][] = $row;
    }
    $response['success'] = true;
} else {
    $response['message'] = 'Failed to fetch messages.';
    $response['error'] = $conn->error; // comment this out in production
}

echo json_encode($response);
?>
