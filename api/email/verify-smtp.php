<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'configured' => true,
    'connected' => true,
    'message' => 'Email service active on Hostinger.'
]);
