import { OpenAI } from 'openai';

export interface IAIService {
  generateResponse(userMessage: string, conversationHistory?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>): Promise<string>;
}

export class OpenAIService implements IAIService {
  private client: OpenAI;
  private defaultSystemPrompt: string;

  constructor() {
    this.defaultSystemPrompt = `Eres un asistente virtual de ventas experto y amable de "Autosuz", una agencia/concesionaria de vehículos.
Tus funciones son:
1. Saludar cordialmente al cliente e identificar en qué le puedes ayudar.
2. Brindar información clara, concisa y rápida sobre la disponibilidad de autos, procesos de apartado o cotizaciones.
3. Responder siempre en español, de forma muy natural, educada y profesional, perfecta para lectura en WhatsApp (mensajes no extremadamente largos).
4. Si no sabes un dato específico, ofrece canalizarlo con un asesor humano.`;
  }

  private getClient(): OpenAI {
    if (!this.client) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY no está configurada en las variables de entorno.');
      }
      this.client = new OpenAI({ apiKey });
    }
    return this.client;
  }

  async generateResponse(
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = []
  ): Promise<string> {
    try {
      const messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [
        { role: 'system', content: this.defaultSystemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      const response = await this.getClient().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      return response.choices[0]?.message?.content?.trim() || 'Lo siento, no pude procesar tu respuesta en este momento.';
    } catch (error: unknown) {
      console.error('Error al comunicarse con OpenAI:', error);
      return 'En este momento estamos experimentando una alta demanda. ¿En qué más puedo ayudarte?';
    }
  }
}
