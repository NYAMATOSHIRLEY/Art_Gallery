<?php
// Enable error reporting for development
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Ensure JSON response type
header('Content-Type: application/json');

require_once 'config.php'; // Include your database connection

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['artTitle'] ?? '';
    $artist = $_POST['artArtist'] ?? '';
    $price = $_POST['artPrice'] ?? '';
    $quantity = $_POST['artQuantity'] ?? '';
    $show = $_POST['show'] ?? '';
    $image = $_FILES['artImage'] ?? null;

    if (!$title || !$artist || !$price || $quantity === '' || $show === '' || !$image) {
        $response['message'] = 'All fields are required.';
        echo json_encode($response);
        exit;
    }

    // Handle image upload
    $targetDir = '../images/';
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true); // Ensure directory exists
    }

    $imageName = uniqid() . "_" . basename($image['name']); // Prevent filename collisions
    $targetFile = $targetDir . $imageName;
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    // Check if file is an image
    $check = getimagesize($image['tmp_name']);
    if ($check === false) {
        $response['message'] = 'File is not a valid image.';
        echo json_encode($response);
        exit;
    }

    if (!move_uploaded_file($image['tmp_name'], $targetFile)) {
        $response['message'] = 'Failed to upload image.';
        echo json_encode($response);
        exit;
    }

    $imagePath = 'images/' . $imageName;

    // Save to database with show and quantity
    $stmt = $conn->prepare("INSERT INTO arts (title, artist_id, price, quantity,`show`, image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())");
    $stmt->bind_param("sidiss", $title, $artist, $price, $quantity, $show, $imagePath);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Art saved successfully.';
    } else {
        $response['message'] = 'Database error: ' . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}

echo json_encode($response);
?>
