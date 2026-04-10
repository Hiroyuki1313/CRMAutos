import { useEffect } from "react";
import {
    ArrowLeft,
    Car,
    Check,
    ClipboardList,
    HandCoins,
    Home,
    Phone,
    Upload,
    Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function App() {
    return (
        <div>
            <div
                className="bg-zinc-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible"
                style={{ fontFamily: "sans-serif", width: 375, minHeight: 812 }}
                data-id="56ce1a59-c498-5b12-a2b7-39f5104aaa3b"
            >
                <div
                    className="flex flex-col"
                    style={{ minHeight: 812 }}
                    data-id="75bc49d4-dd4c-543a-b38e-187299d9f490"
                >
                    <div
                        className="flex p-4 items-center gap-4"
                        data-id="c23a5de6-d860-5d55-8b4e-0fec3523d78c"
                    >
                        <div
                            className="rounded-full bg-zinc-800 flex justify-center items-center w-8 h-8"
                            data-id="61751342-560e-53fe-af0e-3edf02709517"
                        >
                            <ArrowLeft
                                className="size-5 text-neutral-50"
                                data-id="a4a420ed-97b5-5a92-b8ed-1d1f9b54f9ef"
                            />
                        </div>
                        <div
                            className="flex-1"
                            data-id="d8f16c49-d458-555f-b8b8-acde90812b84"
                        >
                            <div
                                className="flex items-center gap-2"
                                data-id="c86239a5-3bf4-55a6-ae7f-3db0689bbfe1"
                            >
                                <span
                                    className="font-bold text-neutral-50 text-lg leading-7"
                                    data-id="ebf9cf1e-c92e-5c10-bd40-7ae64da04df7"
                                >
                                    Roberto Méndez
                                </span>
                                <span
                                    className="font-semibold rounded-full bg-[#f0b100]/20 text-[#f0b100] text-xs leading-4 px-2 py-0.5"
                                    data-id="f41d692f-8c96-5b48-b121-b51612c754b8"
                                >
                                    Facebook
                                </span>
                            </div>
                            <div
                                className="flex mt-0.5 items-center gap-1"
                                data-id="3221b70a-dff1-5840-ba36-91e96f6c7175"
                            >
                                <Phone
                                    className="size-3 text-[#9f9fa9]"
                                    data-id="d46c074e-8e36-5662-b657-74718fc116d4"
                                />
                                <span
                                    className="text-[#9f9fa9] text-sm leading-5"
                                    data-id="123987b1-8ce5-5c9a-8498-cbde2d206c6f"
                                >
                                    +52 614 555 0123
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="px-4" data-id="1e5bdcc9-5b16-52cf-ad55-fbf52e956484">
                        <div
                            className="border-white/10 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex"
                            data-id="ac7fd703-9490-55b1-b915-d7ecce846946"
                        >
                            <button
                                className="font-medium text-center text-[#9f9fa9] text-sm leading-5 pb-2 flex-1"
                                data-id="99e97066-138e-5cfd-bb4b-0ce885e0a537"
                            >
                                Info
                            </button>
                            <button
                                className="font-bold text-center text-[#f0b100] text-sm leading-5 pb-2 flex-1"
                                style={{
                                    borderBottomWidth: 2,
                                    borderBottomColor: "oklch(0.795 0.184 86.047)",
                                }}
                                data-id="8424b0b7-3e5c-53dc-8c16-ce86e72993de"
                            >
                                Documentos
                            </button>
                        </div>
                    </div>
                    <div
                        className="p-4 flex-1 overflow-auto"
                        data-id="9e98db81-d626-5323-a98e-5bc850478200"
                    >
                        <div
                            className="grid grid-cols-2 gap-4"
                            data-id="4a691750-0a9f-51b4-92da-5ee186dd2af1"
                        >
                            <Card
                                className="relative rounded-xl bg-zinc-900 border-white/10 border-0 border-solid p-2 gap-2 overflow-hidden"
                                data-id="a55928f1-eff0-5218-a642-6580e3e150f3"
                            >
                                <div
                                    className="relative rounded-lg overflow-hidden"
                                    style={{ height: 100 }}
                                    data-id="b91ad8d4-1d1a-5fbd-9949-7fc3431e5ddb"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1767216427262-ce74ba565c3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxNZXhpY2FuJTIwSUQlMjBjYXJkJTIwZG9jdW1lbnR8ZW58MXwwfHx8MTc3NTc0OTg1OXww&ixlib=rb-4.1.0&q=80&w=400"
                                        alt="INE Frente"
                                        className="object-cover w-full h-full"
                                        data-photoid="OqDx0pa6VXI"
                                        data-authorname="Annie M"
                                        data-authorurl="https://unsplash.com/@alexa_filmvibes"
                                        data-blurhash="L56kO}_4%2nNKRpKI;IAXT%2R*Ri"
                                        data-id="6df63242-5328-52b6-a07c-6d054e1048ec"
                                    />
                                </div>
                                <div
                                    className="rounded-full bg-green-500 flex absolute right-2 top-2 justify-center items-center w-5 h-5"
                                    data-id="6f137387-de4f-5c12-a097-3646675cbf73"
                                >
                                    <Check
                                        className="size-3 text-white"
                                        data-id="13eb29eb-f9bb-5cc2-a20d-4e0239b97e32"
                                    />
                                </div>
                                <CardContent
                                    className="p-0 gap-0"
                                    data-id="f1c85d3f-f963-5a41-819d-4bcaa4de6017"
                                >
                                    <span
                                        className="font-semibold text-neutral-50 text-xs leading-4"
                                        data-id="d95e12c0-6cff-5c91-9203-24d31d7553e4"
                                    >
                                        INE (Frente)
                                    </span>
                                </CardContent>
                            </Card>
                            <Card
                                className="relative rounded-xl bg-zinc-900 border-white/10 border-0 border-solid p-2 gap-2 overflow-hidden"
                                data-id="da8bb929-2243-5fcf-93c0-682197173ea5"
                            >
                                <div
                                    className="relative rounded-lg overflow-hidden"
                                    style={{ height: 100 }}
                                    data-id="a2e6c344-56a5-5958-bd00-ac13fccbd1c8"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1767216427262-ce74ba565c3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxNZXhpY2FuJTIwSUQlMjBjYXJkJTIwZG9jdW1lbnR8ZW58MXwwfHx8MTc3NTc0OTg1OXww&ixlib=rb-4.1.0&q=80&w=400"
                                        alt="INE Reverso"
                                        className="object-cover w-full h-full"
                                        data-photoid="OqDx0pa6VXI"
                                        data-authorname="Annie M"
                                        data-authorurl="https://unsplash.com/@alexa_filmvibes"
                                        data-blurhash="L56kO}_4%2nNKRpKI;IAXT%2R*Ri"
                                        data-id="d89eff41-208c-5457-8107-0db6caa2a143"
                                    />
                                </div>
                                <div
                                    className="rounded-full bg-green-500 flex absolute right-2 top-2 justify-center items-center w-5 h-5"
                                    data-id="d27ce2fb-08cc-5888-8244-91089cd25ac0"
                                >
                                    <Check
                                        className="size-3 text-white"
                                        data-id="160a22a1-6d1c-5230-b648-f91c400ced51"
                                    />
                                </div>
                                <CardContent
                                    className="p-0 gap-0"
                                    data-id="54931ecd-0dc2-5bee-b4d0-335e52756c05"
                                >
                                    <span
                                        className="font-semibold text-neutral-50 text-xs leading-4"
                                        data-id="7e574e8e-5109-5a73-8fc6-8f0152913407"
                                    >
                                        INE (Reverso)
                                    </span>
                                </CardContent>
                            </Card>
                            <Card
                                className="relative rounded-xl bg-zinc-900 border-white/10 border-0 border-solid p-2 gap-2 overflow-hidden"
                                data-id="6d8278b0-3f50-5432-9ea6-cc61274e50fa"
                            >
                                <div
                                    className="relative rounded-lg overflow-hidden"
                                    style={{ height: 100 }}
                                    data-id="2bb9e118-109e-5aa7-9f76-4687b130077d"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1578016981482-d4dd3db297b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHx1dGlsaXR5JTIwYmlsbCUyMGRvY3VtZW50fGVufDF8MHx8fDE3NzU3NDk4NTl8MA&ixlib=rb-4.1.0&q=80&w=400"
                                        alt="Comprobante de Domicilio"
                                        className="object-cover w-full h-full"
                                        data-photoid="1LTLB6jS1Gk"
                                        data-authorname="Claudio Schwarz"
                                        data-authorurl="https://unsplash.com/@purzlbaum"
                                        data-blurhash="L5KU$d$%E0t7~qRjIVV@M_NGWVoM"
                                        data-id="8e27c95c-68a0-52a5-8d44-9c17a930aeba"
                                    />
                                </div>
                                <div
                                    className="rounded-full bg-green-500 flex absolute right-2 top-2 justify-center items-center w-5 h-5"
                                    data-id="371b5968-80ea-5288-81a3-ef6e6e116fb2"
                                >
                                    <Check
                                        className="size-3 text-white"
                                        data-id="534d05f7-f9a9-5957-ae91-13a64d0a601a"
                                    />
                                </div>
                                <CardContent
                                    className="p-0 gap-0"
                                    data-id="34570262-8a17-5fdf-83ac-2c2211bb1445"
                                >
                                    <span
                                        className="font-semibold text-neutral-50 text-xs leading-4"
                                        data-id="a4bbe836-64af-5e5e-8064-2e7d76bfcad2"
                                    >
                                        Comprobante de Domicilio
                                    </span>
                                </CardContent>
                            </Card>
                            <Card
                                className="relative rounded-xl bg-zinc-900 border-white/10 border-0 border-solid p-2 gap-2 overflow-hidden"
                                data-id="e977bd2e-cf99-5c91-badc-b6077494cf4f"
                            >
                                <div
                                    className="rounded-lg flex flex-col justify-center items-center gap-2"
                                    style={{
                                        height: 100,
                                        borderWidth: 2,
                                        borderStyle: "dashed",
                                        borderColor: "oklch(0.705 0.015 286.067)",
                                    }}
                                    data-id="d2b5ee87-5202-5398-8883-30f2bcca6615"
                                >
                                    <Upload
                                        className="size-6 text-[#9f9fa9]"
                                        data-id="3503d3da-5a31-56b4-9273-2f53e8b584fc"
                                    />
                                    <span
                                        className="text-[#9f9fa9] text-xs leading-4"
                                        data-id="b30bd68c-df5f-5bae-9370-385c7e63cd38"
                                    >
                                        Subir
                                    </span>
                                </div>
                                <CardContent
                                    className="p-0 gap-0"
                                    data-id="6ffc1ff1-a3f5-5989-a04d-ad4f58ab9e2c"
                                >
                                    <span
                                        className="font-semibold text-neutral-50 text-xs leading-4"
                                        data-id="cd6f1fd6-0a53-5a45-be57-dba23090336a"
                                    >
                                        Estados de Cuenta
                                    </span>
                                </CardContent>
                            </Card>
                            <Card
                                className="relative rounded-xl bg-zinc-900 border-white/10 border-0 border-solid p-2 gap-2 overflow-hidden"
                                data-id="e9e28ad6-ecc6-5e95-885a-fed2d5bfc108"
                            >
                                <div
                                    className="rounded-lg flex flex-col justify-center items-center gap-2"
                                    style={{
                                        height: 100,
                                        borderWidth: 2,
                                        borderStyle: "dashed",
                                        borderColor: "oklch(0.705 0.015 286.067)",
                                    }}
                                    data-id="bbd61a72-f2e2-5aa2-ae14-ccf9f271bb1a"
                                >
                                    <Upload
                                        className="size-6 text-[#9f9fa9]"
                                        data-id="3dc0826a-0203-54d9-88ff-828477d55367"
                                    />
                                    <span
                                        className="text-[#9f9fa9] text-xs leading-4"
                                        data-id="e6cb14fa-b2ee-571f-82cc-c797509544eb"
                                    >
                                        Subir
                                    </span>
                                </div>
                                <CardContent
                                    className="p-0 gap-0"
                                    data-id="095ed2f2-2439-54a9-8feb-8df93bf8e798"
                                >
                                    <span
                                        className="font-semibold text-neutral-50 text-xs leading-4"
                                        data-id="1ca8e56c-2f56-5e1d-87bd-6f9c26806ca5"
                                    >
                                        Seguro
                                    </span>
                                </CardContent>
                            </Card>
                        </div>
                        <div
                            className="mt-4"
                            data-id="91930bfa-87e7-5e71-975c-3136800803f8"
                        >
                            <Button
                                className="font-bold rounded-xl bg-[#f0b100] text-[#733e0a] text-sm leading-5 w-full h-12"
                                data-id="19569575-4f4a-527e-b762-9785b6ce4d0a"
                            >
                                + Agregar Documento
                            </Button>
                        </div>
                        <div
                            className="my-4"
                            data-id="2fe47beb-9fb6-56d9-b496-1fbd036dfabd"
                        >
                            <Button
                                className="shadow-lg font-bold rounded-2xl bg-[#f0b100] text-[#733e0a] text-base leading-6 w-full h-14"
                                data-id="73c5b952-666c-5c72-8d8f-4e1998769d27"
                            >
                                Generar Apartado
                            </Button>
                        </div>
                    </div>
                    <div
                        className="bg-zinc-900 border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid p-2"
                        data-id="6e4cb4e7-410d-5d18-8289-2a57cc4dd281"
                    >
                        <div
                            className="flex flex-row justify-around items-center"
                            data-id="970480a6-45a3-55b5-b3c4-056457501b10"
                        >
                            <div
                                className="flex px-2 py-1 flex-col items-center gap-1"
                                data-id="0ce24495-109c-5017-9d3f-5217339bd7c4"
                            >
                                <Home
                                    className="size-5 text-[#9f9fa9]"
                                    data-id="614b2760-5a53-53c3-94a1-14d07ca7cd13"
                                />
                                <span
                                    className="text-[#9f9fa9] text-xs leading-4"
                                    data-id="a7ace700-d3ad-5d33-9985-8820083c92d3"
                                >
                                    Inicio
                                </span>
                            </div>
                            <div
                                className="flex px-2 py-1 flex-col items-center gap-1"
                                data-id="f4af5ca0-74b8-530c-b65e-8faa7de1ebf6"
                            >
                                <ClipboardList
                                    className="size-5 text-[#9f9fa9]"
                                    data-id="d0987459-7175-5800-ba54-85e89cff1d60"
                                />
                                <span
                                    className="text-[#9f9fa9] text-xs leading-4"
                                    data-id="410cd78e-1f40-5b97-bfbe-5c61e53235a1"
                                >
                                    Avalúos
                                </span>
                            </div>
                            <div
                                className="rounded-xl bg-[#f0b100] flex px-2 py-1 flex-col items-center gap-1"
                                data-id="f106375d-076f-50cc-b667-b8e9c4c119c5"
                            >
                                <Users
                                    className="size-5 text-[#733e0a]"
                                    data-id="58ec9e00-a97a-5457-9b2f-a879c24b63dd"
                                />
                                <span
                                    className="font-bold text-[#733e0a] text-xs leading-4"
                                    data-id="c470f604-dc5d-5b41-bade-23d324cb39c8"
                                >
                                    Clientes
                                </span>
                            </div>
                            <div
                                className="flex px-2 py-1 flex-col items-center gap-1"
                                data-id="cdf791d5-8981-5c11-9944-6bbe73334a88"
                            >
                                <HandCoins
                                    className="size-5 text-[#9f9fa9]"
                                    data-id="2eed84f2-2c27-591b-aa0a-3424a5cae693"
                                />
                                <span
                                    className="text-[#9f9fa9] text-xs leading-4"
                                    data-id="1e3a038a-5e59-5b05-9b26-51a45fd7db6c"
                                >
                                    Apartados
                                </span>
                            </div>
                            <div
                                className="flex px-2 py-1 flex-col items-center gap-1"
                                data-id="c05739da-0612-5eb3-98b6-840cb8165f7e"
                            >
                                <Car
                                    className="size-5 text-[#9f9fa9]"
                                    data-id="1e2d33aa-8019-5138-bdbf-046fb1968446"
                                />
                                <span
                                    className="text-[#9f9fa9] text-xs leading-4"
                                    data-id="af9eceaa-30e4-52e7-8a46-cb688944e1fe"
                                >
                                    Inventario
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
