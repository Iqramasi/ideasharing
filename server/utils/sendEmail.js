const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {

    const transporter = nodemailer.createTransport({

        host: 'smtp-relay.brevo.com',

        port: 587,

        secure: false,

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

        console.log(
            'Email sent:',
            info.response
        );

        return true;

    } catch (err) {

        console.error(
            'BREVO EMAIL ERROR:',
            err
        );

        throw err;
    }
};

module.exports = sendEmail;