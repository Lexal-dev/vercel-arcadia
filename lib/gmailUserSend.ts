import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = process.env;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function sendWelcomeEmail(email: string, username: string) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                type: 'OAuth2',
                user: 'votre_email@gmail.com', // Votre adresse e-mail Gmail
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken.token || '',
            },
        });

        const mailOptions = {
            from: 'votre_email@gmail.com',
            to: email, // L'adresse e-mail de l'utilisateur créé
            subject: 'Bienvenue sur notre plateforme',
            text: `Bonjour ${username},\n\nBienvenue sur notre plateforme. Votre compte a été créé avec succès.`,
            html: `<h1>Bienvenue ${username}!</h1><p>Votre compte a été créé avec succès.</p>`,
        };

        const result = await transport.sendMail(mailOptions);
        console.log('Email sent:', result);

        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}