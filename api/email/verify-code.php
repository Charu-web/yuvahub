<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$email = isset($input['email']) ? trim(strtolower($input['email'])) : '';
$code = isset($input['code']) ? trim(strval($input['code'])) : '';

if (empty($email) || empty($code)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email and code are required.']);
    exit;
}

$storeDir = sys_get_temp_dir() . '/nokrimela_otp';
$filename = $storeDir . '/' . md5($email) . '.json';

if (!file_exists($filename)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No verification code requested for this email. Please click "Send Verification Code" first.']);
    exit;
}

$data = json_decode(file_get_contents($filename), true);

if (time() > $data['expiresAt']) {
    @unlink($filename);
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Verification code expired. Please request a new code.']);
    exit;
}

if ($data['attempts'] >= 5) {
    @unlink($filename);
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Too many incorrect attempts. Please request a new code.']);
    exit;
}

if ($data['code'] !== $code) {
    $data['attempts'] += 1;
    file_put_contents($filename, json_encode($data));
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid verification code. Please enter the correct code (अवैध पडताळणी कोड).',
        'attemptsLeft' => 5 - $data['attempts']
    ]);
    exit;
}

// Invalidate code on success
@unlink($filename);

http_response_code(200);
echo json_encode([
    'success' => true,
    'verified' => true,
    'message' => 'Email Verified ✓',
    'verifiedEmail' => $email
]);
