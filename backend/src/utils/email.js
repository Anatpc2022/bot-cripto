import mailer from "nodemailer";

const SMTP_SERVER = process.env.SMTP_SERVER;
const SMTP_PORT = parseInt(process.env.SMTP_PORT);
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PWD = process.env.SMTP_PWD;

export default function sendEmail(message, to, subject) {
  if (!SMTP_SERVER || !SMTP_PORT || !SMTP_USER || !SMTP_PWD)
    throw new Error("Todas as configurações SMTP são necessárias.");

  const smtpTransport = mailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PWD,
    },
  });

  const mail = {
    from: SMTP_USER,
    to,
    subject,
    text: message,
  };

  return new Promise((resolve, reject) => {
    smtpTransport
      .sendMail(mail)
      .then((response) => {
        smtpTransport.close();
        return resolve(response);
      })
      .catch((err) => {
        smtpTransport.close();
        return reject(err);
      });
  });
}
