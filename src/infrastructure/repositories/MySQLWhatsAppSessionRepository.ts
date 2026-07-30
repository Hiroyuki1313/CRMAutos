import { IWhatsAppSessionRepository } from '@/core/domain/repositories/IWhatsAppSessionRepository';
import { WhatsAppSession } from '@/core/domain/entities/WhatsAppSession';
import mysql from 'mysql2/promise';

// Memoria en caché fallback si no existe tabla en MySQL aún
const memorySessions = new Map<string, WhatsAppSession>();

export class MySQLWhatsAppSessionRepository implements IWhatsAppSessionRepository {
  private pool: mysql.Pool | null = null;

  constructor() {
    try {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'autosuz',
        waitForConnections: true,
        connectionLimit: 5,
      });
      this.initTable();
    } catch {
      console.warn('[SessionRepository] Usando almacenamiento en memoria.');
    }
  }

  private async initTable() {
    if (!this.pool) return;
    try {
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS whatsapp_sessions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id VARCHAR(50) UNIQUE NOT NULL,
          current_state VARCHAR(50) NOT NULL DEFAULT 'INICIO',
          session_data JSON NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
    } catch (err) {
      console.warn('[SessionRepository] No se pudo inicializar la tabla MySQL, se usará memoria:', err);
    }
  }

  async findByUserId(userId: string): Promise<WhatsAppSession | null> {
    if (this.pool) {
      try {
        const [rows] = await this.pool.query<any[]>(
          'SELECT user_id, current_state, session_data FROM whatsapp_sessions WHERE user_id = ?',
          [userId]
        );
        if (rows.length > 0) {
          const row = rows[0];
          return {
            user_id: row.user_id,
            current_state: row.current_state,
            data: typeof row.session_data === 'string' ? JSON.parse(row.session_data) : row.session_data,
          };
        }
      } catch (err) {
        console.error('[SessionRepository Error] Fallback a memoria:', err);
      }
    }

    return memorySessions.get(userId) || null;
  }

  async save(session: WhatsAppSession): Promise<WhatsAppSession> {
    memorySessions.set(session.user_id, session);

    if (this.pool) {
      try {
        await this.pool.query(
          `INSERT INTO whatsapp_sessions (user_id, current_state, session_data)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE current_state = VALUES(current_state), session_data = VALUES(session_data)`,
          [session.user_id, session.current_state, JSON.stringify(session.data)]
        );
      } catch (err) {
        console.error('[SessionRepository Save Error]:', err);
      }
    }

    return session;
  }
}
