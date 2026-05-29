import { Auto } from "../entities/Auto";

export interface IAutoFinancialCalculator {
  /**
   * Safely calculates and returns the acquisition or fallback base cost of the vehicle.
   */
  calculateBaseCost(auto: Auto): number;

  /**
   * Calculates the sum of all 11 dynamic conditioning concepts.
   */
  calculateAcondicionamiento(auto: Auto): number;

  /**
   * Calculates the compiled investment total (Base cost + conditioning + ads + admin + commission).
   */
  calculateTotalInvertido(auto: Auto): number;

  /**
   * Returns a list of active conditioning concepts with non-zero values.
   */
  getConditioningBreakdown(auto: Auto): Array<{ label: string; val: number }>;
}
