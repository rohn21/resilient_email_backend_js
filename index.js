const ManageEmailService = require('./email_service');

const emailService = new ManageEmailService();

const recipients = [
  'rohn2100@gmail.com',
  'chauhanrohan2112@gmail.com',
  'rohn2100@gmail.com',
  'user@mail.com',
  'user1@mail.com',

];


/**
 * Sends test emails to recipients using ManageEmailService
 *  */
const main = async () => {
  const subject = 'Test Subject';
  const text = 'Testing the mail service using Javascript.';

  for (const num of recipients) {
    await emailService.sendEmail(num, subject, text);
  }
};

main();