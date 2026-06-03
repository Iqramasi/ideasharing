const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {

    const transporter = nodemailer.createTransport({

        service: 'gmail',

        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }

    });

    try {

        const info = await transporter.sendMail({

            from: process.env.EMAIL_USER,
            to,
            subject,
            text

        });

        console.log('Email sent:', info.response);

        return true;

    } catch (err) {

        console.error('EMAIL FAILED:', err);

        throw err;
    }
};

module.exports = sendEmail;