import { render } from '@react-email/render';
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import OtpEmail from '../emails/OtpEmail';
import React from 'react'

dotenv.config();

interface SendEmailOptions{
    to: string;
    subject: string;
    otp: string;
};

interface WelcomeEmailOptions{
    to: string;
    subject: string;
    name: string;
};

interface DeletionWarningEmailOptions {
    to: string;
    subject: string;
    name: string;
    deletionDate: string;
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_HOST,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendOtpEmail({to, subject, otp}:SendEmailOptions) {
    const emailHtml = await render(<OtpEmail otp={otp} />)
    await transporter.sendMail({
        from: `"Futurify" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html:emailHtml,
    });
}