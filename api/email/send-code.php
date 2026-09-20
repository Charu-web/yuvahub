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

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please enter a valid email address (कृपया वैध ईमेल आयडी प्रविष्ट करा).']);
    exit;
}

// Generate 6-digit code
$code = strval(random_int(100000, 999999));
$expiresAt = time() + (5 * 60); // 5 minutes

// Storage in temp directory
$storeDir = sys_get_temp_dir() . '/nokrimela_otp';
if (!is_dir($storeDir)) {
    mkdir($storeDir, 0777, true);
}

$filename = $storeDir . '/' . md5($email) . '.json';
file_put_contents($filename, json_encode([
    'email' => $email,
    'code' => $code,
    'expiresAt' => $expiresAt,
    'attempts' => 0
]));

// Mask Email for Response
$parts = explode('@', $email);
$local = $parts[0];
$domain = $parts[1];
if (strlen($local) <= 3) {
    $masked = substr($local, 0, 1) . '***@' . $domain;
} else {
    $masked = substr($local, 0, 2) . '***' . substr($local, -2) . '@' . $domain;
}

// HTML Email Body
$subject = "[$code] भव्य नोकरी मेळावा २०२६ - ईमेल पडताळणी कोड";
$message = '
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background-color: #fdfaf6; margin: 0; padding: 20px; color: #333;">
  <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #FFE0C4; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
    <div style="background: linear-gradient(135deg, #FF5400, #ea580c); padding: 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 22px; font-weight: 800;">खासदार श्रीरंग आप्पा बारणे</h1>
      <p style="margin: 6px 0 0 0; font-size: 13px;">भव्य नोकरी मेळावा २०२६ (Grand Job Fair 2026)</p>
    </div>
    <div style="padding: 30px 24px; text-align: center;">
      <h2 style="font-size: 18px; color: #222;">ईमेल पडताळणी कोड (Email Verification Code)</h2>
      <p style="font-size: 14px; color: #666;">उमेदवार नोंदणी पूर्ण करण्यासाठी आपला ६ अंकी पडताळणी कोड खालीलप्रमाणे आहे:</p>
      <div style="display: inline-block; background: #FFF8F3; border: 2px dashed #ea580c; border-radius: 12px; padding: 14px 32px; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #ea580c; font-family: monospace;">' . $code . '</span>
      </div>
      <p style="font-size: 13px; color: #777;">⏱️ हा कोड पुढील <strong>५ मिनिटांसाठी</strong> वैध आहे.</p>
    </div>
    <div style="background: #f7f7f7; padding: 14px; text-align: center; font-size: 11px; color: #888;">
      © 2026 खासदार श्रीरंग आप्पा बारणे - भव्य नोकरी मेळावा २०२६.
    </div>
  </div>
</body>
</html>';

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: =?UTF-8?B?" . base64_encode("भव्य नोकरी मेळावा २०२६") . "?= <csonker04@gmail.com>\r\n";
$headers .= "Reply-To: csonker04@gmail.com\r\n";

@mail($email, $subject, $message, $headers);

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Verification code sent to email successfully.',
    'maskedEmail' => $masked,
    'expiresIn' => 300
]);
