import { useEffect } from "react";
import {
    ArrowLeft,
    ArrowRight,
    BookmarkCheck,
    Camera,
    ChevronDown,
    ClipboardList,
    Home,
    Info,
    MapPin,
    Users,
    Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function App() {
    return (
        <div>
            <div
                className="bg-zinc-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible"
                data-id="e6b78153-ac89-5347-877d-594143af63ff"
            >
                <div
                    className="relative flex flex-col w-full"
                    style={{ height: 812 }}
                    data-id="19b1dbaa-3b54-514d-874b-3e8ecb8e4737"
                >
                    <div
                        className="flex px-8 pt-8 pb-4 justify-between items-center"
                        data-id="2a1d2e68-3340-59c3-b747-089c5c13331c"
                    >
                        <div
                            className="flex items-center gap-4"
                            data-id="0d97d606-5b26-5a49-a187-145f8bae6082"
                        >
                            <ArrowLeft
                                className="size-6 text-neutral-50"
                                data-id="d7c6a732-d87c-554b-8c4b-fd71b9edc4d8"
                            />
                            <h1
                                className="font-bold text-neutral-50 text-xl leading-7"
                                data-id="eda15e56-90e9-5a06-b61c-317bde1acf63"
                            >
                                Nuevo Auto Frío
                            </h1>
                        </div>
                        <div
                            className="rounded-full bg-zinc-800 flex px-4 py-2 items-center gap-1"
                            data-id="e52b6648-ce45-57ee-8617-166ca4fc1511"
                        >
                            <span
                                className="font-semibold text-[#f0b100] text-xs leading-4"
                                data-id="518ab984-95da-5e53-9b03-6fc719f300bf"
                            >
                                Paso 1
                            </span>
                            <span
                                className="text-[#9f9fa9] text-xs leading-4"
                                data-id="b4747873-8a09-5887-83be-f24937d808de"
                            >
                                de 2
                            </span>
                        </div>
                    </div>
                    <div
                        className="overflow-y-auto px-8 pb-4 flex-1"
                        data-id="d0f744d4-9e1b-50f4-b3a8-dff6fefe90f7"
                    >
                        <div
                            className="flex flex-col gap-6"
                            data-id="fefb82bb-750d-5887-8ce5-f24fd3921b0a"
                        >
                            <div
                                className="flex flex-col gap-4"
                                data-id="d863cddc-05c3-54bb-8651-f6edf09ed16b"
                            >
                                <div
                                    className="flex flex-col gap-2"
                                    data-id="faa1c721-9652-527a-96dc-b5a5c7a876d0"
                                >
                                    <label
                                        className="font-medium text-[#9f9fa9] text-sm leading-5"
                                        data-id="5fb144e4-6239-55ab-aec3-70c098150c6b"
                                    >
                                        Marca
                                    </label>
                                    <div
                                        className="rounded-xl bg-zinc-800 border-white/10 border-1 border-solid flex p-4 justify-between items-center"
                                        data-id="94e7f9f7-036a-5b1c-92a7-d50845a3e16d"
                                    >
                                        <span
                                            className="text-[#9f9fa9] text-sm leading-5"
                                            data-id="c34b7d0c-edb7-5ae9-9991-2b9561f34e85"
                                        >
                                            Seleccionar marca
                                        </span>
                                        <ChevronDown
                                            className="size-4 text-[#9f9fa9]"
                                            data-id="04db8e9e-39d5-5425-a21c-2162d3362a5d"
                                        />
                                    </div>
                                </div>
                                <div
                                    className="flex flex-col gap-2"
                                    data-id="903a0959-99ac-5958-b538-8a07e6b6e560"
                                >
                                    <label
                                        className="font-medium text-[#9f9fa9] text-sm leading-5"
                                        data-id="5b8b5995-d0e0-579a-94f6-6553920aeb68"
                                    >
                                        Modelo
                                    </label>
                                    <div
                                        className="rounded-xl bg-zinc-800 border-white/10 border-1 border-solid flex p-4 items-center"
                                        data-id="55f2ca44-1ecd-51a2-a4ab-8b468279aafe"
                                    >
                                        <span
                                            className="text-[#9f9fa9] text-sm leading-5"
                                            data-id="8f68421b-ad26-53fa-afc7-5b4c9b246068"
                                        >
                                            Ej. Corolla, Civic, Sentra
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="flex gap-4"
                                    data-id="09eae145-e9da-5e2e-9dda-5f2a72b5e6d3"
                                >
                                    <div
                                        className="flex flex-col flex-1 gap-2"
                                        data-id="4f8d89f8-9e0c-5463-b001-a307eb9a1954"
                                    >
                                        <label
                                            className="font-medium text-[#9f9fa9] text-sm leading-5"
                                            data-id="12ba37ca-7f03-5902-bebf-17aa45d26e9d"
                                        >
                                            Año
                                        </label>
                                        <div
                                            className="rounded-xl bg-zinc-800 border-white/10 border-1 border-solid flex p-4 items-center"
                                            data-id="f669b52b-c662-57f0-9af3-0f84d9b8f866"
                                        >
                                            <span
                                                className="text-[#9f9fa9] text-sm leading-5"
                                                data-id="6422e0c9-9888-5efe-83b6-e2d902e09dfa"
                                            >
                                                2024
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="flex flex-col flex-1 gap-2"
                                        data-id="fd80ad60-f6d9-507d-af7b-ab6efd0dc72c"
                                    >
                                        <label
                                            className="font-medium text-[#9f9fa9] text-sm leading-5"
                                            data-id="533ba9fb-584b-5a1b-909a-bbfa9646cb3a"
                                        >
                                            Tipo
                                        </label>
                                        <div
                                            className="rounded-xl bg-zinc-800 border-white/10 border-1 border-solid flex p-4 justify-between items-center"
                                            data-id="bb82dc85-c76c-5ebe-b042-792560f986b3"
                                        >
                                            <span
                                                className="text-[#9f9fa9] text-sm leading-5"
                                                data-id="724cb485-3d15-5737-ab01-16c3489b0f8e"
                                            >
                                                Sedán
                                            </span>
                                            <ChevronDown
                                                className="size-4 text-[#9f9fa9]"
                                                data-id="007a5916-3e52-5721-8149-205d8cb0233f"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="flex gap-4"
                                    data-id="ed878cfb-1417-57d0-8001-f26fde882204"
                                >
                                    <div
                                        className="flex flex-col flex-1 gap-2"
                                        data-id="d7d6a16b-fa77-5af5-9ad6-1f6297bee440"
                                    >
                                        <label
                                            className="font-medium text-[#9f9fa9] text-sm leading-5"
                                            data-id="cb0bcdf9-cbbc-5307-ba8b-8bda1d0b374a"
                                        >
                                            Kilometraje
                                        </label>
                                        <div
                                            className="rounded-xl bg-zinc-800 border-white/10 border-1 border-solid flex p-4 items-center"
                                            data-id="100afaf1-a838-5261-8926-2d2d8bf53c86"
                                        >
                                            <span
                                                className="text-[#9f9fa9] text-sm leading-5"
                                                data-id="2d83a7ca-7a44-522f-9ea2-1fc93c063a9f"
                                            >
                                                0 km
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="flex flex-col flex-1 gap-2"
                                        data-id="2ff03715-6cbb-5a31-96f3-31ff42241abd"
                                    >
                                        <label
                                            className="font-medium text-[#9f9fa9] text-sm leading-5"
                                            data-id="02a3f3d5-b7ec-5b1a-9a14-31306d1f7074"
                                        >
                                            Color
                                        </label>
                                        <div
                                            className="rounded-xl bg-zinc-800 border-white/10 border-1 border-solid flex p-4 items-center"
                                            data-id="84e05ec5-5ff5-5e1d-95ab-923367c92c6e"
                                        >
                                            <span
                                                className="text-[#9f9fa9] text-sm leading-5"
                                                data-id="4385fdd3-e90e-5608-bb04-15500eb70a0e"
                                            >
                                                Blanco
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="flex gap-4"
                                    data-id="4a2101ac-8710-5667-8124-72d8163515ce"
                                >
                                    <div
                                        className="flex flex-col flex-1 gap-2"
                                        data-id="f1e3e2ef-53c9-5e2f-843a-cbb72074ff0d"
                                    >
                                        <label
                                            className="font-medium text-[#9f9fa9] text-sm leading-5"
                                            data-id="dc46a3ff-fd0d-5262-85e3-9b1159581aa1"
                                        >
                                            Precio de Compra
                                        </label>
                                        <div
                                            className="rounded-xl bg-zinc-800 border-white/10 border-1 border-solid flex p-4 items-center gap-2"
                                            data-id="8b434229-0f31-571a-83bf-7d9341d65a01"
                                        >
                                            <span
                                                className="text-[#9f9fa9] text-sm leading-5"
                                                data-id="7b2cdfa6-dda4-5c62-9fdc-7c3d9ae62419"
                                            >
                                                $
                                            </span>
                                            <span
                                                className="text-[#9f9fa9] text-sm leading-5"
                                                data-id="5f8a3af4-5cd3-50c3-8fad-fdbeaec63f63"
                                            >
                                                0.00
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="flex flex-col flex-1 gap-2"
                                        data-id="f388b19d-36b4-53e4-8d32-33f45d4f7351"
                                    >
                                        <label
                                            className="font-medium text-[#9f9fa9] text-sm leading-5"
                                            data-id="7c1a9e6e-c242-5db6-a4bb-9bb03ef51c33"
                                        >
                                            Precio Venta Est.
                                        </label>
                                        <div
                                            className="rounded-xl bg-zinc-800 border-white/10 border-1 border-solid flex p-4 items-center gap-2"
                                            data-id="5e9a1ff6-65a7-50b9-9357-fb9c407451dd"
                                        >
                                            <span
                                                className="text-[#9f9fa9] text-sm leading-5"
                                                data-id="2b4ae7b6-28f5-540c-ac28-3fdbd3c5395c"
                                            >
                                                $
                                            </span>
                                            <span
                                                className="text-[#9f9fa9] text-sm leading-5"
                                                data-id="0e04421e-4d80-5d07-a394-57ac97186929"
                                            >
                                                0.00
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="flex flex-col gap-2"
                                    data-id="6da4e73c-2833-5c7f-b6c3-646aaaa3d608"
                                >
                                    <label
                                        className="font-medium text-[#9f9fa9] text-sm leading-5"
                                        data-id="39be2858-6c0c-5521-b40d-e74df745d93d"
                                    >
                                        Ubicación / Sucursal
                                    </label>
                                    <div
                                        className="rounded-xl bg-zinc-800 border-white/10 border-1 border-solid flex p-4 justify-between items-center"
                                        data-id="a5bc1746-21a7-56bf-901c-93e69dfcc3e9"
                                    >
                                        <div
                                            className="flex items-center gap-2"
                                            data-id="b1880c07-f3c3-5323-a631-e31d0e282b9b"
                                        >
                                            <MapPin
                                                className="size-4 text-[#9f9fa9]"
                                                data-id="22d4914b-f020-561f-9c87-679e021c6c17"
                                            />
                                            <span
                                                className="text-[#9f9fa9] text-sm leading-5"
                                                data-id="12c4ff5a-0681-54d0-a93e-7f07c58706c2"
                                            >
                                                Seleccionar sucursal
                                            </span>
                                        </div>
                                        <ChevronDown
                                            className="size-4 text-[#9f9fa9]"
                                            data-id="2299ed62-d6e6-5d13-94ef-0e7f983a5ccf"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                className="flex flex-col gap-2"
                                data-id="9b31d232-36a2-5907-b6d1-31109dce0638"
                            >
                                <label
                                    className="font-medium text-[#9f9fa9] text-sm leading-5"
                                    data-id="a8305cb4-6c31-5093-9f02-b76ee886183e"
                                >
                                    Fotos del Vehículo
                                </label>
                                <div
                                    className="overflow-x-auto flex pb-2 gap-4"
                                    data-id="5de5d784-7f9d-5dad-a6d2-e4650206fa0d"
                                >
                                    <div
                                        className="flex-shrink-0 rounded-xl bg-zinc-800 border-white/10 border-2 border-dashed flex flex-col justify-center items-center gap-1 w-24 h-24"
                                        data-id="ce9db53c-046e-5047-99ab-075465ec20c3"
                                    >
                                        <Camera
                                            className="size-6 text-[#f0b100]"
                                            data-id="335f49e1-75e5-5361-8586-855a24ddbb5f"
                                        />
                                        <span
                                            className="text-[#9f9fa9] text-xs leading-4"
                                            data-id="99fd3c50-bb75-576e-a69c-cea9b385cfa5"
                                        >
                                            Frontal
                                        </span>
                                    </div>
                                    <div
                                        className="flex-shrink-0 rounded-xl bg-zinc-800 border-white/10 border-2 border-dashed flex flex-col justify-center items-center gap-1 w-24 h-24"
                                        data-id="54b8acea-c1e8-50f6-8b26-015dcd3f0148"
                                    >
                                        <Camera
                                            className="size-6 text-[#9f9fa9]"
                                            data-id="68fb746e-c814-5d5c-b489-a6a50782a843"
                                        />
                                        <span
                                            className="text-[#9f9fa9] text-xs leading-4"
                                            data-id="aa7dfaea-9253-5400-832a-47c0ada9f34d"
                                        >
                                            Lateral
                                        </span>
                                    </div>
                                    <div
                                        className="flex-shrink-0 rounded-xl bg-zinc-800 border-white/10 border-2 border-dashed flex flex-col justify-center items-center gap-1 w-24 h-24"
                                        data-id="1e17f390-4708-55fe-9544-fda65fcf5b06"
                                    >
                                        <Camera
                                            className="size-6 text-[#9f9fa9]"
                                            data-id="abfc4eba-1c7a-5e5d-8b17-6b4128778070"
                                        />
                                        <span
                                            className="text-[#9f9fa9] text-xs leading-4"
                                            data-id="1fd00dd3-ac69-507b-9923-14c78ed2dd3f"
                                        >
                                            Trasera
                                        </span>
                                    </div>
                                    <div
                                        className="flex-shrink-0 rounded-xl bg-zinc-800 border-white/10 border-2 border-dashed flex flex-col justify-center items-center gap-1 w-24 h-24"
                                        data-id="ee9ccb8e-c9a5-5e86-b4d7-bbe4f9e76f1f"
                                    >
                                        <Camera
                                            className="size-6 text-[#9f9fa9]"
                                            data-id="54caab5c-a7f8-5c11-95b6-4916225731dc"
                                        />
                                        <span
                                            className="text-[#9f9fa9] text-xs leading-4"
                                            data-id="c02372d6-dc63-5dae-a6d4-92dc51e141eb"
                                        >
                                            Interior
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="rounded-xl bg-zinc-800/50 flex p-4 items-center gap-2"
                                data-id="158da95b-eca2-5094-ac6a-f6ec72cad260"
                            >
                                <Info
                                    className="size-4 flex-shrink-0 text-[#f0b100]"
                                    data-id="2b13e93b-473e-5f22-ba8e-4fa757d11f8c"
                                />
                                <span
                                    className="text-[#9f9fa9] text-xs leading-4"
                                    data-id="c8ce9e4d-1a61-5ab9-b54c-2f1eb0d03734"
                                >
                                    Este auto se agregará al inventario con estatus
                                    <span
                                        className="font-semibold text-blue-400"
                                        data-id="1492f1c8-ab8c-5d06-94d2-5b260848f954"
                                    >
                                        Frío
                                    </span>
                                    sin avalúo asociado.
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        className="px-8 pt-2 pb-4"
                        data-id="16a31a2b-b830-5246-bd12-79f4e357c458"
                    >
                        <Button
                            className="font-semibold rounded-xl bg-[#f0b100] text-[#733e0a] text-base leading-6 p-4 w-full h-auto"
                            data-id="744bef59-97dd-5180-af65-5033c67151cb"
                        >
                            Continuar
                            <ArrowRight
                                className="size-4 ml-2"
                                data-id="7f2e0811-4e54-5164-a98d-8de85579c448"
                            />
                        </Button>
                    </div>
                    <div
                        className="bg-zinc-950 border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex px-4 pt-2 pb-6 justify-around items-center"
                        data-id="e266ec1e-337b-5ffb-a003-196d1f2352c3"
                    >
                        <div
                            className="flex py-1 flex-col items-center gap-1"
                            data-id="9116b1e3-1dba-5fea-aa60-0fb657915fd1"
                        >
                            <Home
                                className="size-5 text-[#9f9fa9]"
                                data-id="8129b8ac-7c35-59cd-9fcc-b87bbf00d65a"
                            />
                            <span
                                className="text-[#9f9fa9] text-xs leading-4"
                                data-id="1f7ef2a5-6bd1-59f6-920b-9665b44eb2af"
                            >
                                Inicio
                            </span>
                        </div>
                        <div
                            className="flex py-1 flex-col items-center gap-1"
                            data-id="46f2c44f-dc61-5a3a-83a9-61740d4b015d"
                        >
                            <ClipboardList
                                className="size-5 text-[#9f9fa9]"
                                data-id="635ede6d-53ab-5a6b-bf60-abdc7e1b1857"
                            />
                            <span
                                className="text-[#9f9fa9] text-xs leading-4"
                                data-id="9381e17e-6ae7-5c5d-8158-4d2363f81a6d"
                            >
                                Avalúos
                            </span>
                        </div>
                        <div
                            className="flex py-1 flex-col items-center gap-1"
                            data-id="e0ddf9c4-8571-5a8f-a8b9-13cd643ece48"
                        >
                            <Users
                                className="size-5 text-[#9f9fa9]"
                                data-id="544bdcf4-61c6-5d8b-b01c-44cd77ef761f"
                            />
                            <span
                                className="text-[#9f9fa9] text-xs leading-4"
                                data-id="79022e4d-aa77-5629-8e13-486699291e22"
                            >
                                Clientes
                            </span>
                        </div>
                        <div
                            className="flex py-1 flex-col items-center gap-1"
                            data-id="d93d781b-ea20-5a9c-af30-1f92215a70a5"
                        >
                            <BookmarkCheck
                                className="size-5 text-[#9f9fa9]"
                                data-id="5fbcae71-2be6-54a1-9bf1-6ed7bc2e245c"
                            />
                            <span
                                className="text-[#9f9fa9] text-xs leading-4"
                                data-id="9a7b160a-a1a3-557a-839f-f92e94846cdf"
                            >
                                Apartados
                            </span>
                        </div>
                        <div
                            className="rounded-full bg-[#f0b100] flex px-4 py-1 flex-col items-center gap-1"
                            data-id="642fd3aa-68be-5dbe-a6c1-68a194cee1e4"
                        >
                            <Warehouse
                                className="size-5 text-[#733e0a]"
                                data-id="0475e5ca-eee5-5d91-a0dd-853d87b0b72a"
                            />
                            <span
                                className="font-semibold text-[#733e0a] text-xs leading-4"
                                data-id="01b6f9b7-7e3d-501f-92f9-c0d8c23e539f"
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
