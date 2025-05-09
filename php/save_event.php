<?php
require 'config.php';

$name = $_POST['eventName'];
$location = $_POST['eventLocation'];
$date = $_POST['eventDate'];
$time = $_POST['eventTime'];
$host = $_POST['eventHost'];
$register_url = $_POST['eventRegisterUrl'];

$response = ['success' => false, 'message' => ''];

if ($name && $location && $date && $time && $host && $register_url) {
    $stmt = $conn->prepare("INSERT INTO events (name, location, event_date, event_time, host, register_url) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $name, $location, $date, $time, $host, $register_url);
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Event added successfully.';
    } else {
        $response['message'] = 'Error adding event.';
    }
    $stmt->close();
} else {
    $response['message'] = 'All fields are required.';
}

echo json_encode($response);
?>