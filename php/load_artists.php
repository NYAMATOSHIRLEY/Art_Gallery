<?php
require_once 'config.php';

$sort = $_GET['sort'] ?? 'name';
$allowedSort = ['name', 'created_at'];
$sort = in_array($sort, $allowedSort) ? $sort : 'name';

$stmt = $conn->prepare("SELECT id, name,bio,birth_date,town, created_at FROM artists ORDER BY $sort ASC");
$stmt->execute();
$result = $stmt->get_result();
$artists = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($artists);
?>
