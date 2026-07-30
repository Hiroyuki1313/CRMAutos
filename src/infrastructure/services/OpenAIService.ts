import { OpenAI } from 'openai';
import { WhatsAppSession, WhatsAppSessionData, BotState } from '@/core/domain/entities/WhatsAppSession';

export interface IAIService {
  processUserMessage(
    userMessage: string,
    session: WhatsAppSession
  ): Promise<{ responseText: string; updatedSession: WhatsAppSession }>;
}

export class OpenAIService implements IAIService {
  private client: OpenAI | null = null;
  private systemPrompt: string;

  constructor() {
    this.systemPrompt = `Eres un asesor de ventas automotriz experto, ágil, educado y muy conversacional de "Autosuz" (ubicados en Av. Francisco Villa 1000).

TU OBJETIVO PRINCIPAL:
Calificar al prospecto de manera rápida y amable, resolviendo sus dudas y llevándolo estratégicamente a AGENDAR UNA CITA PRESENCIAL en la agencia para ver la unidad.

REGLAS DE INTERACCIÓN Y RAMAS DE CONVERSACIÓN:
1. RAMA A: PREGUNTA POR UNIDAD / PRECIO DE CONTADO / CATALOGO / UBICACIÓN:
   - Si el usuario pregunta por una unidad específica, registra 'unidad_interes'.
   - Si pregunta PRECIO DE CONTADO o PRECIO DIRECTO: dale el precio (o infórmale que le daremos la cotización exacta) e invítalo inmediatamente con el Hook de Cita: "¿Te gustaría agendar una cita para verla físicamente en nuestra sucursal de Av. Francisco Villa 1000?".
   - Si consulta UBICACIÓN: Responde con la dirección (Av. Francisco Villa 1000) y propón agendar una cita para recibirlo.
   - Si pide CATÁLOGO: Ofrece enviárselo/revisarlo y consulta si le interesa financiamiento o ver alguna unidad en agencia.

2. RAMA B: FINANCIACIÓN / CRÉDITO (CALIFICACIÓN DEL PROSPECTO):
   Si solicita Crédito o Enganche, debes calificarlo obteniendo secuencialmente si no los ha dado:
   a) Monto de Enganche (captura 'enganche_monto').
   b) Historial / Buró de Crédito (evalúa si es 'BUENO', 'MALO' o 'NO_LO_SE').
      - Si es MALO: Sé empático y dale opciones de flexibilidad/alternativas para buró y requisitos.
   c) Comprobación de Ingresos (clasifica en 'INDEPENDIENTE', 'ESTADOS_CUENTA' o 'NOMINAS').
   d) Modalidad del Trámite (clasifica en 'FISICO' o 'DIGITAL').
   e) Validación: Si cuenta con todo, pasa directo a agendamiento de cita. Si le falta algo, explica la flexibilidad de la financiera para entregar diferido y coordinar visita.

3. RAMA C: MÓDULO DE AGENDAMIENTO DE CITAS (AGENDA DE CITA):
   - Al coordinar la visita, pregunta si puede asistir HOY.
   - Si responde que NO PUEDE HOY: Despliega opciones para MAÑANA u otro día y pide definir bloque horario (AM o PM / Hora específica).
   - Cuando confirme fecha y horario, emite un mensaje de confirmación entusiasta con la fecha, horario y ubicación.

INSTRUCCIONES DE FORMATO:
Tus respuestas deben ser concisas, breves y naturales para WhatsApp (máximo 2 a 4 párrafos cortos). Sé atento y proactivo.`;
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

  async processUserMessage(
    userMessage: string,
    session: WhatsAppSession
  ): Promise<{ responseText: string; updatedSession: WhatsAppSession }> {
    try {
      const client = this.getClient();

      // Definición de las herramientas de extracción de datos y consulta de inventario (Structured Tools)
      const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
        {
          type: 'function',
          function: {
            name: 'get_available_cars',
            description: 'Consulta los autos disponibles en el inventario real de Autosuz (tabla autos en la base de datos). Úsala cuando el cliente pregunte por autos disponibles, modelos, marcas, precios o si tenemos cierto auto.',
            parameters: {
              type: 'object',
              properties: {
                search: { type: ['string', 'null'], description: 'Término de búsqueda opcional como marca, modelo o año (ej: "Mazda", "2020", "Versa").' }
              }
            }
          }
        },
        {
          type: 'function',
          function: {
            name: 'update_prospect_session_data',
            description: 'Actualiza los datos del prospecto y el estado de la conversación.',
            parameters: {
              type: 'object',
              properties: {
                intent: {
                  type: 'string',
                  enum: [
                    'PREGUNTA_POR_UNIDAD',
                    'CATALOGO',
                    'ENGANCHE_CREDITO',
                    'CONTADO_PRECIO',
                    'UBICACION',
                    'QUALIFYING_CREDIT',
                    'AGENDA_CITA',
                    'CONFIRMADO',
                    'GENERAL'
                  ],
                  description: 'La intención o fase detectada en el mensaje del cliente.'
                },
                unidad_interes: { type: ['string', 'null'], description: 'Nombre o modelo del auto de interés.' },
                tipo_pago: { type: ['string', 'null'], enum: ['CONTADO', 'CREDITO', null] },
                enganche_monto: { type: ['string', 'null'], description: 'Monto o porcentaje de enganche mencionado.' },
                buro_credito: { type: ['string', 'null'], enum: ['BUENO', 'MALO', 'NO_LO_SE', null] },
                comprobante_ingreso: { type: ['string', 'null'], enum: ['INDEPENDIENTE', 'ESTADOS_CUENTA', 'NOMINAS', null] },
                modalidad_tramite: { type: ['string', 'null'], enum: ['FISICO', 'DIGITAL', null] },
                cita_fecha: { type: ['string', 'null'], description: 'Fecha o día propuesto para la cita.' },
                cita_horario: { type: ['string', 'null'], enum: ['AM', 'PM', null], description: 'Turno u horario preferido.' }
              },
              required: ['intent']
            }
          }
        }
      ];

      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: this.systemPrompt },
        {
          role: 'system',
          content: `ESTADO ACTUAL DE LA SESIÓN DEL CLIENTE (${session.user_id}):
Estado Conversacional: ${session.current_state}
Datos actualizados en sesión JSON:
${JSON.stringify(session.data, null, 2)}`
        },
        { role: 'user', content: userMessage }
      ];

