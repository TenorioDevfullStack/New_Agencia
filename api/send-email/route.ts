import dotenv from "dotenv";
dotenv.config();
import { type NextRequest, NextResponse } from "next/server";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME;
const BREVO_RECIPIENT_EMAIL = process.env.BREVO_RECIPIENT_EMAIL;
const BREVO_RECIPIENT_NAME = process.env.BREVO_RECIPIENT_NAME;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, email, negocio, whatsapp } = body;

    // Validação dos dados
    if (!nome || !email || !negocio || !whatsapp) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // Preparar dados para o Brevo
    const emailData = {
      sender: {
        name: BREVO_SENDER_NAME,
        email: BREVO_SENDER_EMAIL,
      },
      to: [
        {
          email: BREVO_RECIPIENT_EMAIL,
          name: BREVO_RECIPIENT_NAME,
        },
      ],
      subject: `Novo Lead - ${nome} - ${negocio}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1e3a8a, #0f172a); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Tenorio AI Solutions</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Novo Lead Capturado</p>
          </div>
          
          <div style="padding: 30px; background-color: #f8fafc;">
            <h2 style="color: #1e3a8a; margin-bottom: 20px;">Informações do Lead</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <strong style="color: #374151;">Nome:</strong>
              <p style="margin: 5px 0 0 0; color: #6b7280;">${nome}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <strong style="color: #374151;">Email:</strong>
              <p style="margin: 5px 0 0 0; color: #6b7280;">
                <a href="mailto:${email}" style="color: #06b6d4; text-decoration: none;">${email}</a>
              </p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <strong style="color: #374151;">Tipo de Negócio:</strong>
              <p style="margin: 5px 0 0 0; color: #6b7280;">${negocio}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
              <strong style="color: #374151;">WhatsApp:</strong>
              <p style="margin: 5px 0 0 0; color: #6b7280;">
                <a href="https://wa.me/${whatsapp.replace(
                  /\D/g,
                  ""
                )}" style="color: #06b6d4; text-decoration: none;">${whatsapp}</a>
              </p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <strong style="color: #374151;">Data/Hora:</strong>
              <p style="margin: 5px 0 0 0; color: #6b7280;">${new Date().toLocaleString(
                "pt-BR"
              )}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://wa.me/${whatsapp.replace(/\D/g, "")}" 
                 style="background: linear-gradient(135deg, #06b6d4, #10b981); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        display: inline-block;">
                Entrar em Contato via WhatsApp
              </a>
            </div>
          </div>
          
          <div style="background: #0f172a; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0; opacity: 0.8;">© 2025 Tenorio AI Solutions - Todos os direitos reservados</p>
          </div>
        </div>
      `,
      textContent: `
        Novo Lead Capturado - Tenorio AI Solutions
        
        Nome: ${nome}
        Email: ${email}
        Tipo de Negócio: ${negocio}
        WhatsApp: ${whatsapp}
        Data/Hora: ${new Date().toLocaleString("pt-BR")}
        
        Entre em contato: https://wa.me/${whatsapp.replace(/\D/g, "")}
      `,
    };

    // Enviar email via Brevo API
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro do Brevo:", errorData);
      return NextResponse.json(
        { error: "Erro ao enviar email" },
        { status: 500 }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: "Email enviado com sucesso!",
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("Erro no servidor:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
