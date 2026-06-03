const axios = require('axios');

const sendEmail = async (to, subject, text) => {

    try {

        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: {
                    name: 'Idea Sharing',
                    email: 'iqramasi121@gmail.com'
                },
                to: [
                    {
                        email: to
                    }
                ],
                subject,
                textContent: text
            },
            {
                headers: {
                    'api-key': process.env.BREVO_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('EMAIL SENT');
        console.log(response.data);

        return true;

    } catch (err) {

    console.error('========== BREVO ERROR ==========');

    console.error('STATUS:',
        err.response?.status);

    console.error('DATA:',
        err.response?.data);

    console.error('MESSAGE:',
        err.message);

    console.error('===============================');

    throw new Error(
        JSON.stringify(
            err.response?.data || err.message
        )
    );
}
};

module.exports = sendEmail;