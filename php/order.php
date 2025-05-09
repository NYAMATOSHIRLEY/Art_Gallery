<?php
session_start();
require 'config.php';

$user_id = $_SESSION['user_id'];
$result = $conn->query("SELECT * FROM cart WHERE user_id = $user_id");

while ($cartItem = $result->fetch_assoc()) {
    $art_id = $cartItem['art_id'];
    $quantity = $cartItem['quantity'];

    $priceQuery = $conn->query("SELECT price FROM arts WHERE id = $art_id");
    $price = $priceQuery->fetch_assoc()['price'];
    $total = $price * $quantity;

    $stmt = $conn->prepare("INSERT INTO orders (user_id, art_id, quantity, total_price, date) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param("iiid", $user_id, $art_id, $quantity, $total);
    $stmt->execute();
}
$conn->query("DELETE FROM cart WHERE user_id = $user_id");

header("Location: ../payment.html");
?>
