<?php
// contact.php — return JSON
header('Content-Type: application/json');

function fail($msg, $code = 400) {
  http_response_code($code);
  echo json_encode(['ok' => false, 'error' => $msg]);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  fail('Method not allowed', 405);
}

// ---- CONFIG ----
$TO_EMAIL   = 'chanirujayawardhana@gmail.com';  // where to receive the form
$FROM_EMAIL = 'no-reply@yourdomain.com';        // optional override for From
$RECAPTCHA_SECRET = 'YOUR_RECAPTCHA_SECRET';    // from Google reCAPTCHA admin
// ---------------

// Honeypot (must match the hidden input name below)
$honeypot = isset($_POST['company']) ? trim($_POST['company']) : '';
if (!empty($honeypot)) {
  echo json_encode(['ok' => true]); // silently accept bots
  exit;
}

// Sanitize/validate
$name    = isset($_POST['name'])    ? trim($_POST['name'])    : '';
$email   = isset($_POST['email'])   ? trim($_POST['email'])   : '';
$phone   = isset($_POST['phone'])   ? trim($_POST['phone'])   : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if ($name === '' || $email === '' || $message === '') fail('Missing required fields.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail('Invalid email address.');
if (strlen($message) > 5000) fail('Message too long.');

// reCAPTCHA v2 verification
$recaptcha_response = isset($_POST['g-recaptcha-response']) ? $_POST['g-recaptcha-response'] : '';
if ($RECAPTCHA_SECRET && $recaptcha_response) {
  $verify = curl_init();
  curl_setopt_array($verify, [
    CURLOPT_URL => 'https://www.google.com/recaptcha/api/siteverify',
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query([
      'secret' => $RECAPTCHA_SECRET,
      'response' => $recaptcha_response,
      'remoteip' => $_SERVER['REMOTE_ADDR'] ?? null
    ]),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10
  ]);
  $response = curl_exec($verify);
  $httpcode = curl_getinfo($verify, CURLINFO_HTTP_CODE);
  curl_close($verify);

  if ($httpcode !== 200 || !$response) fail('reCAPTCHA verification failed.', 400);
  $rc = json_decode($response, true);
  if (empty($rc['success'])) fail('reCAPTCHA failed.');
}

// Build the email
$subject = 'Website Contact Message';
$body  = "New message from your website:\n\n";
$body .= "Name:   {$name}\n";
$body .= "Email:  {$email}\n";
$body .= "Phone:  {$phone}\n\n";
$body .= "Message:\n{$message}\n";
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/plain; charset=utf-8';
$headers[] = 'From: ' . ($FROM_EMAIL ?: $TO_EMAIL);
$headers[] = 'Reply-To: ' . $email;

// ---- Option A: PHP mail() (works on many shared hosts) ----
$ok = @mail($TO_EMAIL, $subject, $body, implode("\r\n", $headers));
if (!$ok) fail('Mail server error.', 500);

// ---- Option B: SMTP via PHPMailer (uncomment to use) ----
// require __DIR__.'/vendor/autoload.php';
// $mail = new PHPMailer\PHPMailer\PHPMailer(true);
// try {
//   $mail->isSMTP();
//   $mail->Host = 'smtp.yourhost.com';
//   $mail->SMTPAuth = true;
//   $mail->Username = 'SMTP_USER';
//   $mail->Password = 'SMTP_PASS';
//   $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
//   $mail->Port = 587;
//
//   $mail->setFrom($FROM_EMAIL ?: $TO_EMAIL, 'Portfolio Site');
//   $mail->addAddress($TO_EMAIL);
//   $mail->addReplyTo($email, $name);
//
//   $mail->Subject = $subject;
//   $mail->Body    = $body;
//   $mail->AltBody = $body;
//
//   $mail->send();
// } catch (Exception $e) {
//   fail('SMTP error: ' . $mail->ErrorInfo, 500);
// }

echo json_encode(['ok' => true]);
