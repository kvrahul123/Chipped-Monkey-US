<?php
// microchip.php

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type to plain text (like raw PHP response)
header('Content-Type: text/plain');

$envFile = __DIR__ . '/../backend/.env';
if (!file_exists($envFile)) {
    echo "ERROR";
    exit;
}

$env = [];
foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
    if (strpos(trim($line), '#') === 0) continue; // skip comments
    [$key, $value] = explode('=', $line, 2);
    $env[trim($key)] = trim($value);
}

// Get query parameters
$username = isset($_GET['username']) ? $_GET['username'] : null;
$password = isset($_GET['password']) ? $_GET['password'] : null;
$chipnumber = isset($_GET['chipnumber']) ? $_GET['chipnumber'] : null;

// Check required parameters
if (!$username || !$password || !$chipnumber || strlen($chipnumber) < 15) {
    echo "ERROR";
    exit;
}

// DB credentials (change these according to your database)
$host = 'localhost';
$dbname = $env['DB_NAME'] ?? '';
$dbuser = $env['DB_USER'] ?? '';
$dbpass = $env['DB_PASS'] ?? '';
$port = 3306; // default to 3306 if not set

try {
    // Connect to MySQL using PDO
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8", $dbuser, $dbpass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Optional: map usernames to passwords (like in TypeScript code)
    $validUsers = [
        'pet_trac' => 'zxc789qwe123',
        
    ];

    if (!isset($validUsers[$username]) || $validUsers[$username] !== $password) {
        echo "ERROR";
        exit;
    }

    // Check microchip in main table
    $stmt = $pdo->prepare("SELECT 1 FROM contact WHERE microchip_number = :chip LIMIT 1");
    $stmt->execute(['chip' => $chipnumber]);
    $found = $stmt->fetchColumn();

    if ($found) {
        echo "TRUE"; // microchip exists
        exit;
    }

    // Check microchip in external table
    $stmt = $pdo->prepare("SELECT 1 FROM external_microchips WHERE microchip_number = :chip LIMIT 1");
    $stmt->execute(['chip' => $chipnumber]);
    $foundExternal = $stmt->fetchColumn();

    if ($foundExternal) {
        echo "INFO"; // or "INFO" depending on logic
        exit;
    }

    // Not found
    echo "FALSE";

} catch (PDOException $e) {
    error_log("DB Error: " . $e->getMessage());
    echo "ERROR". $e->getMessage();
}
