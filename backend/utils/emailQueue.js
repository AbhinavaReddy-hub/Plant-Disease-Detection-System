const Queue = require('bull');
const nodemailer = require('nodemailer');

// Initialize the email queue
const emailQueue = new Queue('emailQueue', {
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
    },
});

// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Process the email queue
emailQueue.process(async (job) => {
    const { to, subject, text } = job.data;

    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (err) {
        console.error(`Failed to send email: ${err.message}`);
    }
});

// Function to add emails to the queue
const addToEmailQueue = (emailData) => {
    emailQueue.add(emailData, {
        attempts: 3, // Retry up to 3 times in case of failure
        backoff: 5000, // Wait 5 seconds between retries
    });
};

module.exports = { addToEmailQueue };
