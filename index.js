const ManageEmailService = require('./email_service');

const emailService = new ManageEmailService();

const recipients = [
  'user1@gmail.com',
  'user2@gmail.com',
  'user3@gmail.com',
  'user4@mail.com',
  'user5@mail.com',
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