const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {

    console.log('EMAIL FUNCTION CALLED');
    console.log('Sending email to:', to);

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

        console.log('Verifying SMTP connection...');

        await transporter.verify();

        console.log('SMTP VERIFIED');

        const info = await transporter.sendMail({

            // IMPORTANT CHANGE HERE
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