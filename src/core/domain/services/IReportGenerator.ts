export interface IReportGenerator<T> {
  generate(data: T[], title: string): Promise<void>;
}
