const nodemailer = require('nodemailer');
const SibApiV3Sdk = require('sib-api-v3-sdk');


const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key']
apiKey.apiKey = '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';

const handleRetryWithBackoff = async (func, args = [], retryCount = 3, timeDelay = 2000) => {
  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      const result = await func(...args);
      return {
        success: true,
        message: `Email sent successfully with ${func.mailerName}`,
        result: result
      };
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      timeDelay *= 2;
      await new Promise(resolve => setTimeout(resolve, timeDelay));
    }
  }
  throw new Error('All retries failed!!');
};

const emailMedium = nodemailer.createTransport({
  host: 'smtp.office365.com',
  post: 587,
  auth: {
    user: 'rohn21@outlook.com',
    pass: 'R0#an21OUTLOOK'
  }
});

const sendEmailNodemailer = async (to, subject, text) => {
  const mailOptions = {
    from: 'rohn21@outlook.com',
    to,
    subject,
    text
  };

  const sendMail = () => emailMedium.sendMail(mailOptions);
  sendMail.mailerName = 'NodeMailer';

  return handleRetryWithBackoff(sendMail, []);
};

const sendEmailSendinblue = async (to, subject, text) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail ({
    sender: { email: '7ae51d001@smtp-brevo.com' },
      to: [{ email: to }],
      subject : subject,
      textContent: text
  });

  const TrannsacEmail = () => apiInstance.SendTransacEmail(sendSmtpEmail);
  TrannsacEmail.mailerName = 'SendInBlue';
  
  return handleRetryWithBackoff(TrannsacEmail, []);
};

const sendEmail = async (to, subject, text) => {
  try {
    const result = await sendEmailNodemailer(to, subject, text);
    console.log(result.message)
  } catch (error) {
    console.error('Failed with Nodemailer, trying with Sendinblue...');
    try {
      const result = await sendEmailSendinblue(to, subject, text);
      console.log(result.message)
    } catch (error) {
      console.error('Sendinblue also failed:', error);
    }
  }
};

module.exports = { sendEmail };