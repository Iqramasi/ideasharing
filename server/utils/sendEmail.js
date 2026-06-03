const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {

    console.log('EMAIL FUNCTION CALLED');
    console.log('Sending email to:', to);

    const transporter = nodemailer.createTransport({

        host: 'smtp-relay.brevo.com',

        port: 587,

        secure: false,

        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,

        auth: {

            user: process.env.EMAIL_USER,

            pass: process.env.EMAIL_PASS

        }

    });

    try {

        console.log('Sending email directly...');

        const info = await transporter.sendMail({

            from: 'iqramasi121@gmail.com',

            to,

            subject,

            text

        });

        console.log('EMAIL SENT SUCCESSFULLY');
        console.log(info.response);

        return true;

    } catch (err) {

        console.error('BREVO EMAIL ERROR:');
        console.error(err);

        throw err;
    }
};

module.exports = sendEmail;