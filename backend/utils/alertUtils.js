const Diagnosis = require('../models/Diagnosis');
const nodemailer = require('nodemailer');

const checkAndAlert = async (disease, location) => {
    const count = await Diagnosis.countDocuments({ disease, location });
    if (count >= 20) {
        sendAlert(location, disease);
    }
};

const sendAlert = async (location, disease) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.ALERT_EMAILS.split(','),
        subject: `Disease Alert: ${disease} in ${location}`,
        text: `High cases of ${disease} detected in ${location}. Please take precautionary measures.`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Alert email sent: ' + info.response);
        }
    });
};

module.exports = { checkAndAlert };
