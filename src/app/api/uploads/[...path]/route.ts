import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const pathSegments = resolvedParams.path || [];
    const relativePath = pathSegments.join('/');
    
    const baseDir = process.env.STORAGE_PATH 
      ? path.resolve(process.env.STORAGE_PATH) 
      : path.join(process.cwd(), 'public', 'uploads');
      
    const filePath = path.resolve(baseDir, relativePath);

    if (!filePath.startsWith(baseDir)) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const fileBuffer = await fs.readFile(filePath);

    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.pdf') contentType = 'application/pdf';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
  }
}
