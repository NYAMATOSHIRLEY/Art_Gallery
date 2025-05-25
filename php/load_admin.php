<?php
require 'config.php'; // your database connection

$sort = $_GET['sort'] ?? 'newest';

switch ($sort) {
    case 'oldest':
        $orderBy = "created_at ASC";
        break;
    case 'title-asc':
        $orderBy = "title ASC";
        break;
    case 'title-desc':
        $orderBy = "title DESC";
        break;
    default:
        $orderBy = "created_at DESC";
        break;
}

$sql = "SELECT a.id, a.title, a.image,a.price, a.created_at,a.updated_at, ar.name AS artist ,a.show, a.quantity
        FROM arts a
        JOIN artists ar ON a.artist_id = ar.id
        ORDER BY $orderBy";
    
$result = $conn->query($sql);
$arts = [];

while ($row = $result->fetch_assoc()) {
    $arts[] = $row;
}

header('Content-Type: application/json');
echo json_encode($arts);
?>
