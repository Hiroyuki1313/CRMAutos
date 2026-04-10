import { useEffect } from "react";
import {
    ArrowLeft,
    Car,
    ChevronRight,
    ClipboardList,
    FileText,
    HandCoins,
    Home,
    Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function App() {
    return (
        <div>
            <div
                className="bg-zinc-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible"
                style={{ fontFamily: "sans-serif" }}
                data-id="35974773-c402-5f02-b98b-a0b49f7be396"
            >
                <div
                    className="flex pb-20 flex-col"
                    data-id="01ec8681-0ad6-52ea-893d-b9a6e4104e4a"
                >
                    <div
                        className="flex px-4 pt-12 pb-4 items-center gap-4"
                        data-id="fc309f6b-bd0d-5fe7-a571-ddb56b387495"
                    >
                        <ArrowLeft
                            className="size-6 text-neutral-50"
                            data-id="195162a2-c311-5ef2-9796-33f294c9d70c"
                        />
                        <span
                            className="font-bold text-neutral-50 text-lg leading-7"
                            data-id="d2051640-e307-50e7-8982-fb8b9d6e1f63"
                        >
                            Detalle Vehículo
                        </span>
                    </div>
                    <div className="px-4" data-id="6daa7493-49cf-5eac-a223-6f329ea5a466">
                        <div
                            className="relative rounded-xl overflow-hidden"
                            style={{ height: 180 }}
                            data-id="589e6c2a-d1f0-5196-8764-139cc454ec3a"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1743114713503-b698b8433f03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxyZWQlMjBNYXpkYSUyMENYLTUlMjBTVVYlMjBjYXJ8ZW58MXwwfHx8MTc3NTc1MDM1M3ww&ixlib=rb-4.1.0&q=80&w=400"
                                alt="Mazda CX-5 2023 Rojo"
                                className="object-cover w-full h-full"
                                data-photoid="a39t4-DbfSk"
                                data-authorname="Ryan Collins"
                                data-authorurl="https://unsplash.com/@swollfadder"
                                data-blurhash="LHE2,=^%?^xt~C?bxubc0et7wIWV"
                                data-id="b8e0801e-b754-5dc4-8669-9d11fbb222ab"
                            />
                        </div>
                        <div
                            className="flex mt-2 justify-center items-center gap-2"
                            data-id="d50dee5b-d985-5ebe-a571-9bc65b8f9082"
                        >
                            <div
                                className="rounded-full bg-[#f0b100] w-2 h-2"
                                data-id="cc4738af-f7e4-5e23-a37d-2bea21391df9"
                            />
                            <div
                                className="rounded-full bg-zinc-800 w-2 h-2"
                                data-id="54a2b321-dd5b-509b-93c6-ffea8f401764"
                            />
                            <div
                                className="rounded-full bg-zinc-800 w-2 h-2"
                                data-id="a4c9c02f-06dc-5f30-8a69-ffc686821ce6"
                            />
                            <div
                                className="rounded-full bg-zinc-800 w-2 h-2"
                                data-id="f6e6d443-f5d9-55ce-ac82-650d2caa8314"
                            />
                        </div>
                    </div>
                    <div
                        className="flex mt-4 px-4 justify-between items-start"
                        data-id="8611e744-4277-5637-b460-aa534fcefde3"
                    >
                        <div
                            className="flex flex-col gap-1"
                            data-id="c5bf3190-5f6a-5ccc-bc09-e5ec32dc091d"
                        >
                            <span
                                className="font-bold text-neutral-50 text-xl leading-7"
                                data-id="e732279a-11ad-5961-9117-e4069ba1c02a"
                            >
                                Mazda CX-5 2023
                            </span>
                            <span
                                className="text-[#9f9fa9] text-sm leading-5"
                                data-id="02c236a3-2d32-5581-85de-fb40edfd543e"
                            >
                                SUV · Rojo · 28,000 km
                            </span>
                        </div>
                        <Badge
                            className="font-semibold rounded-full bg-[#f0b100] text-[#733e0a] text-xs leading-4 px-3 py-1"
                            data-id="842ec36a-c893-5ee9-a9e5-21f6e9301152"
                        >
                            Apartado
                        </Badge>
                    </div>
                    <div
                        className="mt-4 px-4"
                        data-id="f2295e28-cb07-52f6-bd9e-46920bfcff51"
                    >
                        <Card
                            className="bg-zinc-900 border-white/10 border-0 border-solid p-4 gap-4"
                            data-id="8e4f327e-0549-5c06-84cd-e4e27e214836"
                        >
                            <CardHeader
                                className="p-0 gap-1"
                                data-id="8a8dd89d-5ee9-5238-a486-6f21693df2cb"
                            >
                                <span
                                    className="font-semibold text-neutral-50 text-sm leading-5"
                                    data-id="57bd13e0-17cb-5290-97c0-9b5a293ccc0b"
                                >
                                    Información del Vehículo
                                </span>
                            </CardHeader>
                            <CardContent
                                className="p-0 gap-2"
                                data-id="b192ebf9-2b53-5de1-8ad9-c4617f660554"
                            >
                                <div
                                    className="grid grid-cols-2 gap-x-4 gap-y-3"
                                    data-id="7f8d09aa-a65f-579d-9605-80f916b56b9b"
                                >
                                    <div
                                        className="flex flex-col gap-0.5"
                                        data-id="0a7cafac-a786-5299-a801-30c9457be647"
                                    >
                                        <span
                                            className="text-[#9f9fa9] text-xs leading-4"
                                            data-id="5b637811-185c-5e3d-9ae6-f9a3aea49c00"
                                        >
                                            Marca
                                        </span>
                                        <span
                                            className="font-medium text-neutral-50 text-sm leading-5"
                                            data-id="29c721a0-3075-5775-b129-bdea6c3f2040"
                                        >
                                            Mazda
                                        </span>
                                    </div>
                                    <div
                                        className="flex flex-col gap-0.5"
                                        data-id="24daf1f7-eb12-5fcd-8fd0-3e37c91b968f"
                                    >
                                        <span
                                            className="text-[#9f9fa9] text-xs leading-4"
                                            data-id="de144153-0214-5f01-8f59-7a5a699bdee2"
                                        >
                                            Modelo
                                        </span>
                                        <span
                                            className="font-medium text-neutral-50 text-sm leading-5"
                                            data-id="36891e5f-a18d-51b5-9bef-c05c7a46e9b5"
                                        >
                                            CX-5
                                        </span>
                                    </div>
                                    <div
                                        className="flex flex-col gap-0.5"
                                        data-id="39905c4e-b22a-5b4e-a1ed-b083874bd1b4"
                                    >
                                        <span
                                            className="text-[#9f9fa9] text-xs leading-4"
                                            data-id="91a62159-a4b2-5b15-8386-b50e90cedfa7"
                                        >
                                            Año
                                        </span>
                                        <span
                                            className="font-medium text-neutral-50 text-sm leading-5"
                                            data-id="0368f48d-d758-5273-9712-c79eeb598c4f"
                                        >
                                            2023
                                        </span>
                                    </div>
                                    <div
                                        className="flex flex-col gap-0.5"
                                        data-id="6a04e80f-720c-5eec-8498-1195a16bbcc1"
                                    >
                                        <span
                                            className="text-[#9f9fa9] text-xs leading-4"
                                            data-id="776f7dd7-7e81-506a-94b8-c9045f24c6a8"
                                        >
                                            Tipo
                                        </span>
                                        <span
                                            className="font-medium text-neutral-50 text-sm leading-5"
                                            data-id="4ef3d71d-3516-5102-a12b-3d56b8add8b2"
                                        >
                                            SUV
                                        </span>
                                    </div>
                                    <div
                                        className="flex flex-col gap-0.5"
                                        data-id="3fc62651-b50d-5291-8107-aaf68c0cd7ad"
                                    >
                                        <span
                                            className="text-[#9f9fa9] text-xs leading-4"
                                            data-id="505141ae-84e7-512c-a82f-571f6c5cc059"
                                        >
                                            Color
                                        </span>
                                        <span
                                            className="font-medium text-neutral-50 text-sm leading-5"
                                            data-id="d903d8a7-0fd4-5768-b18b-8467ee58757f"
                                        >
                                            Rojo
                                        </span>
                                    </div>
                                    <div
                                        className="flex flex-col gap-0.5"
                                        data-id="63d25f6f-c63e-5aab-b306-ce02bf3695cc"
                                    >
                                        <span
                                            className="text-[#9f9fa9] text-xs leading-4"
                                            data-id="605294f7-ad18-56c6-9f75-da1178be12fa"
                                        >
                                            Kilometraje
                                        </span>
                                        <span
                                            className="font-medium text-neutral-50 text-sm leading-5"
                                            data-id="c0bd647c-d6a6-5411-b41f-8d0ab7fc6f5c"
                                        >
                                            28,000 km
                                        </span>
                                    </div>
                                    <div
                                        className="col-span-2 flex flex-col gap-0.5"
                                        data-id="47d3ec12-c90d-5427-8f48-cf587cc4f635"
                                    >
                                        <span
                                            className="text-[#9f9fa9] text-xs leading-4"
                                            data-id="4a571f96-71a2-55b2-96c0-cd5c1da09e31"
                                        >
                                            Ubicación
                                        </span>
                                        <span
                                            className="font-medium text-neutral-50 text-sm leading-5"
                                            data-id="37b55472-83c3-5454-805a-ebf17879d8d0"
                                        >
                                            Sucursal Norte
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div
                        className="mt-4 px-4"
                        data-id="d6904db0-d35c-5bff-ab0f-7b94a97068d5"
                    >
                        <Card
                            className="bg-zinc-900 border-white/10 border-0 border-solid p-4 gap-4"
                            data-id="918d6d3a-1bc6-5500-8121-43e27c59a6c9"
                        >
                            <CardHeader
                                className="p-0 gap-1"
                                data-id="53d9ae1f-c61a-50e3-a365-8e16c352f744"
                            >
                                <span
                                    className="font-semibold text-neutral-50 text-sm leading-5"
                                    data-id="a8aaca51-d1df-5c7d-b204-d3cd7c23111e"
                                >
                                    Precios
                                </span>
                            </CardHeader>
                            <CardContent
                                className="p-0 gap-2"
                                data-id="098c17e2-70c0-5bff-9fbc-ed47aeac6dae"
                            >
                                <div
                                    className="flex flex-col gap-2"
                                    data-id="a68aa00d-1369-5cea-ad7d-845e501b840b"
                                >
                                    <div
                                        className="flex justify-between items-center"
                                        data-id="69724d3a-a4f5-5fef-a0cc-e5219ce0b724"
                                    >
                                        <span
                                            className="text-[#9f9fa9] text-sm leading-5"
                                            data-id="7ff38bf8-7343-513d-8983-591e6d548573"
                                        >
                                            Precio de Compra
                                        </span>
                                        <span
                                            className="font-medium text-neutral-50 text-sm leading-5"
                                            data-id="2732a663-f661-5942-8959-b65866e449e6"
                                        >
                                            $350,000
                                        </span>
                                    </div>
                                    <div
                                        className="flex justify-between items-center"
                                        data-id="21b313ab-a7a5-54f4-b20e-4d88f1b9b572"
                                    >
                                        <span
                                            className="text-[#9f9fa9] text-sm leading-5"
                                            data-id="696bc6dd-2aeb-5305-9420-6a8f71c9dc0b"
                                        >
                                            Precio de Venta
                                        </span>
                                        <span
                                            className="font-bold text-[#f0b100] text-sm leading-5"
                                            data-id="c520fec8-9235-5cdc-8e79-bbfc1bae7ec2"
                                        >
                                            $420,000
                                        </span>
                                    </div>
                                    <Separator
                                        className="bg-white/10"
                                        data-id="7b3a6ff1-79b6-5a28-a69b-fa2ac2e32bd2"
                                    />
                                    <div
                                        className="flex justify-between items-center"
                                        data-id="e8d5e4f8-9412-5547-842a-7af775f89dd6"
                                    >
                                        <span
                                            className="text-[#9f9fa9] text-sm leading-5"
                                            data-id="d5796592-1488-54a2-adfb-1c814d1c48ef"
                                        >
                                            Margen
                                        </span>
                                        <span
                                            className="font-bold text-sm leading-5"
                                            style={{ color: "oklch(0.696 0.17 162.48)" }}
                                            data-id="dccdb82d-92a4-5836-a849-8fe23f5a654d"
                                        >
                                            $70,000
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div
                        className="mt-4 px-4"
                        data-id="5355261a-8c8e-5eb5-ad84-9b101b807199"
                    >
                        <Card
                            className="cursor-pointer bg-zinc-900 border-white/10 border-0 border-solid p-4 gap-2"
                            data-id="04579a52-ccd7-5ed7-bbc6-9ea5b288f036"
                        >
                            <CardHeader
                                className="p-0 gap-1"
                                data-id="9051e5a3-671c-5bd3-ab4b-160cfcd8daa8"
                            >
                                <span
                                    className="font-semibold uppercase text-[#9f9fa9] text-xs leading-4 tracking-wide"
                                    data-id="968d7556-85c2-5ce1-801d-ff90caa2c3c9"
                                >
                                    Apartado Vinculado
                                </span>
                            </CardHeader>
                            <CardContent
                                className="p-0 gap-0"
                                data-id="38baf134-9255-5add-83b6-2062e618c943"
                            >
                                <div
                                    className="flex justify-between items-center"
                                    data-id="b993264a-2dde-5537-a801-93e8636058c7"
                                >
                                    <div
                                        className="flex flex-col gap-1"
                                        data-id="717248c3-0f3e-5ab5-94b8-2615b78ad6ca"
                                    >
                                        <span
                                            className="font-medium text-neutral-50 text-sm leading-5"
                                            data-id="40348387-5b54-5719-a8b7-c36506f1b215"
                                        >
                                            María Fernanda Ruiz
                                        </span>
                                        <span
                                            className="text-[#9f9fa9] text-xs leading-4"
                                            data-id="8f2b32d7-2993-5a47-a6a3-abf7e0c87534"
                                        >
                                            Monto:
                                            <span
                                                className="font-semibold text-[#f0b100]"
                                                data-id="b272e5a7-5003-5bde-b1b1-4c70e266d9a3"
                                            >
                                                $15,000
                                            </span>
                                        </span>
                                    </div>
                                    <ChevronRight
                                        className="size-5 text-[#9f9fa9]"
                                        data-id="5a340e2b-5fe2-5230-b4ca-63e131162db1"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div
                        className="flex mt-4 px-4 flex-col gap-2"
                        data-id="6638e8e8-db9a-5e18-9d84-d14ace6a1162"
                    >
                        <Button
                            variant="outline"
                            className="rounded-xl text-neutral-50 border-white/10 border-0 border-solid w-full h-11"
                            data-id="1e0e4563-66eb-56b8-b648-ec0e9ba6a37e"
                        >
                            <FileText
                                className="size-4 mr-2"
                                data-id="93b52ccc-6b7b-56e0-96b4-43bcf2f7229a"
                            />
                            Ver Avalúo Original
                        </Button>
                    </div>
                </div>
                <div
                    className="fixed bg-zinc-900 border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid inset-x-0 bottom-0"
                    style={{ maxWidth: 375, margin: "0 auto" }}
                    data-id="7c3d9db9-780f-5685-91d6-50e9888ae8c4"
                >
                    <div
                        className="flex pt-2 pb-6 flex-row justify-around items-center"
                        data-id="a4323592-f33e-50d1-9624-a8f82be6106a"
                    >
                        <div
                            className="flex flex-col items-center gap-1"
                            data-id="f2d00391-91e3-5a58-be3e-1a26cb98057c"
                        >
                            <Home
                                className="size-5 text-[#9f9fa9]"
                                data-id="07eb4578-8583-543a-a7a7-e1c1e788339d"
                            />
                            <span
                                className="text-[#9f9fa9] text-xs leading-4"
                                data-id="096c65a2-f10c-5ace-9767-4ea6dbc58a56"
                            >
                                Inicio
                            </span>
                        </div>
                        <div
                            className="flex flex-col items-center gap-1"
                            data-id="57ee10d2-5d13-5ffb-a426-172e7529d61b"
                        >
                            <ClipboardList
                                className="size-5 text-[#9f9fa9]"
                                data-id="814c3d17-db68-5d10-8005-36277d11db28"
                            />
                            <span
                                className="text-[#9f9fa9] text-xs leading-4"
                                data-id="e4f3a9eb-57ec-505f-96ef-01b801878613"
                            >
                                Avalúos
                            </span>
                        </div>
                        <div
                            className="flex flex-col items-center gap-1"
                            data-id="ae5852fe-0306-531c-ae03-038c3c1b52e1"
                        >
                            <Users
                                className="size-5 text-[#9f9fa9]"
                                data-id="7d480b93-0b15-5a68-8485-807ceaea13bb"
                            />
                            <span
                                className="text-[#9f9fa9] text-xs leading-4"
                                data-id="8111b4d2-7583-5285-8cab-bb18319f7c3b"
                            >
                                Clientes
                            </span>
                        </div>
                        <div
                            className="flex flex-col items-center gap-1"
                            data-id="28f8fa9c-ec57-51bb-93de-2c94e57d6a18"
                        >
                            <HandCoins
                                className="size-5 text-[#9f9fa9]"
                                data-id="07538685-4aaa-567d-9325-a99d6e86dfa1"
                            />
                            <span
                                className="text-[#9f9fa9] text-xs leading-4"
                                data-id="a6ba47ab-0a18-553e-829a-8e3628135cc9"
                            >
                                Apartados
                            </span>
                        </div>
                        <div
                            className="flex flex-col items-center gap-1"
                            data-id="0ac7c3e0-205a-5edc-a654-bb5a2156717e"
                        >
                            <div
                                className="rounded-full bg-[#f0b100] flex px-3 py-1 items-center gap-1"
                                data-id="0b5ad178-4009-583c-a315-69dfc2eed946"
                            >
                                <Car
                                    className="size-5 text-[#733e0a]"
                                    data-id="66894ae8-2d89-5c4a-869e-2a5730742107"
                                />
                            </div>
                            <span
                                className="font-semibold text-[#f0b100] text-xs leading-4"
                                data-id="0162e01c-2737-5037-aa49-51feb30961e5"
                            >
                                Inventario
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
