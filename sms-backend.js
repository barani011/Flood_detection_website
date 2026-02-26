/*
 * sms-backend.js - DEPRECATED
 *
 * This file previously implemented a local SMS backend using Twilio.
 * The project has switched to submitting alerts via Web3Forms (email).
 * The frontend now posts directly to Web3Forms; this server is no longer used.
 *
 * If you still want a local SMS relay, restore an implementation here.
 */

// sms-backend.js - REMOVED
// The SMS backend and Twilio integration have been removed from this repository
// per project request. This file is intentionally left as a placeholder to
// indicate removal of SMS functionality.

console.log('sms-backend.js has been removed. SMS functionality disabled.');

// NOTE: If you need a server-side relay in future, re-add the implementation
// here and restore any removed dependencies (e.g., twilio, express).

module.exports = {};

/*
app.post('/api/send-sms', async (req, res) => {
    try {
        const { to, message, location, floodLevel, timestamp } = req.body;

        // Validate input
        if (!to || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: to, message'
            });
        }

        // Validate phone number format (accepts +91XXXXXXXXXX or +91 XXXXXXXXXX)
        const phoneRegex = /^\+91\s?\d{10}$/;
        const cleanedPhone = to.replace(/\s/g, ''); // Remove spaces for sending
        
        if (!phoneRegex.test(to)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format. Use: +91XXXXXXXXXX or +91 XXXXXXXXXX'
            });
        }

        // Log the SMS being sent
        console.log('\n' + '='.repeat(60));
        console.log('📱 SMS ALERT RECEIVED');
        console.log('='.repeat(60));
        console.log('To Number:   ', to);
        console.log('Location:    ', location);
        console.log('Flood Level: ', floodLevel);
        console.log('Timestamp:   ', timestamp);
        console.log('Message:');
        console.log('─'.repeat(60));
        console.log(message);
        console.log('─'.repeat(60));

        let smsResult;
        let messageId;

        if (MOCK_MODE) {
            // Mock SMS - simulates sending
            messageId = 'MOCK_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            smsResult = {
                sid: messageId,
                status: 'sent',
                to: to
            };

            // Store in mock log
            MOCK_SMS_LOG.push({
                messageId: messageId,
                to: to,
                location: location,
                floodLevel: floodLevel,
                message: message,
                sentAt: new Date().toISOString(),
                status: 'sent'
            });

            console.log('✅ MOCK SMS SENT (TEST MODE)');
            console.log('Message ID:  ', messageId);
            console.log('Status:      ', 'sent');
        } else {
            // Real Twilio SMS
            smsResult = await twilioClient.messages.create({
                body: message,
                from: TWILIO_PHONE_NUMBER,
                to: cleanedPhone  // Use cleaned phone number without spaces
            });
            messageId = smsResult.sid;
            console.log('✅ SMS SENT VIA TWILIO');
            console.log('Message ID:  ', messageId);
        }

        console.log('='.repeat(60) + '\n');

        // Success response
        res.status(200).json({
            success: true,
            message: MOCK_MODE ? 'SMS sent successfully (MOCK MODE)' : 'SMS sent successfully',
            messageId: messageId,
            to: to,
            location: location,
            floodLevel: floodLevel,
            sentAt: new Date().toISOString(),
            mode: MOCK_MODE ? 'MOCK' : 'TWILIO'
        });

    } catch (error) {
        console.error('❌ SMS Error:', error.message);

        // Error response
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to send SMS',
            error: error.code
        });
    }
});

// ============ HEALTH CHECK ENDPOINT ============
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'SMS Service is running',
        mode: MOCK_MODE ? 'MOCK (Test Mode)' : 'TWILIO (Production)',
        timestamp: new Date().toISOString()
    });
});

// ============ GET SMS LOGS ============
app.get('/api/sms-logs', (req, res) => {
    try {
        if (MOCK_MODE) {
            // Return mock logs
            res.status(200).json({
                success: true,
                mode: 'MOCK',
                totalMessages: MOCK_SMS_LOG.length,
                messages: MOCK_SMS_LOG
            });
        } else {
            // Return real Twilio logs
            res.status(200).json({
                success: true,
                mode: 'TWILIO',
                message: 'Connect to Twilio dashboard to view logs'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch SMS logs',
            error: error.message
        });
    }
});

// ============ START SERVER ============
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 SMS BACKEND SERVICE STARTED');
    console.log('='.repeat(60));
    console.log(`Server:      http://localhost:${PORT}`);
    console.log(`Health:      http://localhost:${PORT}/health`);
    console.log(`SMS Logs:    http://localhost:${PORT}/api/sms-logs`);
    console.log(`Mode:        ${MOCK_MODE ? '🧪 MOCK (Test Mode)' : '📱 TWILIO (Production)'}`);
    console.log('='.repeat(60));
    console.log('📝 Ready to receive SMS alerts!');
    console.log('='.repeat(60) + '\n');
});

// ============ ALTERNATIVE: USING OTHER SMS SERVICES ============
/*
 * 
 * OPTION 1: AWS SNS (Simple Notification Service)
 * ---
 * npm install aws-sdk
 * 
 * const AWS = require('aws-sdk');
 * const sns = new AWS.SNS();
 * 
 * app.post('/api/send-sms', async (req, res) => {
 *     const params = {
 *         Message: req.body.message,
 *         PhoneNumber: req.body.to
 *     };
 *     
 *     try {
 *         const result = await sns.publish(params).promise();
 *         res.json({ success: true, messageId: result.MessageId });
 *     } catch (error) {
 *         res.status(500).json({ success: false, error: error.message });
 *     }
 * });
 * 
 * 
 * OPTION 2: Firebase Cloud Messaging
 * ---
 * npm install firebase-admin
 * 
 * const admin = require('firebase-admin');
 * const serviceAccount = require('./firebase-key.json');
 * 
 * admin.initializeApp({
 *     credential: admin.credential.cert(serviceAccount)
 * });
 * 
 * app.post('/api/send-sms', async (req, res) => {
 *     try {
 *         const message = {
 *             notification: {
 *                 title: 'Flood Alert',
 *                 body: req.body.message
 *             },
 *             topic: 'flood-alerts'
 *         };
 *         
 *         const response = await admin.messaging().send(message);
 *         res.json({ success: true, messageId: response });
 *     } catch (error) {
 *         res.status(500).json({ success: false, error: error.message });
 *     }
 * });
 * 
 * 
 * OPTION 3: Vonage/Nexmo
 * ---
 * npm install @vonage/server-sdk
 * 
 * const { Vonage } = require('@vonage/server-sdk');
 * const vonage = new Vonage({
 *     apiKey: 'YOUR_API_KEY',
 *     apiSecret: 'YOUR_API_SECRET'
 * });
 * 
 * app.post('/api/send-sms', async (req, res) => {
 *     const result = await vonage.sms.send({
 *         to: req.body.to,
 *         from: 'SENDER_ID',
 *         text: req.body.message
 *     });
 *     
 *     res.json(result);
 * });
 */
