import * as dotenv from 'dotenv';

dotenv.config();

export const environment = {
  port: process.env.PORT || 3000,
  whatsappApiUrl: `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`,
  whatsappVerifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'mi_token_secreto',
  whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
};
