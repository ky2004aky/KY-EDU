<?php
namespace App\Config;

use Exception;

class Mailer {
    private static function getConfig(): array {
        $configFile = __DIR__ . '/mail_config.php';
        if (file_exists($configFile)) {
            $cfg = require $configFile;
            return $cfg['mail'] ?? [];
        }
        return [
            'host' => 'smtp.gmail.com',
            'port' => 587,
            'encryption' => 'tls',
            'username' => getenv('SMTP_USER') ?: '',
            'password' => getenv('SMTP_PASS') ?: '',
            'from_email' => getenv('SMTP_FROM_EMAIL') ?: 'no-reply@kyedu.in',
            'from_name' => 'KY EDU Portal'
        ];
    }

    /**
     * Send real OTP email to Gmail or any email address
     */
    public static function sendOtp(string $toEmail, string $otp, string $purpose = 'login'): array {
        $toEmail = trim($toEmail);
        if (!filter_var($toEmail, FILTER_VALIDATE_EMAIL)) {
            return [
                'sent' => false,
                'reason' => 'INVALID_EMAIL',
                'message' => "Invalid email address format: {$toEmail}"
            ];
        }

        $config = self::getConfig();
        $username = trim($config['username'] ?? '');
        $password = trim(str_replace(' ', '', $config['password'] ?? '')); // remove spaces in app password

        $purposeLabel = match ($purpose) {
            'forgot_password' => 'Password Reset Verification',
            'register' => 'Student Account Verification',
            default => 'Student Portal Login'
        };

        $subject = "Your KY EDU Verification Code: {$otp} ({$purposeLabel})";
        $htmlBody = self::buildOtpEmailTemplate($otp, $purposeLabel, $toEmail);

        // Check if real SMTP credentials are provided
        if (empty($username) || empty($password)) {
            return [
                'sent' => false,
                'reason' => 'CREDENTIALS_NEEDED',
                'message' => 'To receive real emails in Gmail, set your Gmail address & Google App Password in backend/config/mail_config.php.'
            ];
        }

        // Attempt Real SMTP Delivery
        try {
            self::sendViaSmtp($toEmail, $subject, $htmlBody, $config);
            return [
                'sent' => true,
                'message' => "Real OTP email dispatched to {$toEmail} via Gmail SMTP! Check your inbox / spam folder."
            ];
        } catch (Exception $e) {
            // Fallback to PHP mail() if available
            $headers = "MIME-Version: 1.0\r\n";
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
            $headers .= "From: {$config['from_name']} <{$config['from_email']}>\r\n";
            $headers .= "Reply-To: {$config['from_email']}\r\n";

            if (@mail($toEmail, $subject, $htmlBody, $headers)) {
                return [
                    'sent' => true,
                    'message' => "Real OTP email sent to {$toEmail} via PHP mail service."
                ];
            }

            return [
                'sent' => false,
                'reason' => 'SMTP_ERROR',
                'message' => "SMTP Delivery Error: " . $e->getMessage()
            ];
        }
    }

