var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '1421realty@gmail.com',
        pass: '0802212063'
    }
});

let sendEmail = function (user) {
    res.render('registration', {
        name: 'Rohini Kumar'
    }, function (err, html) {
        var mailOptions = {
            to: 'keystroke99@gmail.com',
            from: '1421realty@gmail.com',
            subject: 'Welcome to West Genetics!',
            html: html
        };

        transporter.sendMail(mailOptions, function (err, result) {
            console.log('Message sent!');
            console.log(result)
        });
    });
};
module.exports.sendEmail = sendEmail;