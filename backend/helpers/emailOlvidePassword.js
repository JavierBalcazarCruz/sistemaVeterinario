import nodemailer from "nodemailer";

//Credenciales del email
const emailOlvidePassword = async (datos) =>{
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      const {email, nombre, token } = datos;
      
      //Enviar Email
      const info = await transport.sendMail({
        from: "MollyVet - Administrador de pacientes veteriaria",
        to: email,
        subject: `Restablece tu contraseña de Mollyvet`,
        text: 'Restaura tu contraseña ',
        html: `<p>Hola: ${nombre} </p>
        <p>Haz solicitado restablecer tu contraseña de acceso a MollyVet, sigue el siguiente enlace para generar una nueva contraseña: <a href ="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer contraseña</a></p>
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>`
      });
      console.log("****************mensaje enviado:%s", info.messageId);
};



export default emailOlvidePassword;
