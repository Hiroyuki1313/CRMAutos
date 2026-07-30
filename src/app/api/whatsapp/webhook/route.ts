import { NextRequest, NextResponse } from 'next/server';
import { OpenAIService } from '@/infrastructure/services/OpenAIService';
import { MySQLWhatsAppSessionRepository } from '@/infrastructure/repositories/MySQLWhatsAppSessionRepository';
import { WhatsAppSession } from '@/core/domain/entities/WhatsAppSession';
import twilio from 'twilio';

const aiService = new OpenAIService();
const sessionRepository = new MySQLWhatsAppSessionRepository();

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const params = new URLSearchParams(rawBody);

    const from = params.get('From') || ''; // Ej: whatsapp:+521614...
    const body = params.get('Body') || '';

    console.log(`[WhatsApp Inbound] De: ${from} | Mensaje: "${body}"`);

    if (!from || !body.trim()) {
      const response = new twilio.twiml.MessagingResponse();
      return new NextResponse(response.toString(), {
        headers: { 'Content-Type': 'text/xml' }
      });
    }

    // 1. Obtener o crear sesión del usuario en DB/Memoria
    let session = await sessionRepository.findByUserId(from);
    if (!session) {
      session = {
        user_id: from,
        current_state: 'INICIO',
        data: {
          unidad_interes: null,
          tipo_pago: null,
          enganche_monto: null,
          buro_credito: null,
          comprobante_ingreso: null,
          modalidad_tramite: null,
          cita_fecha: null,
          cita_horario: null,
        }
      };
    }

    // 2. Procesar el mensaje con OpenAI Agent (Routing + Calificación + State Management)
    const { responseText, updatedSession } = await aiService.processUserMessage(body, session);

    // 3. Guardar la sesión actualizada
    await sessionRepository.save(updatedSession);

    console.log(`[WhatsApp Outbound] Para: ${from} | Estado: ${updatedSession.current_state} | Data:`, updatedSession.data);

    // 4. Responder a Twilio con formato TwiML
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(responseText);

    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('Error en Webhook WhatsApp:', error);
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Hola, bienvenido a Autosuz. ¿En qué vehículo estás interesado el día de hoy?');

    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'active', service: 'Autosuz WhatsApp Bot Webhook' });
}
