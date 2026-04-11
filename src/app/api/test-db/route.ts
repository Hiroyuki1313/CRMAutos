import { NextResponse } from 'next/server';
import pool from '@/infrastructure/db/connection';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('Testing DB connection...');
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        
        return NextResponse.json({
            status: 'success',
            message: 'Conexión a la base de datos exitosa',
            test_result: (rows as any)[0].result,
            env_check: {
                has_host: !!process.env.DB_HOST,
                has_user: !!process.env.DB_USER,
                has_pass: !!process.env.DB_PASSWORD,
                has_db: !!process.env.DB_NAME,
                current_host: process.env.DB_HOST || 'not set (defaulting to localhost)'
            }
        });
    } catch (error: any) {
        console.error('DB Test Error:', error);
        return NextResponse.json({
            status: 'error',
            error_message: error.message,
            error_code: error.code,
            env_debug: {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                db: process.env.DB_NAME
            }
        }, { status: 500 });
    }
}
