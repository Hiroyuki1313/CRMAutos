import { NextRequest, NextResponse } from 'next/server';
import { OpenAIService } from '@/infrastructure/services/OpenAIService';
import twilio from 'twilio';

const aiService = new OpenAIService();

export async function POST(req: NextRequest) {
  try {
    // Twilio envía peticiones application/x-www-form-urlencoded
    const rawBody = await req.text();
    const params = new URLSearchParams(rawBody);

    const from = params.get('From') || '';
    const body = params.get('Body') || '';

    console.log(`[WhatsApp Webhook] Mensaje recibido de ${from}: "${body}"`);

    if (!body.trim()) {
      const response = new twilio.twiml.MessagingResponse();
      return new NextResponse(response.toString(), {
        headers: { 'Content-Type': 'text/xml' }
      });
    }

    // Generar respuesta inteligente con OpenAI (gpt-4o-mini)
    const replyText = await aiService.generateResponse(body);

    console.log(`[WhatsApp Webhook] Respuesta generada: "${replyText}"`);

    // Responder inmediatamente en el formato TwiML que espera Twilio
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(replyText);

    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('Error procesando Webhook de WhatsApp:', error);

    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Hola, en este momento estamos actualizando nuestro sistema. Intenta de nuevo en unos minutos.');

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
