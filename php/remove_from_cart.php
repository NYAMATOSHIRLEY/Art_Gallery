<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
$art_id = $data['art_id'];

$stmt = $conn->prepare("DELETE FROM cart WHERE art_id = ?");
$stmt->bind_param("i", $art_id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo "Item removed from cart.";
} else {
    echo "Failed to remove item.";
}
?>
