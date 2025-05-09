<?php
require 'config.php';

$name = $_POST['artistName'];
$bio = $_POST['artistBio'];
$birth_date = $_POST['artistDob'];
$town = $_POST['artistTown'];

$response = ['success' => false, 'message' => ''];

if ($name && $bio && $birth_date && $town) {
    $stmt = $conn->prepare("INSERT INTO artists (name, bio, birth_date, town,created_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param("ssss", $name, $bio, $birth_date, $town);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Artist added successfully.';
    } else {
        $response['message'] = 'Error adding artist.';
    }
    $stmt->close();
} else {
    $response['message'] = 'All fields required.';
}

echo json_encode($response);

// echo "<script>alert('Artist added successfully'); window.location.href='../manage_artists.html';</script>";
?>
