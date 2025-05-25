<?php

// Enable error reporting for development
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require_once 'config.php'; // Include your database connection

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $artId = $_POST['artId'] ?? '';
  $title = $_POST['artTitle'] ?? '';
  $artist = $_POST['artArtist'] ?? '';
  $price = $_POST['artPrice'] ?? '';
  $quantity = $_POST['artQuantity'] ?? '';
  $show = $_POST['show'] ?? '';
  $image = $_FILES['artImage'] ?? null;

  if (!$artId || !$title || !$artist || !$price || $quantity === '' || $show === '') {
    $response['message'] = 'All fields are required.';
    echo json_encode($response);
    exit;
  }

  // Initialize image path
  $imagePath = null;

  // Handle image upload if a new image is provided
  if ($image && $image['tmp_name']) {
    $targetDir = '../images/';
    $imageName = basename($image['name']);
    $targetFile = $targetDir . $imageName;
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    // Check if image file is a actual image
    $check = getimagesize($image['tmp_name']);
    if ($check === false) {
      $response['message'] = 'File is not an image.';
      echo json_encode($response);
      exit;
    }

    // Move uploaded file
    if (!move_uploaded_file($image['tmp_name'], $targetFile)) {
      $response['message'] = 'Failed to upload image.';
      echo json_encode($response);
      exit;
    }

    $imagePath = 'images/' . $imageName;
  }

  // Update database
  if ($imagePath) {
    $stmt = $conn->prepare("UPDATE arts SET title = ?, artist_id = ?, price = ?, quantity = ?, `show` = ?, image = ?, updated_at = NOW() WHERE id = ?");
    $stmt->bind_param("sidiisi", $title, $artist, $price, $quantity, $show, $imagePath, $artId);
  } else {
    $stmt = $conn->prepare("UPDATE arts SET title = ?, artist_id = ?, price = ?, quantity = ?, `show` = ?, updated_at = NOW() WHERE id = ?");
    $stmt->bind_param("sidiii", $title, $artist, $price, $quantity, $show, $artId);
  }

  if ($stmt->execute()) {
    $response['success'] = true;
    $response['message'] = 'Art updated successfully.';
  } else {
    $response['message'] = 'Database error: ' . $stmt->error;
  }

  $stmt->close();
  $conn->close();
}

echo json_encode($response);
?>
