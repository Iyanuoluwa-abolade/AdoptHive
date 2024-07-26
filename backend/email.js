import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer'

const HOST = process.env.SMTP_HOST;
const PORT = process.env.SMTP_PORT;
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.SMTP_EMAIL_FROM;

export const sendEmail = async (to, subject, message) => {
    try {
        let transporter = nodemailer.createTransport({
            host: HOST,
            port: PORT,
            secure: false,
            auth: {
                user: USER,
                pass: PASS,
            },
            tls: {
                ciphers: "SSLv3",
            }
        });

        let info = await transporter.sendMail({
            from: EMAIL_FROM,
            to: to,
            subject: subject,
            html: `<p>You have a new match. Please <a href="http://localhost:5173/signin">sign in</a> to view it.</p>`,
        });
    } catch (error) {
        return ({error: "Error sending email"})
    }
}
