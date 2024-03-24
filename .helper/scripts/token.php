<?php

$sep = DIRECTORY_SEPARATOR;
$dir = substr(__DIR__, 0, strpos(__DIR__, $sep.'.helper'));

require_once $dir.'/.helper/vendor/autoload.php';

use Symfony\Component\Yaml\Yaml;

if (!is_file($config_file = $dir.'/.helper/config.local.yaml')) {
    $config_file = $dir.'/.helper/config.yaml';
}

$config = Yaml::parse(file_get_contents($config_file));

$env = $config['env'] ?? [];

if ((!$user = $env['username']) || (!$pass = $env['password'])) {
    throw new RuntimeException('Logins not found');
}

$url = 'https://api.rivolink.mg/api/auth';

$curl = curl_init();

curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

curl_setopt($curl, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
]);

curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode([
    'username' => $user,
    'password' => $pass,
]));

$resp = curl_exec($curl);
curl_close($curl);

if (!is_array($data = json_decode($resp, true))) {
    echo $resp.PHP_EOL;
}

if (!$token = $data['token'] ?? null) {
    echo $data['message'] ?? 'Authentication error';
    echo PHP_EOL;
}

$filepath = $dir.'/src/private/token.txt';

file_put_contents($filepath, $token.PHP_EOL);

echo 'Token saved: '.$filepath.PHP_EOL;
