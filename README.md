# resilient_email_backend_js
It is a resilient email sending service in JavaScript.It works with two email providers and complete the process in case of failures.

# key Features
1. Retry mechanism with exponential backoff - In case of process failure, it retries the steps again and notifies specific error related to it. Currently it checks the process 3 times.It tries to complete the process within the retry limit if it not work with first email server, it fallback to another email provider to complete the process.
2. Indempotency - To ensure elimination of diplicate sending, it uses unique identifier with EmailId.
3. Rate limiting - 
 
