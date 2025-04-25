import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    const { email, nombre, token } = datos;
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Bienvenido a MollyVet</title>
    
    <style>
        @media screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: auto !important;
            }
            .stack-column,
            .stack-column-center {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                direction: ltr !important;
            }
            .stack-column-center {
                text-align: center !important;
            }
            .center-on-narrow {
                text-align: center !important;
                display: block !important;
                margin-left: auto !important;
                margin-right: auto !important;
                float: none !important;
            }
            table.center-on-narrow {
                display: inline-block !important;
            }
            .mobile-padding {
                padding-left: 20px !important;
                padding-right: 20px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
    <center style="width: 100%; background-color: #f5f5f5;">
        <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
            ¡Bienvenido a MollyVet! Confirma tu cuenta para comenzar.
        </div>
        <div style="max-width: 600px; margin: 0 auto;" class="email-container">
            <!-- Email Body -->
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
                <!-- Header -->
                <tr>
                    <td style="background-image: linear-gradient(-45deg, #FF7600 0%, #e60d0d 100%); text-align: center; padding: 40px 0;">
                        <h1 style="margin: 0; font-size: 36px; font-weight: bold; color: #ffffff; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">MollyVet</h1>
                        <p style="margin: 10px 0 0; font-size: 16px; color: #ffffff;">Administración Veterinaria Inteligente</p>
                    </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                    <td style="background-color: #ffffff; padding: 40px 30px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <!-- Welcome Message -->
                            <tr>
                                <td style="padding-bottom: 20px; text-align: center;">
                                    <img src="https://r4.wallpaperflare.com/wallpaper/418/103/593/puppies-dog-golden-retrievers-animals-wallpaper-69b0a81de1aacdabc62768ffa0e1d62d.jpg" width="200" height="200" alt="Mascotas felices" style="width: 200px; height: 200px; border-radius: 50%; object-fit: cover; border: 5px solid #FF7600;">
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-bottom: 20px;">
                                    <h2 style="margin: 0; font-size: 24px; color: #333333; text-align: center;">¡Bienvenido a MollyVet, ${nombre}!</h2>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-bottom: 30px; color: #666666; font-size: 16px; line-height: 24px; text-align: center;">
                                    Estamos emocionados de que te unas a nuestra comunidad de profesionales veterinarios. Solo necesitas un paso más para comenzar a gestionar tu clínica de manera profesional.
                                </td>
                            </tr>
                            
                            <!-- CTA Button -->
                            <tr>
                                <td style="padding-bottom: 30px;">
                                    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: auto;">
                                        <tr>
                                            <td style="border-radius: 50px; background: linear-gradient(-45deg, #FF7600 0%, #e60d0d 100%);">
                                                <a href="${process.env.FRONTEND_URL}/confirmar/${token}" style="background: linear-gradient(-45deg, #FF7600 0%, #e60d0d 100%); border-radius: 50px; color: #ffffff; display: inline-block; font-size: 16px; font-weight: bold; line-height: 50px; text-align: center; text-decoration: none; width: 250px; -webkit-text-size-adjust: none;">Confirmar mi cuenta</a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Instructions -->
                            <tr>
                                <td style="background-color: #f9f9f9; border-radius: 10px; padding: 20px;">
                                    <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #333333;">¿Qué hacer ahora?</h3>
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tr>
                                            <td style="padding: 10px 0;">
                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                    <tr>
                                                        <td style="background-color: #FF7600; border-radius: 50%; width: 30px; height: 30px; text-align: center; color: #ffffff; font-weight: bold; line-height: 30px;">1</td>
                                                        <td style="padding-left: 15px; color: #666666; font-size: 14px;">Haz clic en el botón para confirmar tu cuenta</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 10px 0;">
                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                    <tr>
                                                        <td style="background-color: #FF7600; border-radius: 50%; width: 30px; height: 30px; text-align: center; color: #ffffff; font-weight: bold; line-height: 30px;">2</td>
                                                        <td style="padding-left: 15px; color: #666666; font-size: 14px;">Inicia sesión con tus credenciales</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 10px 0;">
                                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                    <tr>
                                                        <td style="background-color: #FF7600; border-radius: 50%; width: 30px; height: 30px; text-align: center; color: #ffffff; font-weight: bold; line-height: 30px;">3</td>
                                                        <td style="padding-left: 15px; color: #666666; font-size: 14px;">Comienza a gestionar tu clínica veterinaria</td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Security Note -->
                            <tr>
                                <td style="padding-top: 30px; font-size: 14px; color: #999999; text-align: center;">
                                    <p style="margin: 0;">Si no creaste esta cuenta, puedes ignorar este mensaje. Tu seguridad es nuestra prioridad.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                    <td style="background-color: #333333; padding: 30px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                                <td style="color: #ffffff; font-size: 14px; text-align: center;">
                                    <p style="margin: 0 0 10px 0;">MollyVet - Sistema de Gestión Veterinaria</p>
                                    <p style="margin: 0; color: #999999;">© 2025 MollyVet. Todos los derechos reservados.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
    </center>
</body>
</html>
    `;
    
    // Enviar Email
    const info = await transport.sendMail({
        from: '"MollyVet" <noreply@mollyvet.com>',
        to: email,
        subject: '🐾 ¡Bienvenido a MollyVet! Confirma tu cuenta',
        text: `Hola ${nombre}, comprueba tu cuenta en MollyVet. Tu cuenta ya está lista, solo debes comprobarla en el siguiente enlace: ${process.env.FRONTEND_URL}/confirmar/${token}`,
        html: htmlContent
    });
    
    console.log("****************mensaje enviado:%s", info.messageId);
};

export default emailRegistro;