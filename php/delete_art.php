<?php
require 'config.php'; // Ensure this file connects to your MySQL database

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $id = intval($_DELETE['id'] ?? 0);

    if ($id > 0) {
        // Disable foreign key checks
        $conn->query("SET FOREIGN_KEY_CHECKS = 0");

        $stmt = $conn->prepare("DELETE FROM arts WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            $response = ["success" => true, "message" => "Artwork deleted successfully."];
            http_response_code(200);
        } else {
            $response = ["success" => false, "message" => "Failed to delete artwork."];
            http_response_code(500);
        }

        $stmt->close();

        // Re-enable foreign key checks
        $conn->query("SET FOREIGN_KEY_CHECKS = 1");

        echo json_encode($response);
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid ID."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
