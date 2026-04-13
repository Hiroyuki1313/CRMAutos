import { MySQLAvaluoRepository } from "@/infrastructure/repositories/MySQLAvaluoRepository";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/core/usecases/authService";
import AvaluoDetailView from "@/presentation/components/organisms/AvaluoDetailView";

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function AvaluoDetailPage({ params }: Props) {
    const session = await getSession();
    const role = session?.role as string;

    if (role === 'vendedor') {
        redirect('/');
    }

    const { id } = await params;
    const repo = new MySQLAvaluoRepository();
    const avaluo = await repo.findById(parseInt(id));

    if (!avaluo) {
        notFound();
    }

    return (
        <div className="px-6 py-12 lg:px-12 lg:py-16">
            <div className="max-w-7xl mx-auto">
                <AvaluoDetailView avaluo={avaluo} />
            </div>
        </div>
    );
}
