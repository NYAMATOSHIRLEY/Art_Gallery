<?php
require 'config.php';

$res = $conn->query("SELECT a.title, SUM(o.total_price) AS total FROM orders o JOIN arts a ON o.art_id = a.id GROUP BY o.art_id");

$labels = [];
$sales = [];

while ($row = $res->fetch_assoc()) {
    $labels[] = $row['title'];
    $sales[] = $row['total'];
}

echo json_encode(['labels' => $labels, 'sales' => $sales]);
?>
