import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = process.env;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { email, title, message } = req.body;
            const accessToken = await oAuth2Client.getAccessToken();

            const transport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    type: 'OAuth2',
                    user: 'nekodev67@gmail.com',
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken.token || '',
                },
            });

            const mailOptions = {
                from: `NEKODEV <nekodev67@gmail.com>`,
                to: 'alexislandolt67@gmail.com',
                subject: title,
                text: `Email: ${email}\n\nMessage: ${message}`,
                html: `<h1>Email from ${email}</h1><p>${message}</p>`,
            };

            const result = await transport.sendMail(mailOptions);
            console.log('Email sent...', result);
            res.status(200).json({ success: true, message: 'Email sent successfully' });
        } catch (error: any) {
            console.error('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}