import { useEffect } from "react";
import {
    Car,
    ChevronRight,
    ClipboardList,
    HandCoins,
    Home,
    Plus,
    Search,
    Users,
} from "lucide-react";

export default function App() {
    return (
        <div>
            <div
                className="bg-zinc-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible"
                style={{ fontFamily: "sans-serif" }}
                data-id="fcea4f32-fd91-53b1-af66-392ddf6dc09b"
            >
                <div
                    className="flex flex-col"
                    style={{ minHeight: 812 }}
                    data-id="d5146a18-dcae-53d2-8333-705a17d773c8"
                >
                    <div
                        className="overflow-y-auto flex px-6 pt-6 pb-4 flex-col flex-1 gap-4"
                        data-id="e18c77c8-a3f5-5a7d-b287-1f905c54b932"
                    >
                        <div
                            className="flex pt-8 justify-between items-center"
                            data-id="046cb61e-15f7-5748-bdda-e77ca1f54882"
                        >
                            <h1
                                className="font-bold text-neutral-50 text-2xl leading-8"
                                data-id="db4de164-2e29-5a1e-af82-10de6f80b019"
                            >
                                Apartados
                            </h1>
                            <button
                                className="font-semibold rounded-full bg-[#f0b100] text-[#733e0a] text-sm leading-5 flex px-4 py-2 items-center gap-1"
                                data-id="8d2e17e1-8f70-5d32-91ae-073045f30ba1"
                            >
                                <Plus
                                    className="size-4"
                                    data-id="fbde64f0-bab4-57b7-8d3c-f1c88ee5572d"
                                />
                                <span data-id="184dab48-bb1a-5dd5-8820-ce0705ac3644">
                                    Nuevo
                                </span>
                            </button>
                        </div>
                        <div
                            className="relative"
                            data-id="ce5d1124-8ab9-59d9-b9b9-d39af170e4e7"
                        >
                            <Search
                                className="size-4 top-1/2 -translate-y-1/2 text-[#9f9fa9] absolute left-3"
                                data-id="143f7e7c-211d-5e06-9906-8b4fd5ca3136"
                            />
                            <input
                                type="text"
                                placeholder="Buscar por cliente o auto"
                                className="outline-none rounded-xl bg-zinc-800 text-neutral-50 text-sm leading-5 border-white/10 border-1 border-solid pl-10 pr-4 py-3 w-full"
                                data-id="051f1acc-fc91-5131-a977-bd842c631f54"
                            />
                        </div>
                        <div
                            className="flex flex-col gap-2"
                            data-id="e186e935-c2ae-5c00-bc05-b84fcd56120f"
                        >
                            <span
                                className="font-medium uppercase text-[#9f9fa9] text-xs leading-4 tracking-wide"
                                data-id="a68407e9-d1b5-5796-8886-381b30e68d65"
                            >
                                Próximo Seguimiento
                            </span>
                            <div
                                className="overflow-x-auto flex gap-2"
                                data-id="0fe837d1-a111-5c4f-8a27-9408e3755a4c"
                            >
                                <span
                                    className="whitespace-nowrap font-semibold rounded-full bg-[#f0b100] text-[#733e0a] text-xs leading-4 px-4 py-1.5"
                                    data-id="e8b3a21e-a345-5889-b20d-cb6eeec6fc40"
                                >
                                    Todos
                                </span>
                                <span
                                    className="whitespace-nowrap font-medium rounded-full text-[#9f9fa9] text-xs leading-4 border-white/10 border-1 border-solid px-4 py-1.5"
                                    data-id="1ce9bfac-3d93-5268-97ff-277d5e80a7ac"
                                >
                                    Hoy
                                </span>
                                <span
                                    className="whitespace-nowrap font-medium rounded-full text-[#9f9fa9] text-xs leading-4 border-white/10 border-1 border-solid px-4 py-1.5"
                                    data-id="cce01b58-1fa0-52e5-a33d-c54903f02e68"
                                >
                                    Esta Semana
                                </span>
                                <span
                                    className="whitespace-nowrap font-medium rounded-full text-[#9f9fa9] text-xs leading-4 border-white/10 border-1 border-solid px-4 py-1.5"
                                    data-id="45eaa8b0-0ad6-52e7-93c8-c82e10b449cd"
                                >
                                    Vencidos
                                </span>
                            </div>
                        </div>
                        <div
                            className="flex flex-col gap-4"
                            data-id="fcff119e-3187-5cae-aaca-322e45865d88"
                        >
                            <div
                                className="rounded-2xl bg-zinc-900 border-white/10 border-1 border-solid flex p-4 items-center gap-2"
                                data-id="9f64b7b0-46f9-5d37-bb6e-a700a06ddaee"
                            >
                                <div
                                    className="flex flex-col flex-1 gap-2"
                                    data-id="772abe32-64d6-5400-b9c3-2b53c79c73fc"
                                >
                                    <div
                                        className="flex justify-between items-center"
                                        data-id="46c07e27-6c53-59af-bc1c-f66015c981aa"
                                    >
                                        <span
                                            className="font-bold text-neutral-50 text-sm leading-5"
                                            data-id="5e2a91c1-60bc-561a-93b3-cad2fb6e11c9"
                                        >
                                            María Fernanda Ruiz
                                        </span>
                                        <span
                                            className="font-bold rounded-full bg-[#f0b100]/20 text-[#f0b100] text-xs leading-4 px-2.5 py-0.5"
                                            data-id="38a7f583-6a93-59d3-a33a-fe597a85d1ff"
                                        >
                                            $15,000
                                        </span>
                                    </div>
                                    <span
                                        className="text-neutral-50/80 text-sm leading-5"
                                        data-id="10a8b187-fa40-56f7-a5c2-5f94201f3da0"
                                    >
                                        Mazda CX-5 2023 · Rojo
                                    </span>
                                    <div
                                        className="flex gap-2"
                                        data-id="13aa2f93-f4f0-5d42-a06d-8acc28ec128d"
                                    >
                                        <span
                                            className="font-medium rounded-full bg-green-600/80 text-white text-xs leading-4 px-2 py-0.5"
                                            data-id="af938541-8ce3-5729-8dbf-f2e736f9825d"
                                        >
                                            Cita ✓
                                        </span>
                                        <span
                                            className="font-medium rounded-full bg-green-600/80 text-white text-xs leading-4 px-2 py-0.5"
                                            data-id="bba33fd3-1ec9-543d-9830-1fa64a50baae"
                                        >
                                            Demo ✓
                                        </span>
                                    </div>
                                    <span
                                        className="text-[#9f9fa9] text-xs leading-4"
                                        data-id="fa1a5182-044c-5ff0-9029-dc3f08e82954"
                                    >
                                        Próximo seguimiento:
                                        <span
                                            className="text-neutral-50/70"
                                            data-id="5f958efe-8c66-5742-90cf-ddffbbd3aedf"
                                        >
                                            15 Jun 2025
                                        </span>
                                    </span>
                                </div>
                                <ChevronRight
                                    className="size-5 flex-shrink-0 text-[#9f9fa9]"
                                    data-id="74218237-1769-5656-93a3-86ebb25569b1"
                                />
                            </div>
                            <div
                                className="rounded-2xl bg-zinc-900 border-white/10 border-1 border-solid flex p-4 items-center gap-2"
                                data-id="cc87dcc5-0479-586f-96e1-97a37845b0e4"
                            >
                                <div
                                    className="flex flex-col flex-1 gap-2"
                                    data-id="7982bb9c-8b2e-55f9-b94a-750a9b9c2ff5"
                                >
                                    <div
                                        className="flex justify-between items-center"
                                        data-id="70ee686e-4519-5c54-bc2e-2603af3a8103"
                                    >
                                        <span
                                            className="font-bold text-neutral-50 text-sm leading-5"
                                            data-id="b7be3e49-f379-5bd4-97d6-d6d377293da1"
                                        >
                                            Carlos Mendoza López
                                        </span>
                                        <span
                                            className="font-bold rounded-full bg-[#f0b100]/20 text-[#f0b100] text-xs leading-4 px-2.5 py-0.5"
                                            data-id="0d187b4f-791b-5ef2-b641-24b8390ef35b"
                                        >
                                            $20,000
                                        </span>
                                    </div>
                                    <span
                                        className="text-neutral-50/80 text-sm leading-5"
                                        data-id="ca589bac-fdbb-55f7-ba61-9d34180d1a07"
                                    >
                                        Toyota RAV4 2022 · Blanco
                                    </span>
                                    <div
                                        className="flex gap-2"
                                        data-id="cf2d8bc3-ce1d-5b10-a557-f15623308492"
                                    >
                                        <span
                                            className="font-medium rounded-full bg-green-600/80 text-white text-xs leading-4 px-2 py-0.5"
                                            data-id="cf2da195-2f12-5f7f-a77e-0625351c79fa"
                                        >
                                            Cita ✓
                                        </span>
                                        <span
                                            className="font-medium rounded-full bg-zinc-800 text-[#9f9fa9] text-xs leading-4 px-2 py-0.5"
                                            data-id="e06531eb-5220-5f93-b776-cb62fc8d8629"
                                        >
                                            Demo ✗
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center gap-1.5"
                                        data-id="17a4a28c-d41f-546b-9a6d-dd68139c8210"
                                    >
                                        <span
                                            className="size-2 rounded-full bg-[#f0b100]"
                                            data-id="38089242-f84d-5de3-9c30-9963758740e2"
                                        />
                                        <span
                                            className="text-[#9f9fa9] text-xs leading-4"
                                            data-id="4ae69a96-575f-50c0-8511-d29c1302308d"
                                        >
                                            Próximo seguimiento:
                                            <span
                                                className="font-medium text-[#f0b100]"
                                                data-id="45939a13-006d-5047-ac7a-a037a9d94481"
                                            >
                                                Hoy
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight
                                    className="size-5 flex-shrink-0 text-[#9f9fa9]"
                                    data-id="2a0b3c75-6e6b-55a6-8209-a7bcbe6d64ea"
                                />
                            </div>
                            <div
                                className="rounded-2xl bg-zinc-900 border-white/10 border-1 border-solid flex p-4 items-center gap-2"
                                data-id="ba3c1fff-a50b-53bf-98e8-da53f534814e"
                            >
                                <div
                                    className="flex flex-col flex-1 gap-2"
                                    data-id="954c924f-47bc-56af-97c3-229b8a0bc636"
                                >
                                    <div
                                        className="flex justify-between items-center"
                                        data-id="4678f703-7932-55b4-bfc5-676ed1b18ba8"
                                    >
                                        <span
                                            className="font-bold text-neutral-50 text-sm leading-5"
                                            data-id="cf1c79a9-1709-58aa-b102-9807d1655636"
                                        >
                                            Ana Sofía Herrera
                                        </span>
                                        <span
                                            className="font-bold rounded-full bg-[#f0b100]/20 text-[#f0b100] text-xs leading-4 px-2.5 py-0.5"
                                            data-id="aab55ec0-21f4-52d3-ae5b-2f8182dee385"
                                        >
                                            $10,000
                                        </span>
                                    </div>
                                    <span
                                        className="text-neutral-50/80 text-sm leading-5"
                                        data-id="ec18ceac-a36d-58b1-a72a-13d4260a6ac5"
                                    >
                                        Honda CR-V 2021 · Negro
                                    </span>
                                    <div
                                        className="flex gap-2"
                                        data-id="980dbf75-6856-502c-b05f-ba7df85ca4d7"
                                    >
                                        <span
                                            className="font-medium rounded-full bg-zinc-800 text-[#9f9fa9] text-xs leading-4 px-2 py-0.5"
                                            data-id="27b39ce6-fd21-5923-be41-59e5922f9cbb"
                                        >
                                            Cita ✗
                                        </span>
                                        <span
                                            className="font-medium rounded-full bg-zinc-800 text-[#9f9fa9] text-xs leading-4 px-2 py-0.5"
                                            data-id="7e44f344-0713-51ae-8228-3eb2ead306a3"
                                        >
                                            Demo ✗
                                        </span>
                                    </div>
                                    <span
                                        className="font-medium text-[#ff6467] text-xs leading-4"
                                        data-id="1d40a54f-8ff4-521e-aab0-24c0c657a17c"
                                    >
                                        Vencido · 8 Jun 2025
                                    </span>
                                </div>
                                <ChevronRight
                                    className="size-5 flex-shrink-0 text-[#9f9fa9]"
                                    data-id="81bdc8f3-d814-5cee-b003-5bc816b3bca9"
                                />
                            </div>
                            <div
                                className="rounded-2xl bg-zinc-900 border-white/10 border-1 border-solid flex p-4 items-center gap-2"
                                data-id="7f97d390-b812-594a-a15f-9f53bb5955bc"
                            >
                                <div
                                    className="flex flex-col flex-1 gap-2"
                                    data-id="4477d601-548a-5827-9f3e-15d2c58d09cd"
                                >
                                    <div
                                        className="flex justify-between items-center"
                                        data-id="5f0db6d7-2b69-56c5-9e53-89c1091a265e"
                                    >
                                        <span
                                            className="font-bold text-neutral-50 text-sm leading-5"
                                            data-id="bcd76c3f-aee0-5c04-8e74-ee4d80eb9102"
                                        >
                                            Roberto García Vega
                                        </span>
                                        <span
                                            className="font-bold rounded-full bg-[#f0b100]/20 text-[#f0b100] text-xs leading-4 px-2.5 py-0.5"
                                            data-id="58205a72-f90b-5d58-9f1f-e848958aaec3"
                                        >
                                            $25,000
                                        </span>
                                    </div>
                                    <span
                                        className="text-neutral-50/80 text-sm leading-5"
                                        data-id="b01bcee2-97b1-57be-a97f-c08935befea2"
                                    >
                                        Nissan Kicks 2024 · Gris
                                    </span>
                                    <div
                                        className="flex gap-2"
                                        data-id="9e7062bd-d6cb-5438-91b0-7b0dd54612be"
                                    >
                                        <span
                                            className="font-medium rounded-full bg-green-600/80 text-white text-xs leading-4 px-2 py-0.5"
                                            data-id="1b98a5fb-86d1-5dda-8db4-de89ce6520fa"
                                        >
                                            Cita ✓
                                        </span>
                                        <span
                                            className="font-medium rounded-full bg-green-600/80 text-white text-xs leading-4 px-2 py-0.5"
                                            data-id="f65c3fd9-efdc-50e9-9fd9-734db1386cd4"
                                        >
                                            Demo ✓
                                        </span>
                                    </div>
                                    <span
                                        className="text-[#9f9fa9] text-xs leading-4"
                                        data-id="9b6935e1-1d62-5635-b2ad-b27fa0b9382f"
                                    >
                                        Próximo seguimiento:
                                        <span
                                            className="text-neutral-50/70"
                                            data-id="974dfc87-6328-5358-8517-8148afff8546"
                                        >
                                            20 Jun 2025
                                        </span>
                                    </span>
                                </div>
                                <ChevronRight
                                    className="size-5 flex-shrink-0 text-[#9f9fa9]"
                                    data-id="e917ec94-12e7-5fe1-afde-96587d683f53"
                                />
                            </div>
                            <div
                                className="rounded-2xl bg-zinc-900 border-white/10 border-1 border-solid flex p-4 items-center gap-2"
                                data-id="49905e23-0c8a-537e-8b4a-bfb6f77c2a3a"
                            >
                                <div
                                    className="flex flex-col flex-1 gap-2"
                                    data-id="7f853114-18c7-5e6a-9cd4-8dec41c4360e"
                                >
                                    <div
                                        className="flex justify-between items-center"
                                        data-id="70d00c24-d9de-530b-ae72-57bd929e80a6"
                                    >
                                        <span
                                            className="font-bold text-neutral-50 text-sm leading-5"
                                            data-id="06988552-775b-5520-b6a5-9e83eaa72336"
                                        >
                                            Laura Jiménez Mora
                                        </span>
                                        <span
                                            className="font-bold rounded-full bg-[#f0b100]/20 text-[#f0b100] text-xs leading-4 px-2.5 py-0.5"
                                            data-id="dae70164-7464-5e6f-b076-de83ae0ff5b2"
                                        >
                                            $18,000
                                        </span>
                                    </div>
                                    <span
                                        className="text-neutral-50/80 text-sm leading-5"
                                        data-id="c202361a-711b-568e-9d7d-28ca6c3825d9"
                                    >
                                        Kia Sportage 2023 · Azul
                                    </span>
                                    <div
                                        className="flex gap-2"
                                        data-id="da54aad5-ad8d-5293-9143-fb5076418187"
                                    >
                                        <span
                                            className="font-medium rounded-full bg-green-600/80 text-white text-xs leading-4 px-2 py-0.5"
                                            data-id="d3eb84e7-d295-5b92-9880-28dfd4d96d5f"
                                        >
                                            Cita ✓
                                        </span>
                                        <span
                                            className="font-medium rounded-full bg-zinc-800 text-[#9f9fa9] text-xs leading-4 px-2 py-0.5"
                                            data-id="91c4beb6-387e-5853-8b4a-ad9694ae0a2f"
                                        >
                                            Demo ✗
                                        </span>
                                    </div>
                                    <span
                                        className="font-medium text-[#ff6467] text-xs leading-4"
                                        data-id="a2b19ebf-3778-5d26-a206-d942f206ae8e"
                                    >
                                        Vencido · 10 Jun 2025
                                    </span>
                                </div>
                                <ChevronRight
                                    className="size-5 flex-shrink-0 text-[#9f9fa9]"
                                    data-id="8cc99c08-c7eb-5311-b22f-80db91fc8155"
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className="bg-zinc-900 border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid px-2 pt-2 pb-6"
                        data-id="5d5ea0c2-5947-5aab-8856-4101238a9f82"
                    >
                        <div
                            className="flex flex-row justify-around items-center"
                            data-id="b49418d8-3b32-572a-a562-e7969b0581fb"
                        >
                            <div
                                className="flex px-3 py-2 flex-col items-center gap-1"
                                data-id="5a7c73d7-dd95-5a7c-ab62-c76b2ae45861"
                            >
                                <Home
                                    className="size-5 text-[#9f9fa9]"
                                    data-id="8748b40e-7c19-5d8c-aba9-91e792897a52"
                                />
                                <span
                                    className="text-[#9f9fa9] text-xs leading-4"
                                    data-id="8e0ee7a5-10c9-5670-b2ed-3f02558b62fe"
                                >
                                    Inicio
                                </span>
                            </div>
                            <div
                                className="flex px-3 py-2 flex-col items-center gap-1"
                                data-id="b62c4edb-79da-5b57-8a21-919147f56ea4"
                            >
                                <ClipboardList
                                    className="size-5 text-[#9f9fa9]"
                                    data-id="cc7604aa-2722-5b96-b7b4-0761eea77a98"
                                />
                                <span
                                    className="text-[#9f9fa9] text-xs leading-4"
                                    data-id="1adb1527-60c2-5218-a09b-54cc7b3313ab"
                                >
                                    Avalúos
                                </span>
                            </div>
                            <div
                                className="flex px-3 py-2 flex-col items-center gap-1"
                                data-id="4438319b-943d-5072-a528-b5c941cba8d4"
                            >
                                <Users
                                    className="size-5 text-[#9f9fa9]"
                                    data-id="b261cba2-2ee0-5379-acd4-ac65c57f3b2c"
                                />
                                <span
                                    className="text-[#9f9fa9] text-xs leading-4"
                                    data-id="5b257713-5594-5a4b-9db4-5afdf8a6bdd0"
                                >
                                    Clientes
                                </span>
                            </div>
                            <div
                                className="flex px-3 py-2 flex-col items-center gap-1"
                                data-id="b8a245fb-a097-59c2-bc84-f5106cebfb44"
                            >
                                <div
                                    className="rounded-full bg-[#f0b100] px-4 py-1"
                                    data-id="b2c9cc49-6936-5a56-9be7-89596e4b1538"
                                >
                                    <HandCoins
                                        className="size-5 text-[#733e0a]"
                                        data-id="7615dcef-1a1e-5e02-8277-1ddbd20e6520"
                                    />
                                </div>
                                <span
                                    className="font-semibold text-[#f0b100] text-xs leading-4"
                                    data-id="acc1c00f-7a4b-5eb8-8732-b824c683df7d"
                                >
                                    Apartados
                                </span>
                            </div>
                            <div
                                className="flex px-3 py-2 flex-col items-center gap-1"
                                data-id="befa4b62-4ea2-512e-8814-029716ee70d4"
                            >
                                <Car
                                    className="size-5 text-[#9f9fa9]"
                                    data-id="8a3d530f-e50c-53cc-83b1-1f98502f4b0e"
                                />
                                <span
                                    className="text-[#9f9fa9] text-xs leading-4"
                                    data-id="3ffd8b39-6b94-5c35-aafb-9404156c48c3"
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
