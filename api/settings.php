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
            'siteTitle' => 'खासदार नोकरी महोत्सव २०२६',
            'eventDate' => '२० सप्टेंबर २०२६',
            'eventVenue' => 'डिग्रस, यवतमाळ',
            'representativeName' => 'मा. संजय देशमुख (खासदार यवतमाळ - वाशिम)'
        ]
    ], JSON_UNESCAPED_UNICODE);
}
?>
