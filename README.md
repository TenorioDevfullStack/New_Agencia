# Tenorio AI Landing

Este projeto é uma landing page com backend para captação de leads e envio de e-mails via Brevo.

## Configuração

1. **Clone o repositório:**

   ```bash
   git clone <url-do-repositorio>
   cd tenorio-ai-landing
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Crie o arquivo `.env` na raiz do projeto:**

   ```env
   BREVO_API_KEY=SEU_API_KEY
   BREVO_SENDER_EMAIL=seu@email.com
   BREVO_SENDER_NAME=Seu Nome
   BREVO_RECIPIENT_EMAIL=destino@email.com
   BREVO_RECIPIENT_NAME=Nome Destino
   ```

   > **Atenção:** O arquivo `.env` já está no `.gitignore` e não será versionado, protegendo suas credenciais.

4. **Rode o projeto:**
   ```bash
   npm run dev
   ```
   Ou conforme o comando de inicialização do seu backend.

## Segurança

- **NUNCA** compartilhe o arquivo `.env` ou suas credenciais.
- O arquivo `.env` está protegido pelo `.gitignore`.
- Todas as credenciais são lidas via variáveis de ambiente, não ficando expostas no código-fonte.

## Produção

- Certifique-se de definir as variáveis de ambiente no ambiente de produção (ex: painel da Vercel, Railway, etc).
- Remova logs sensíveis e ative HTTPS no deploy.
- Teste o envio de e-mails em ambiente de produção antes de divulgar.

## Estrutura

- `api/send-email/route.ts`: Endpoint para envio de e-mail.
- `index.html`, `style.css`, `script.js`: Frontend da landing page.

---

Dúvidas? Abra uma issue ou entre em contato com o desenvolvedor.
