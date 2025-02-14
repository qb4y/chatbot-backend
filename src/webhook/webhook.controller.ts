import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import axios, { AxiosResponse } from 'axios';

// 📌 Interfaces para definir estructura de los mensajes recibidos
interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  text?: { body: string };
  type: string;
}

interface WhatsAppStatus {
  id: string;
  status: string;
  timestamp: string;
  recipient_id: string;
}

interface WebhookChange {
  value: {
    messages?: WhatsAppMessage[];
    statuses?: WhatsAppStatus[];
  };
  field: string;
}

interface WebhookEntry {
  id: string;
  changes: WebhookChange[];
}

interface WebhookRequest {
  object: string;
  entry: WebhookEntry[];
}

@Controller('api/webhook')
export class WebhookController {
  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.verify_token') token: string,
    @Res() res: Response,
  ) {
    const VERIFY_TOKEN =
      process.env.WHATSAPP_VERIFY_TOKEN || 'mi_token_secreto';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verificado correctamente.');
      return res.status(HttpStatus.OK).send(challenge); // Meta espera este challenge
    } else {
      console.warn('⚠️ Verificación fallida. Token incorrecto.');
      return res.status(HttpStatus.FORBIDDEN).send('Verificación fallida.');
    }
  }

  private readonly WHATSAPP_API_URL =
    'https://graph.facebook.com/v22.0/528063353731783/messages'; // 📌 Reemplaza con tu `phone_number_id`
  private readonly ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || ''; // 📌 Defínelo en `.env`

  // 📌 Usamos un Set para evitar logs duplicados de estados
  private processedStatuses = new Set<string>();

  @Post()
  async receiveMessage(@Body() body: WebhookRequest, @Res() res: Response) {
    console.log('📩 Webhook recibido:', JSON.stringify(body, null, 2));

    try {
      if (body.object !== 'whatsapp_business_account' || !body.entry?.length) {
        console.warn('⚠️ Webhook recibido sin datos válidos.');
        return res.status(400).send('Webhook inválido.');
      }

      for (const entry of body.entry) {
        for (const change of entry.changes) {
          const messageData = change.value;

          // 📌 1️⃣ PROCESAR MENSAJES RECIBIDOS
          if (messageData.messages?.length) {
            const message = messageData.messages[0];

            if (!message.from || !message.text?.body) {
              console.warn('⚠️ Mensaje recibido sin contenido o remitente.');
              return res.status(400).send('Mensaje incompleto.');
            }

            const from: string = message.from;
            const text: string = message.text.body;

            console.log(`📨 Mensaje de ${from}: ${text}`);

            // 📌 Enviar respuesta automática
            await this.sendMessage(from, `Hola! Recibí tu mensaje: "${text}"`);
          }

          // 📌 2️⃣ IGNORAR ESTADOS DE MENSAJES (SENT, DELIVERED, READ)
          else if (messageData.statuses?.length) {
            const statusObj = messageData.statuses[0];
            const statusId = statusObj.id;
            const status = statusObj.status;

            // 📌 Evitar duplicados en logs
            if (!this.processedStatuses.has(statusId)) {
              this.processedStatuses.add(statusId);
              console.log(`🔹 Estado de mensaje ignorado: ${status}`);
            }
          }

          // 📌 3️⃣ OTROS EVENTOS (puedes manejarlos si los necesitas)
          else {
            console.log(`🔹 Evento ignorado: ${JSON.stringify(change.value)}`);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error procesando el webhook:', error);
      return res.status(500).send('Error interno del servidor.');
    }

    return res.status(200).send('EVENT_RECEIVED');
  }

  // 📌 Método para enviar mensajes
  private async sendMessage(to: string, text: string): Promise<void> {
    const payload = {
      messaging_product: 'whatsapp',
      to,
      text: { body: text },
    };

    try {
      const response: AxiosResponse<{ message_id: string }> = await axios.post(
        this.WHATSAPP_API_URL,
        payload,
        {
          headers: {
            Authorization: `Bearer ${this.ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(
        `✅ Respuesta enviada a ${to}: ${response.data?.message_id || 'Sin ID'}`,
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          '❌ Error enviando mensaje:',
          error.response?.data || error.message,
        );
      } else {
        console.error('❌ Error desconocido:', String(error));
      }

      throw new HttpException(
        'Error al enviar mensaje',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
