export type BotState = 
  | 'INICIO'
  | 'PREGUNTA_POR_UNIDAD'
  | 'CATALOGO'
  | 'ENGANCHE_CREDITO'
  | 'CONTADO_PRECIO'
  | 'UBICACION'
  | 'QUALIFYING_CREDIT'
  | 'AGENDA_CITA'
  | 'CONFIRMADO';

export interface WhatsAppSessionData {
  unidad_interes: string | null;
  tipo_pago: 'CONTADO' | 'CREDITO' | null;
  enganche_monto: string | null;
  buro_credito: 'BUENO' | 'MALO' | 'NO_LO_SE' | null;
  comprobante_ingreso: 'INDEPENDIENTE' | 'ESTADOS_CUENTA' | 'NOMINAS' | null;
  modalidad_tramite: 'FISICO' | 'DIGITAL' | null;
  cita_fecha: string | null;
  cita_horario: 'AM' | 'PM' | null;
}

export interface WhatsAppSession {
  id?: number;
  user_id: string; // Número de WhatsApp (+52...)
  current_state: BotState;
  data: WhatsAppSessionData;
  created_at?: Date;
  updated_at?: Date;
}
