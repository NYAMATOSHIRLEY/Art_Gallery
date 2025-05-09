<?php
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? '';

$response = ['success' => false, 'message' => ''];

if ($id) {
    $stmt = $conn->prepare("DELETE FROM artists WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Artist deleted successfully.';
    } else {
        $response['message'] = 'Error deleting artist.';
    }
    $stmt->close();
} else {
    $response['message'] = 'Artist ID is required.';
}

echo json_encode($response);
?>
