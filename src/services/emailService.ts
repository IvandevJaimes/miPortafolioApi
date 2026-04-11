import { Resend } from "resend";
import { config } from "../config/index";
import fs from "fs";
import path from "path";

const resend = new Resend(config.resend.apiKey);

const loadTemplate = (name: string, email: string, message: string): string => {
  const templatePath = path.join(process.cwd(), "src/templates/contactEmail.html");
  let html = fs.readFileSync(templatePath, "utf8");
  
  html = html.replace(/{{name}}/g, name);
  html = html.replace(/{{email}}/g, email);
  html = html.replace(/{{message}}/g, message);
  
  return html;
};

export const sendContactNotification = async (name: string, email: string, message: string) => {
  try {
    const html = loadTemplate(name, email, message);
    
    const result = await resend.emails.send({
      from: config.resend.from,
      to: config.resend.to,
      subject: `✉️ Nuevo mensaje de contacto - ${name}`,
      html,
    });

    return result;
  } catch (error) {
    console.error("[EMAIL SERVICE] Error sending email:", error);
    throw error;
  }
};