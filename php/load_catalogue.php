<?php
require 'config.php';

$result = $conn->query("SELECT a.id, a.title, a.price, a.image, a.quantity, ar.name as artist 
                        FROM arts a 
                        JOIN artists ar ON a.artist_id = ar.id 
                        WHERE a.show = 1");

$arts = [];
while ($row = $result->fetch_assoc()) {
    $arts[] = $row;
}
echo json_encode($arts);
?>
