import { Auto } from "../entities/Auto";
import { IAutoFinancialCalculator } from "./IAutoFinancialCalculator";

export class AutoFinancialCalculator implements IAutoFinancialCalculator {
  
  private parseFloatSafe(val: any): number {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') {
      return isNaN(val) ? 0 : val;
    }
    // Handle string representations of NaN or empty strings
    const strVal = String(val).trim();
    if (strVal.toLowerCase() === 'nan' || strVal === '') return 0;
    
    const parsed = parseFloat(strVal);
    return isNaN(parsed) ? 0 : parsed;
  }

  calculateBaseCost(auto: Auto): number {
    return this.parseFloatSafe(auto.costo_adquisicion || auto.precio_costo);
  }

  calculateAcondicionamiento(auto: Auto): number {
    return this.getConditioningBreakdown(auto)
      .reduce((acc, curr) => acc + curr.val, 0);
  }

  calculateTotalInvertido(auto: Auto): number {
    const baseCost = this.calculateBaseCost(auto);
    const condCost = this.calculateAcondicionamiento(auto);
    const extraCost = 
      this.parseFloatSafe(auto.publicidad) + 
      this.parseFloatSafe(auto.gestion_administrativa) + 
      this.parseFloatSafe(auto.comision);
    
    return baseCost + condCost + extraCost;
  }

  getConditioningBreakdown(auto: Auto): Array<{ label: string; val: number }> {
    return [
      { label: "Llantas", val: this.parseFloatSafe(auto.acondicionamiento_llantas) },
      { label: "Pintura", val: this.parseFloatSafe(auto.acondicionamiento_pintura) },
      { label: "Mecánica", val: this.parseFloatSafe(auto.acondicionamiento_mecanica) },
      { label: "Refacciones", val: this.parseFloatSafe(auto.acondicionamiento_refacciones) },
      { label: "Accesorios", val: this.parseFloatSafe(auto.acondicionamiento_accesorios) },
      { label: "Limpieza", val: this.parseFloatSafe(auto.acondicionamiento_limpieza) },
      { label: "Tapicería", val: this.parseFloatSafe(auto.acondicionamiento_tapiceria) },
      { label: "Odómetros", val: this.parseFloatSafe(auto.acondicionamiento_odometros) },
      { label: "Pulido", val: this.parseFloatSafe(auto.acondicionamiento_pulido) },
      { label: "Mecánica (Servicios)", val: this.parseFloatSafe(auto.acondicionamiento_mecanica_servicios) },
      { label: "Mecánica (Reparaciones)", val: this.parseFloatSafe(auto.acondicionamiento_mecanica_reparaciones) },
    ].filter(x => x.val > 0);
  }
}

// Single instance to avoid instantiation overhead in UI render pipelines
export const autoFinancialCalculator = new AutoFinancialCalculator();
