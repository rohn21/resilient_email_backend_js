const { sendEmail } = require('./email_backend');

const main = async () => {
    await sendEmail('rohn2100@gmail.com', 'Test Subject', 'Testing the mail service using Javascript with Node mailer');
};

main();