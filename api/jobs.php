<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$dbPath = __DIR__ . '/data/db.json';
if (file_exists($dbPath)) {
    $data = json_decode(file_get_contents($dbPath), true);
    $jobs = isset($data['jobs']) ? array_values(array_filter($data['jobs'], function($j) {
        return !isset($j['isPublished']) || $j['isPublished'] !== false;
    })) : [];
    echo json_encode(['success' => true, 'jobs' => $jobs], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([
        'success' => true,
        'jobs' => [
            [
                'id' => 'job-101',
                'title' => 'Graduate Trainee Engineer (GTE)',
                'marathiTitle' => 'ग्रॅज्युएट ट्रेनी इंजिनिअर',
                'company' => 'Tata Motors Pune',
                'logo' => '/Companylogo/tatamotorlogo.png',
                'sector' => 'Engineering & Manufacturing',
                'qualification' => 'BE / B.Tech (Mechanical / Auto / Production / Electrical)',
                'salary' => '₹22,500 - ₹32,000 / महिना',
                'location' => 'Pune / Chinchwad',
                'vacancies' => '45 पदे',
                'description' => 'Tata Motors मध्ये ट्रेनी इंजिनिअर पदासाठी निवड.'
            ],
            [
                'id' => 'job-102',
                'title' => 'Production / Assembly Associate',
                'marathiTitle' => 'प्रोडक्शन असेंब्ली असिस्टंट',
                'company' => 'Bajaj Auto Ltd',
                'logo' => '/Companylogo/bajajlogo.jpg',
                'sector' => 'Automobile',
                'qualification' => '10th, 12th, ITI (Fitter, Turner, Welder, Machinist)',
                'salary' => '₹18,500 - ₹24,000 / महिना',
                'location' => 'Akurdi / Chakan',
                'vacancies' => '60 पदे',
                'description' => 'ऑटोमोबाईल असेंब्ली लाईन भरती.'
            ]
        ]
    ], JSON_UNESCAPED_UNICODE);
}
?>
