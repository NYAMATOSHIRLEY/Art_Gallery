<?php
session_start();
session_unset();    // Unset all session variables
session_destroy();  // Destroy the session

// Return JSON response (optional, for fetch call)
echo json_encode(['success' => true]);
?>
