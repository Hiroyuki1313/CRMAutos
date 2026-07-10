export interface IReportGenerator<T> {
  generate(data: T[], title: string, activeFilters?: { label: string; value: string }[]): Promise<void>;
}
