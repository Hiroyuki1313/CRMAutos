import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { IReportGenerator } from '../../core/domain/services/IReportGenerator';
import { Apartado } from '../../core/domain/entities/Apartado';

export class JsPdfApartadoReportGenerator implements IReportGenerator<Apartado> {
  async generate(data: Apartado[], title: string): Promise<void> {
    const doc = new jsPDF({ orientation: 'landscape', format: 'letter' });
    this.addHeader(doc, title, data.length);
    this.addTable(doc, data);
    this.addFooter(doc);
    doc.save(`Reporte_Seguimientos_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private addHeader(doc: jsPDF, title: string, count: number): void {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.text(title.toUpperCase(), 14, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate 500
    const fecha = new Date().toLocaleString('es-MX');
    doc.text(`Generado el: ${fecha}  |  Registros: ${count}`, 14, 26);
    doc.setDrawColor(226, 232, 240); // Border slate 200
    doc.line(14, 30, 268, 30);
  }

  private addTable(doc: jsPDF, data: Apartado[]): void {
    const headers = [['ID', 'Registro', 'Cliente', 'Asesor', 'Próxima Acción', 'Cita', 'Prob.', 'Unidad', 'Crédito']];
    const rows = data.map(item => [
      `#${item.id_venta}`,
      this.formatDate(item.fecha_registro_prospecto || item.fecha_actualizacion),
      item.cliente?.nombre || item.nombre_prospecto || 'Desconocido',
      item.nombre_vendedor || 'S/A',
      this.getCleanActionText(item),
      this.formatDateTime(item.fecha_proxima_cita),
      item.probabilidad || 'Frio',
      item.id_carro ? `${item.modelo || ''} ${item.marca || ''}`.trim() : 'S/U',
      item.estatus_credito || 'S/C'
    ]);

    (doc as any).autoTable({
      head: headers,
      body: rows,
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 8, font: 'helvetica', cellPadding: 2.5 },
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 20 },
        2: { cellWidth: 35 },
        3: { cellWidth: 30 },
        4: { cellWidth: 50 },
        5: { cellWidth: 30 },
        6: { cellWidth: 20 },
        7: { cellWidth: 30 },
        8: { cellWidth: 25 }
      }
    });
  }

  private addFooter(doc: jsPDF): void {
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // Slate 400
      doc.text(`Página ${i} de ${pageCount}`, 250, 205);
      doc.text('CRM Autosuz - Sistema de Control Interno', 14, 205);
    }
  }

  private getCleanActionText(item: Apartado): string {
    let note = item.proximo_seguimiento_texto || 'Sin acción';
    if (note.startsWith('[REGISTRO TEMPORAL]')) return '';
    try {
      if (item.comentarios_vendedor) {
        const parsed = JSON.parse(item.comentarios_vendedor);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const real = parsed.find((c: any) => !c.text.startsWith('[REGISTRO TEMPORAL]'));
          if (real) note = real.text;
        }
      }
    } catch {}
    return note;
  }

  private formatDate(dateStr: string | Date | undefined | null): string {
    if (!dateStr) return 'S/F';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'S/F' : d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
  }

  private formatDateTime(dateStr: string | Date | undefined | null): string {
    if (!dateStr) return 'S/C';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'S/C';
    return d.toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }
}