      // Petición a OpenAI gpt-4o-mini con tool_choice automático
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        tools: tools,
        tool_choice: 'auto',
        temperature: 0.5,
      });

      const choice = response.choices[0];
      const updatedData: WhatsAppSessionData = { ...session.data };
      let newState: BotState = session.current_state;

      // Verificar si OpenAI llamó la función para actualizar datos
      if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
        const toolCall = choice.message.tool_calls[0];
        if (toolCall.function.name === 'get_available_cars') {
          const args = JSON.parse(toolCall.function.arguments);
          let carsResult: any[] = [];
          
          try {
            const { MySQLAutoRepository } = await import('@/infrastructure/repositories/MySQLAutoRepository');
            const autoRepo = new MySQLAutoRepository();
            const rawCars = await autoRepo.getAll({ search: args.search || undefined });

            carsResult = rawCars.map(c => ({
              marca: c.marca,
              modelo: c.modelo,
              anio: c.anio,
              version: c.version,
              kilometraje: c.kilometraje,
              color: c.color,
              precio_publicacion: c.precio_publicacion,
              estado_logico: c.estado_logico
            })).slice(0, 5); // Máximo 5 resultados para mantener respuesta corta
          } catch (dbErr) {
            console.error('[OpenAIService DB Query Error]:', dbErr);
          }

          const followUpMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            ...messages,
            choice.message,
            {
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify({ available_cars_found: carsResult })
            }
          ];

          const secondResponse = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: followUpMessages,
            temperature: 0.6,
          });

          const responseText = secondResponse.choices[0]?.message?.content?.trim() || 'Contamos con una amplia variedad de autos en inventario. ¿Te gustaría agendar una cita para verlos en agencia?';

          return {
            responseText,
            updatedSession: session
          };
        }

        if (toolCall.function.name === 'update_prospect_session_data') {
          const args = JSON.parse(toolCall.function.arguments);

          if (args.intent && args.intent !== 'GENERAL') {
            newState = args.intent as BotState;
          }
          if (args.unidad_interes) updatedData.unidad_interes = args.unidad_interes;
          if (args.tipo_pago) updatedData.tipo_pago = args.tipo_pago;
          if (args.enganche_monto) updatedData.enganche_monto = args.enganche_monto;
          if (args.buro_credito) updatedData.buro_credito = args.buro_credito;
          if (args.comprobante_ingreso) updatedData.comprobante_ingreso = args.comprobante_ingreso;
          if (args.modalidad_tramite) updatedData.modalidad_tramite = args.modalidad_tramite;
          if (args.cita_fecha) updatedData.cita_fecha = args.cita_fecha;
          if (args.cita_horario) updatedData.cita_horario = args.cita_horario;

          // Segunda llamada para obtener el mensaje final teniendo en cuenta los datos capturados
          const followUpMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            ...messages,
            choice.message,
            {
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify({ status: 'success', updated_session_data: updatedData })
            }
          ];

          const secondResponse = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: followUpMessages,
            temperature: 0.6,
          });

          const responseText = secondResponse.choices[0]?.message?.content?.trim() || '¿En qué más te podemos ayudar en Autosuz?';

          return {
            responseText,
            updatedSession: {
              ...session,
              current_state: newState,
              data: updatedData,
            }
          };
        }
      }

      // Si no usó herramientas, responder directamente
      const responseText = choice.message.content?.trim() || '¡Hola! Bienvenido a Autosuz. ¿En qué vehículo estás interesado el día de hoy?';

      return {
        responseText,
        updatedSession: {
          ...session,
          current_state: newState,
          data: updatedData,
        }
      };
    } catch (error) {
      console.error('Error en OpenAIService:', error);
      return {
        responseText: 'Hola, gracias por comunicarte a Autosuz. ¿En qué vehículo estás interesado o deseas agendar una cita en nuestra sucursal de Av. Francisco Villa 1000?',
        updatedSession: session
      };
    }
  }
}
