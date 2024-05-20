import nodemailer from 'nodemailer';

// // Using Ethereal Faker for testing
// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'jacques.stanton@ethereal.email',
//         pass: 'KecJpU4AXSUcysaVnF'
//     }
// });

// 
// export const sendEmail = async (to, subject, html) => {
//     const mailOptions = {
//         from: '"Jacques Stanton" <jacques.stanton@ethereal.email>', // sender address
//         to, 
//         subject, 
//         html 
//     };

//     try {
//         const info = await transporter.sendMail(mailOptions);
//         console.log('Message sent: %s', info.messageId);
//         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//     } catch (error) {
//         console.error('Failed to send email', error);
//     }
// };

//----------------------------------------SENDGRID-----------------------
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Exportable async function to send an email
export const sendEmail = async (to, subject, html) => {
    const msg = {
        to, 
        from: { 
            name: process.env.NAME,
            email: process.env.EMAIL
        },     
        subject, 
        html, 
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent');
    } catch (error) {
        console.error('Failed to send email', error);
    }
};