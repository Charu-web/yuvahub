<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$dbPath = __DIR__ . '/data/db.json';
if (file_exists($dbPath)) {
    $data = json_decode(file_get_contents($dbPath), true);
    $jobCards = isset($data['jobCards']) ? $data['jobCards'] : [];
    $active = null;
    foreach ($jobCards as $jc) {
        if (!empty($jc['isActive'])) {
            $active = $jc;
            break;
        }
    }
    if (!$active && count($jobCards) > 0) $active = $jobCards[0];
    if (!$active) {
        $active = [
            'id' => 'jobcard-1',
            'title' => 'विशेष युवा रोजगार PVC जॉब कार्ड',
            'imageSrc' => '/pvc-job-card-official.png',
            'isActive' => true
        ];
    }
    echo json_encode(['success' => true, 'jobCard' => $active, 'jobCards' => $jobCards], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        'success' => true,
        'jobCard' => [
            'id' => 'jobcard-1',
            'title' => 'विशेष युवा रोजगार PVC जॉब कार्ड',
            'imageSrc' => '/pvc-job-card-official.png',
            'isActive' => true
        ]
    ], JSON_UNESCAPED_UNICODE);
}
?>
