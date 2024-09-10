require('dotenv').config();

const nodemailer = require('nodemailer');

exports.getContact = async (req, res) => {
    try {
        res.render('contact', { 
            csrfToken: req.csrfToken()
        });
    } catch (error) {
        console.error("Error fetching contact:", error);
    }
};

exports.sendEmail = async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                // Gmail 주소 입력
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS
            }
        })

        const { name, email, subject, message } = req.body.params[0];

        let info = await transporter.sendMail({
            from: email, 
            to: process.env.NODEMAILER_USER, 
            subject:  `${name} 님이 보낸 메시지 (jungsuyun.life)`, 
            text: `이름: ${name}\n 이메일 주소: ${email}\n 제목: ${subject}\n 내용: ${message}`
        });

        console.log('Message sent: %s', info.messageId);

        res.status(200).json({
            status: 'Success',
            code: 200,
            message: '이메일 송신 성공',
        });

    } catch (error) {
        console.error("이메일 송신 실패 :", error);

        res.status(500).json({
            status: 'Error',
            code: 500,
            message: '이메일 송신 실패',
        });
    }
};