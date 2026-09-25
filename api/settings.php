<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$dbPath = __DIR__ . '/data/db.json';
if (file_exists($dbPath)) {
    $data = json_decode(file_get_contents($dbPath), true);
    $settings = isset($data['settings']) ? $data['settings'] : [];
    echo json_encode(['success' => true, 'settings' => $settings], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        'success' => true,
        'settings' => [
            'siteTitle' => 'Naukri Mahotsav 2026 | YuvaHub',
            'eventDate' => '२५ ऑक्टोबर २०२६',
            'eventVenue' => 'धाराशिव',
            'representativeName' => 'मा. ओमराजे निंबाळकर (खासदार, धाराशिव मतदार संघ)'
        ]
    ], JSON_UNESCAPED_UNICODE);
}
?>
