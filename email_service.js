/*
 * EmailServerOne class represents an email service provider that simulates sending emails.
 */
class EmailServerOne {
  async sendEmail(to, subject, text) {
    console.log(`EmailServerOne: Sending email to ${to} with subject "${subject}" and text "${text}"`);

    if (Math.random() > 0.5) {
      throw new Error('EmailServerone: Failed to send email.');
    }
    console.log('EmailServerone: Email sent successfully.');
  }
}


/*
 * EmailServerTwo class represents another email service provider with same behavior.
 */
class EmailServerTwo {
  async sendEmail(to, subject, text) {
    console.log(`EmailServerTwo: Sending email to ${to} with subject "${subject}" and text "${text}"`);

    if (Math.random() > 0.5) {
      throw new Error('EmailServerTwo: Failed to send email.');
    }
    console.log('EmailServerTwo: Email sent successfully.');
  }
}

class ManageEmailService {
  constructor() {
    this.servers = [
      new EmailServerOne(),
      new EmailServerTwo()
    ];
    this.ServerIndex = 0;
    this.sentEmailIds = new Set();
    this.emailTimeStamps = [];
    this.attemptStatus = new Map();
    this.rateLimit = 5;
    this.timeFrame = 60000;

  }

  async sendEmail(to, subject, text) {
    const emailId = Date.now().toString();

    if (this.sentEmailIds.has(emailId)) {
      console.log(`Email with ID ${emailId} has already been sent. Skipping duplicate send."`);
      return;
    }

    if (!this.checkRateLimit()) {
      console.error('Rate limit exceed. please try again later.');
      return;
    }


    const maxAttempt = 3;
    let success = false;

    for (let attempt = 0; attempt < maxAttempt; attempt++) {
      try {
        await this.servers[this.ServerIndex].sendEmail(to, subject, text);
        success = true;
        this.sentEmailIds.add(emailId);
        this.emailTimeStamps.push(Date.now());
        this.attemptStatus.set(emailId, 'success');
        break;
      } catch (error) {
        console.error(`Mail server ${this.ServerIndex} failed on attempt ${attempt + 1}, retrying...`, error);
        this.ServerIndex = (this.ServerIndex + 1) % this.servers.length;
        await this.sleep(this.exponentialBackoff(attempt));
      }
    }
    
    if (!success) {
      console.error('All server failed');
      this.attemptStatus.set(emailId, 'failed');
    }
  }

  checkRateLimit() {
    const currentTime = Date.now();
    this.emailTimeStamps = this.emailTimeStamps.filter(timestamp => currentTime - timestamp < this.timeFrame);
    return this.emailTimeStamps.length < this.rateLimit;
  }

  exponentialBackoff(attempt) {
    const timeDelay = 1000;
    return timeDelay * Math.pow(2, attempt);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = ManageEmailService;