<?php
require 'config.php';

$id = $_GET['id'];

// Join arts with artists to get the artist name
$stmt = $conn->prepare("
    SELECT 
        arts.*, 
        artists.name AS artist_name 
    FROM 
        arts 
    JOIN 
        artists ON arts.artist_id = artists.id 
    WHERE 
        arts.id = ?
");

$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

echo json_encode($result->fetch_assoc());
?>
