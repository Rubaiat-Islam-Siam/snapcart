import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL,
        pass: process.env.PASS,
    },
});

export const sendMail = async (to: string, subject: string, html: string) => {
    const mailOptions = {
        from: "Snapcart <" + process.env.GMAIL + ">",
        to,
        subject,
        html,
    };
    
    await transporter.sendMail(mailOptions);
};
