<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$dbPath = __DIR__ . '/data/db.json';
if (file_exists($dbPath)) {
    $data = json_decode(file_get_contents($dbPath), true);
    $sliders = isset($data['sliders']) ? $data['sliders'] : [];
    $active = null;
    foreach ($sliders as $s) {
        if (!empty($s['isActive'])) {
            $active = $s;
            break;
        }
    }
    if (!$active && count($sliders) > 0) $active = $sliders[0];
    if (!$active) {
        $active = [
            'id' => 'slider-1',
            'title' => 'खासदार नोकरी महोत्सव २०२६ अधिकृत बॅनर',
            'imageSrc' => '/Slider.jpg',
            'isActive' => true
        ];
    }
    echo json_encode(['success' => true, 'slider' => $active, 'sliders' => $sliders], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        'success' => true,
        'slider' => [
            'id' => 'slider-1',
            'title' => 'खासदार नोकरी महोत्सव २०२६ अधिकृत बॅनर',
            'imageSrc' => '/Slider.jpg',
            'isActive' => true
        ]
    ], JSON_UNESCAPED_UNICODE);
}
?>
