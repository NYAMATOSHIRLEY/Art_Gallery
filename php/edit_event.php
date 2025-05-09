<?php
require_once 'config.php';

$response = ['success' => false, 'message' => ''];

if (
    isset($_POST['eventId'], $_POST['eventName'], $_POST['eventLocation'],
          $_POST['eventDate'], $_POST['eventTime'], $_POST['eventHost'], $_POST['eventRegisterUrl'])
) {
    $id = intval($_POST['eventId']);
    $name = $_POST['eventName'];
    $location = $_POST['eventLocation'];
    $date = $_POST['eventDate'];
    $time = $_POST['eventTime'];
    $host = $_POST['eventHost'];
    $url = $_POST['eventRegisterUrl'];

    $stmt = $conn->prepare("UPDATE events 
                            SET name = ?, location = ?, event_date = ?, event_time = ?, host = ?, register_url = ? 
                            WHERE id = ?");
    $stmt->bind_param("ssssssi", $name, $location, $date, $time, $host, $url, $id);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Event updated successfully.';
    } else {
        $response['message'] = 'Failed to update event.';
    }

    $stmt->close();
} else {
    $response['message'] = 'Missing required fields.';
}

echo json_encode($response);
?>
