<?php
session_start();
require 'config.php';

$user_id = $_SESSION['user_id'] ?? null;
if (!$user_id) {
    echo "Login required.";
    exit;
}

$sql = "SELECT c.quantity,a.id, a.title, a.image, a.price, ar.name AS artist 
        FROM cart c 
        JOIN arts a ON c.art_id = a.id 
        JOIN artists ar ON a.artist_id = ar.id 
        WHERE c.user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$items = [];
while ($row = $result->fetch_assoc()) {
    $items[] = $row;
}
echo json_encode($items);
?>
