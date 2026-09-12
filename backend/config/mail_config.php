<?php
/**
 * ==============================================================================
 * KY EDU - Real Gmail (SMTP) & Mobile Phone Delivery Configuration
 * ==============================================================================
 * 
 * Aapke Mobile Phone & Gmail Inbox me Real OTP aane ke liye ye 3 steps karein:
 * 
 * Step 1: Apne phone ya computer me https://myaccount.google.com open karein.
 * Step 2: "Security" tab me jayein -> "2-Step Verification" ON karein -> niche "App Passwords" pe click karein.
 * Step 3: App name me "KY EDU" likhein aur 16-akshar (letters) ka Google App Password generate karein.
 * Step 4: Niche 'username' me apna Gmail aur 'password' me wo 16-character ka code paste karein!
 * 
 * Note: Google regular Gmail password allow nahi karta, isliye 16-letter App Password zaroori hota hai.
 * ==============================================================================
 */

return [
    // Real Email Delivery Settings (Official Gmail SMTP STARTTLS 587)
    'mail' => [
        'enabled' => true,
        'driver' => 'smtp',
        'host' => getenv('SMTP_HOST') ?: 'smtp.gmail.com',
        'port' => (int)(getenv('SMTP_PORT') ?: 587),
        'encryption' => getenv('SMTP_ENCRYPTION') ?: 'tls', // 'tls' (587) or 'ssl' (465)
        
        // -------------------------------------------------------------
        // 1. APNA GMAIL ID YAHAAN ENTER KAREIN:
        // -------------------------------------------------------------
        'username' => getenv('SMTP_USER') ?: '', // e.g. 'apnamail@gmail.com'
        
        // -------------------------------------------------------------
        // 2. APNA 16-CHARACTER GOOGLE APP PASSWORD YAHAAN ENTER KAREIN:
        // (Google App Password 16 letters ka hota hai, jaise: abcd efgh ijkl mnop)
        // -------------------------------------------------------------
        'password' => getenv('SMTP_PASS') ?: '', 
        
        'from_email' => getenv('SMTP_FROM_EMAIL') ?: 'no-reply@kyedu.in',
        'from_name' => 'KY EDU Student Portal'
    ],

    // Mobile Phone SMS Gateway Settings
    'sms' => [
        'enabled' => false,
        'provider' => getenv('SMS_PROVIDER') ?: 'fast2sms', // 'fast2sms' or 'twilio'
        'api_key' => getenv('SMS_API_KEY') ?: '',
        'sender_id' => 'KYEDUP'
    ]
];
