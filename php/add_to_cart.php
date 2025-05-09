<?php
session_start();
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    echo "Please login.";
    exit;
}

$art_id = $data['art_id'];
$quantity = $data['quantity'];

// Check if already in cart
$check = $conn->prepare("SELECT id FROM cart WHERE user_id = ? AND art_id = ?");
$check->bind_param("ii", $user_id, $art_id);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    $update = $conn->prepare("UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND art_id = ?");
    $update->bind_param("iii", $quantity, $user_id, $art_id);
    $update->execute();
} else {
    $insert = $conn->prepare("INSERT INTO cart (user_id, art_id, quantity) VALUES (?, ?, ?)");
    $insert->bind_param("iii", $user_id, $art_id, $quantity);
    $insert->execute();
}

echo "Added to cart!";
?>
