<?php
session_start();
require 'config.php';

$user_id = $_SESSION['user_id'];
$mpesa_pin = $_POST['mpesa_pin'];  // In real life, never store raw PINs

// Get latest order for this user
$order = $conn->query("SELECT id, total_price FROM orders WHERE user_id = $user_id ORDER BY id DESC LIMIT 1")->fetch_assoc();
$order_id = $order['id'];
$amount = $order['total_price'];

$mpesa_code = "MPESA" . rand(10000, 99999); // Simulated code

$stmt = $conn->prepare("INSERT INTO payments (order_id, mpesa_code, amount) VALUES (?, ?, ?)");
$stmt->bind_param("isd", $order_id, $mpesa_code, $amount);
$stmt->execute();

echo "<script>alert('Payment successful via M-Pesa Code: $mpesa_code'); window.location.href='../homepage.html';</script>";
?>
