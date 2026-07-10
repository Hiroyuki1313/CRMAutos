import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IReportGenerator } from '../../core/domain/services/IReportGenerator';
import { Apartado } from '../../core/domain/entities/Apartado';

export class JsPdfApartadoReportGenerator implements IReportGenerator<Apartado> {
  async generate(data: Apartado[], title: string): Promise<void> {
    const doc = new jsPDF({ orientation: 'landscape', format: 'letter' });
    this.addBrandStrip(doc);
    this.addHeader(doc, title, data.length);
    
    const groups = this.groupDataBySeller(data);
    let startY = 38;

    for (const [sellerName, items] of Object.entries(groups)) {
      if (startY > 155) {
        doc.addPage();
        this.addBrandStrip(doc);
        this.addHeader(doc, title, data.length);
        startY = 38;
      }
      startY = this.renderSellerSection(doc, sellerName, items, startY);
    }

    this.addFooter(doc);
    doc.save(`Reporte_Seguimientos_Autosuz_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  private addBrandStrip(doc: jsPDF): void {
    doc.setFillColor(79, 70, 229); // Indigo / Violet brand color
    doc.rect(0, 0, 280, 4, 'F');
  }

  private addHeader(doc: jsPDF, title: string, count: number): void {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.text('AUTOSUZ - REPORTE DE SEGUIMIENTOS', 14, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139); // Slate 500
    const fecha = new Date().toLocaleString('es-MX');
    doc.text(`AUTOSUZ CRM GERENCIAL  |  Generado: ${fecha}  |  Total Registros en Consulta: ${count}`, 14, 24);
    
    doc.setDrawColor(226, 232, 240); // Border slate 200
    doc.line(14, 28, 266, 28);
  }

  private groupDataBySeller(data: Apartado[]): Record<string, Apartado[]> {
    const groups: Record<string, Apartado[]> = {};
    data.forEach(item => {
      const seller = item.nombre_vendedor || 'Sin Asesor Asignado';
      if (!groups[seller]) {
        groups[seller] = [];
      }
      groups[seller].push(item);
    });
    return groups;
  }

  private renderSellerSection(doc: jsPDF, seller: string, items: Apartado[], startY: number): number {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(79, 70, 229); // Brand primary
    doc.text(`ASESOR: ${seller.toUpperCase()}`, 14, startY);
    
    const tableEndY = this.renderSellerTable(doc, items, startY + 3);
    const summaryEndY = this.renderSellerSummary(doc, items, tableEndY + 5);
    
    return summaryEndY + 12; // Gap before next seller
  }

  private renderSellerTable(doc: jsPDF, items: Apartado[], startY: number): number {
    const headers = [['ID', 'Registro', 'Cliente', 'Asesor', 'Próxima Acción', 'Cita', 'Prob.', 'Unidad', 'Crédito']];
    const rows = items.map(item => [
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

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: startY,
      theme: 'grid',
      styles: { fontSize: 7.5, font: 'helvetica', cellPadding: 2 },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' }, // Slate 900 for premium table header
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
      },
      didParseCell: (cellData) => {
        if (cellData.section === 'body' && cellData.column.index === 6) { // 'Prob.' column
          const val = String(cellData.cell.raw).toLowerCase().trim();
          if (val === 'bajo') {
            cellData.cell.styles.fillColor = [56, 189, 248]; // Cyan
            cellData.cell.styles.textColor = [255, 255, 255];
            cellData.cell.styles.fontStyle = 'bold';
          } else if (val === 'medio') {
            cellData.cell.styles.fillColor = [249, 115, 22]; // Orange
            cellData.cell.styles.textColor = [255, 255, 255];
            cellData.cell.styles.fontStyle = 'bold';
          } else if (val === 'alto') {
            cellData.cell.styles.fillColor = [239, 68, 68]; // Red
            cellData.cell.styles.textColor = [255, 255, 255];
            cellData.cell.styles.fontStyle = 'bold';
          } else if (val === 'frio' || val === 'frío') {
            cellData.cell.styles.fillColor = [148, 163, 184]; // Slate
            cellData.cell.styles.textColor = [255, 255, 255];
            cellData.cell.styles.fontStyle = 'bold';
          } else if (val === 'venta') {
            cellData.cell.styles.fillColor = [34, 197, 94]; // Green
            cellData.cell.styles.textColor = [255, 255, 255];
            cellData.cell.styles.fontStyle = 'bold';
          } else if (val === 'rechazo') {
            cellData.cell.styles.fillColor = [100, 116, 139]; // Gray
            cellData.cell.styles.textColor = [255, 255, 255];
            cellData.cell.styles.fontStyle = 'bold';
          } else if (val === 'largo plazo') {
            cellData.cell.styles.fillColor = [99, 102, 241]; // Indigo
            cellData.cell.styles.textColor = [255, 255, 255];
            cellData.cell.styles.fontStyle = 'bold';
          }
        }
      }
    });

    return (doc as any).lastAutoTable.finalY;
  }

  private renderSellerSummary(doc: jsPDF, items: Apartado[], startY: number): number {
    const total = items.length;
    const probs: Record<string, number> = {};
    items.forEach(item => {
      const p = item.probabilidad || 'Frio';
      probs[p] = (probs[p] || 0) + 1;
    });

    const summaryParts = Object.entries(probs).map(([prob, count]) => `${prob}: ${count}`);
    const summaryText = `Resumen Asesor: ${total} prospectos asignados  |  Detalle: ( ${summaryParts.join(', ')} )`;

    doc.setFont('helvetica', 'bolditalic');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105); // Slate 600
    doc.text(summaryText, 14, startY);
    return startY;
  }

  private addFooter(doc: jsPDF): void {
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184); // Slate 400
      doc.text(`Página ${i} de ${pageCount}`, 248, 205);
      doc.text('AUTOSUZ CRM - SISTEMA DE CONTROL GERENCIAL INTERNO', 14, 205);
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
