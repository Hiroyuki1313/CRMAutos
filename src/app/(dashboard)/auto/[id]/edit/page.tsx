import { MySQLAutoRepository } from "@/infrastructure/repositories/MySQLAutoRepository";
import { notFound } from "next/navigation";
import { AutoForm } from "@/presentation/components/organisms/AutoForm";

export const dynamic = 'force-dynamic';

export default async function AutoEditPage({ params }: { params: Promise<{ id: string }> }) {
  const repo = new MySQLAutoRepository();
  const unwrappedParams = await params;
  const autoId = parseInt(unwrappedParams.id, 10);
  
  if (isNaN(autoId)) notFound();

  const auto = await repo.findById(autoId);
  if (!auto) notFound();

  return <AutoForm mode="edit" initialData={auto} />;
}
