<?php
require 'config.php';

$name = $_POST['eventName'];
$location = $_POST['eventLocation'];
$date = $_POST['eventDate'];
$time = $_POST['eventTime'];
$host = $_POST['eventHost'];

$response = ['success' => false, 'message' => ''];

if ($name && $location && $date && $time && $host) {
    $stmt = $conn->prepare("INSERT INTO events (name, location, date, time, host, added_on) VALUES (?, ?, ?, ?, ?, NOW())");
    $stmt->bind_param("sssss", $name, $location, $date, $time, $host);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Event scheduled successfully.';
    } else {
        $response['message'] = 'Error scheduling event: ' . $stmt->error;
    }

    $stmt->close();
} else {
    $response['message'] = 'All fields are required.';
}

echo json_encode($response);
?>
