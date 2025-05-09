<?php
require 'config.php';

function fetchData($conn, $query, $labelField, $valueField) {
    $results = [];
    $res = $conn->query($query);
    while ($row = $res->fetch_assoc()) {
        $results[] = [
            'label' => $row[$labelField],
            'value' => $row[$valueField]
        ];
    }
    return $results;
}

$data = [
    'quantityOrdered' => fetchData($conn, "
        SELECT a.title AS label, SUM(o.quantity) AS value
        FROM orders o
        JOIN arts a ON o.art_id = a.id
        GROUP BY o.art_id
    ", 'label', 'value'),

    'totalAmount' => fetchData($conn, "
        SELECT a.title AS label, SUM(o.total_price) AS value
        FROM orders o
        JOIN arts a ON o.art_id = a.id
        GROUP BY o.art_id
    ", 'label', 'value'),

    'userSpending' => fetchData($conn, "
        SELECT u.full_name AS label, SUM(o.total_price) AS value
        FROM orders o
        JOIN users u ON o.user_id = u.id
        GROUP BY o.user_id
    ", 'label', 'value'),

    'artistArtCount' => fetchData($conn, "
        SELECT ar.name AS label, COUNT(a.id) AS value
        FROM arts a
        JOIN artists ar ON a.artist_id = ar.id
        GROUP BY ar.id
    ", 'label', 'value')
];

header('Content-Type: application/json');
echo json_encode($data);
