<?php

$sep = DIRECTORY_SEPARATOR;
$dir = substr(__DIR__, 0, strpos(__DIR__, $sep.'.helper'));

require_once $dir.'/.helper/vendor/autoload.php';

use Symfony\Component\Yaml\Yaml;

if (!is_file($config_file = $dir.'/.helper/config.local.yaml')) {
    $config_file = $dir.'/.helper/config.yaml';
}

$config_contents = file_get_contents($config_file);
$config_backup = Yaml::parse($config_contents);

$variables = [
    '$project_dir' => $dir,
];

$config_contents = str_replace(
    array_keys($variables),
    array_values($variables),
    $config_contents
);

$config = Yaml::parse($config_contents);

if (!$template_path = $config['template']['path'] ?? null) {
    throw new RuntimeException('Template path not found');
} elseif (!is_file($template_path)) {
    throw new RuntimeException('Template file not found');
}

$template = file_get_contents($template_path);

foreach ($config['env'] ?? [] as $key => $value) {
    $key = sprintf('{{%s}}', $key);
    $template = str_replace($key, $value, $template);
}

$preprocess = [
    '@base64:' => 'base64_encode',
];

function identity_function($x) {
    return $x;
}

foreach ($config['embeded'] ?? [] as $key => $path) {
    $key = sprintf('{{%s}}', $key);
    $func = 'identity_function';

    foreach ($preprocess as $prefix => $function) {
        if (strpos($path, $prefix) === 0) {
            $func = $function;
            $path = substr($path, strlen($prefix));
            break;
        }
    }

    if (!is_file($path)) {
        $template = str_replace($key, '', $template);
    } else {
        $contents = call_user_func($func, file_get_contents($path));
        $template = str_replace($key, trim($contents), $template);
    }
}

$minified = Minify_HTML::minify($template, [
    'jsMinifier' => ['JSMin\\JSMin', 'minify'],
    'cssMinifier' => ['Minify_CSSmin', 'minify'],
]);

$outdir = $config['output']['dir'] ?? $dir;
$version = $config['version']['code'] ?? '1.0.0';

$output = sprintf(
    "<!-- OpenCC - v%s | @RivoLink -->\n%s\n",
    $version,
    $minified
);

if (!is_dir($outdir)) {
    $outdir = $dir;
}

foreach (glob($outdir.'/*') as $file) {
    if (is_file($file)) {
        unlink($file);
    }
}

$filepath = sprintf('%s/opencc-%s.php', $outdir, $version);

if ($builded = file_put_contents($filepath, $output)) {
    echo 'Build success: '.$filepath.PHP_EOL;
} else {
    echo 'Build error'.PHP_EOL;
}

if (!$config['version']['auto_update'] ?? false) {
    return;
}

list($major, $minor, $patch) = explode('.', $version);
$next_version = sprintf('%d.%d.%d', $major, $minor, $patch + 1);

$config_backup['version']['code'] = $next_version;

$version_updated = file_put_contents(
    $config_file,
    Yaml::dump($config_backup)
);

if ($version_updated) {
    echo 'Next version: '.$next_version.PHP_EOL;
} else {
    echo 'Next version: an error occured'.PHP_EOL;
}
