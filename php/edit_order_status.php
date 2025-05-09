<?php
require 'config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];
$served = $data['served'];

$stmt = $conn->prepare("UPDATE orders SET served = ? WHERE id = ?");
$stmt->bind_param("ii", $served, $id);
$response = [];

if ($stmt->execute()) {
    $response['success'] = true;
    $response['message'] = 'Order status updated.';
} else {
    $response['success'] = false;
    $response['message'] = 'Failed to update order.';
}

echo json_encode($response);
?>
