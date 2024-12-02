const Queue = require('bull');
const emailQueue = new Queue('emailQueue', { redis: { host: '127.0.0.1', port: 6379 } });
const { transporter } = require('./nodemailerConfig');

exports.queueEmails = (users, diseaseName, location, count) => {
  users.forEach(user => {
    emailQueue.add({
      to: user.email,
      subject: `Alert: ${diseaseName} Exceeds Threshold in ${location}`,
      text: `Dear ${user.username},\n\nThere are now ${count} cases of ${diseaseName} in ${location}, exceeding the threshold of ${count}.\n\nStay alert and take necessary precautions.\n\nBest regards,\nVriksha Raksha Team`
    });
  });
};

emailQueue.process(async (job) => {
  const { to, subject, text } = job.data;
  try {
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
    console.log(`Emails sent :)`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw error;
  }
});
