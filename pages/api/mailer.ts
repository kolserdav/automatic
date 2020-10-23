import nodemailer from "nodemailer";

export default async (req, res) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'uyem.ru@gmail.com',
      pass: 'syrymbhvyvnpwqqa',
    },
  });

  let info = await transporter.sendMail({
    from: 'Fred Foo 👻',
    to: "19_pek@mail.ru",
    subject: "Hello ✔",
    text: "Hello world?", 
    html: "<b>Hello world?</b>", 
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  res.statusCode = 200
  res.json({ name: 'John Doe' })
}