    /**
     * Native Socket-based SMTP Client (RFC 5321 with TLS)
     */
    private static function sendViaSmtp(string $to, string $subject, string $htmlContent, array $config): bool {
        $host = $config['host'] ?: 'smtp.gmail.com';
        $port = (int)($config['port'] ?: 587);
        $username = $config['username'];
        $password = str_replace(' ', '', $config['password']);
        $fromEmail = !empty($config['from_email']) ? $config['from_email'] : $username;
        $fromName = $config['from_name'] ?: 'KY EDU Portal';

        $timeout = 10;
        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ]);

        $socket = @stream_socket_client("tcp://{$host}:{$port}", $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $context);
        if (!$socket) {
            throw new Exception("Cannot connect to SMTP server {$host}:{$port} ($errstr)");
        }

        stream_set_timeout($socket, $timeout);

        $read = function() use ($socket) {
            $data = '';
            while ($str = fgets($socket, 515)) {
                $data .= $str;
                if (substr($str, 3, 1) === ' ') break;
            }
            return $data;
        };

        $write = function(string $cmd) use ($socket, $read) {
            fputs($socket, $cmd . "\r\n");
            return $read();
        };

        $init = $read();
        if (!str_starts_with($init, '220')) {
            fclose($socket);
            throw new Exception("Unexpected SMTP initial response: {$init}");
        }

        // EHLO
        $ehlo = $write("EHLO " . gethostname());

        // STARTTLS if on port 587
        if ($port == 587) {
            $tlsRes = $write("STARTTLS");
            if (!str_starts_with($tlsRes, '220')) {
                fclose($socket);
                throw new Exception("STARTTLS failed: {$tlsRes}");
            }

            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                fclose($socket);
                throw new Exception("Encryption negotiation with SMTP failed.");
            }

            // Repeat EHLO after TLS established
            $write("EHLO " . gethostname());
        }

        // AUTH LOGIN
        $authRes = $write("AUTH LOGIN");
        if (!str_starts_with($authRes, '334')) {
            fclose($socket);
            throw new Exception("AUTH LOGIN rejected: {$authRes}");
        }

        // Send base64 username
        $userRes = $write(base64_encode($username));
        if (!str_starts_with($userRes, '334')) {
            fclose($socket);
            throw new Exception("Username rejected: {$userRes}");
        }

        // Send base64 password
        $passRes = $write(base64_encode($password));
        if (!str_starts_with($passRes, '235')) {
            fclose($socket);
            throw new Exception("Authentication failed. Please verify your Gmail address and 16-character Google App Password. (Response: {$passRes})");
        }

        // MAIL FROM
        $mailFrom = $write("MAIL FROM:<{$fromEmail}>");
        if (!str_starts_with($mailFrom, '250')) {
            fclose($socket);
            throw new Exception("MAIL FROM rejected: {$mailFrom}");
        }

        // RCPT TO
        $rcptTo = $write("RCPT TO:<{$to}>");
        if (!str_starts_with($rcptTo, '250')) {
            fclose($socket);
            throw new Exception("Recipient {$to} rejected: {$rcptTo}");
        }

        // DATA
        $dataPrompt = $write("DATA");
        if (!str_starts_with($dataPrompt, '354')) {
            fclose($socket);
            throw new Exception("DATA rejected: {$dataPrompt}");
        }

        // Headers & Content
        $headers = [];
        $headers[] = "Date: " . date('r');
        $headers[] = "To: <{$to}>";
        $headers[] = "From: {$fromName} <{$fromEmail}>";
        $headers[] = "Subject: {$subject}";
        $headers[] = "MIME-Version: 1.0";
        $headers[] = "Content-Type: text/html; charset=UTF-8";
        $headers[] = "X-Mailer: KY_EDU_Mailer_2.0";

        $message = implode("\r\n", $headers) . "\r\n\r\n" . $htmlContent . "\r\n.";
        $dataResult = $write($message);

        // QUIT
        $write("QUIT");
        fclose($socket);

        if (!str_starts_with($dataResult, '250')) {
            throw new Exception("Message delivery error: {$dataResult}");
        }

        return true;
    }

    /**
     * Clean, modern Apple-style HTML Email Template
     */
    private static function buildOtpEmailTemplate(string $otp, string $purpose, string $recipient): string {
        $year = date('Y');
        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KY EDU Verification Code</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f9; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#1d1d1f;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding: 30px 15px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width: 520px; background:#ffffff; border-radius:24px; box-shadow:0 12px 35px -5px rgba(0,0,0,0.08); overflow:hidden; border:1px solid #e2e8f0;">
                    <!-- Brand Banner -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2874f0 0%, #1d4ed8 100%); padding: 30px 35px; text-align: center;">
                            <span style="font-size: 28px; font-weight: 900; color: #ffffff; letter-spacing: 1px; font-style: italic;">
                                KY <span style="color: #ffe500;">EDU</span>
                            </span>
                            <div style="font-size: 12px; color: rgba(255,255,255,0.85); margin-top: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                Indian Education & Sarkari Examination Portal
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Content Area -->
                    <tr>
                        <td style="padding: 35px 35px 25px 35px; text-align: center;">
                            <div style="display: inline-block; padding: 6px 16px; background-color: #eff6ff; border-radius: 9999px; color: #2874f0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">
                                {$purpose}
                            </div>
                            
                            <h1 style="font-size: 22px; font-weight: 800; margin: 0 0 10px 0; color: #0f172a;">
                                Verification Code
                            </h1>
                            
                            <p style="font-size: 13px; line-height: 1.6; color: #64748b; margin: 0 0 25px 0;">
                                Please use the following 6-digit One-Time Password (OTP) to complete your verification for <strong style="color:#0f172a;">{$recipient}</strong>.
                            </p>
                            
                            <!-- OTP Highlight Box -->
                            <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 18px; padding: 20px; margin: 0 auto 25px auto; max-width: 320px;">
                                <div style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #2874f0; text-indent: 10px;">
                                    {$otp}
                                </div>
                                <div style="font-size: 11px; color: #94a3b8; font-weight: 600; margin-top: 6px;">
                                    ⏱ Valid for 10 minutes
                                </div>
                            </div>
                            
                            <!-- Advisory Note -->
                            <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 14px; padding: 12px 16px; text-align: left; font-size: 11.5px; color: #92400e; line-height: 1.5;">
                                <strong>⚠️ Security Reminder:</strong> Never share this verification OTP with anyone. KY EDU officials will never ask for your password or verification codes.
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 35px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; font-size: 11px; color: #94a3b8;">
                            If you did not request this OTP code, you can safely ignore this email.<br>
                            &copy; {$year} KY EDU Portal. Built for Indian Aspirants & Students.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;
    }
}
