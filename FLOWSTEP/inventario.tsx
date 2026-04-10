import { useEffect } from "react";
import {
    Car,
    ChevronRight,
    ClipboardList,
    HandCoins,
    Home,
    Search,
    SlidersHorizontal,
    Users,
} from "lucide-react";

export default function App() {
    return (
        <div>
            <div
                className="bg-zinc-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible"
                style={{ fontFamily: "sans-serif" }}
                data-id="6bb3b5e1-7086-5d2b-b427-7517a6757f16"
            >
                <div
                    className="flex flex-col"
                    style={{ minHeight: 812 }}
                    data-id="b132c09f-d0b9-567d-9c0b-f2947efa4229"
                >
                    <div
                        className="flex flex-col flex-1 overflow-hidden"
                        data-id="112c4c88-fd89-55f8-9e4c-a16239417dae"
                    >
                        <div
                            className="flex px-6 pt-6 pb-4 justify-between items-center"
                            data-id="4f6393b4-fa53-5665-bca5-3b12f1af5ae0"
                        >
                            <h1
                                className="font-bold text-neutral-50 text-2xl leading-8"
                                data-id="17d3ff13-0a36-53f3-bda3-c4e2d71a051c"
                            >
                                Inventario
                            </h1>
                            <div
                                className="rounded-xl bg-zinc-900 flex justify-center items-center w-10 h-10"
                                data-id="931e2ee8-d409-5ee0-b8a2-2af235957d6f"
                            >
                                <SlidersHorizontal
                                    className="size-5 text-[#9f9fa9]"
                                    data-id="27d4ec2c-c215-5274-b997-403ac398a747"
                                />
                            </div>
                        </div>
                        <div
                            className="px-6 pb-4"
                            data-id="06c01052-892e-5db2-93fd-2ef9e6b9a427"
                        >
                            <div
                                className="rounded-xl bg-zinc-900 flex px-4 py-3 items-center gap-2"
                                data-id="212b4611-2f68-578e-8fe1-8feb8f7eb2a6"
                            >
                                <Search
                                    className="size-4 text-[#9f9fa9]"
                                    data-id="ac4c4a4e-e061-5865-bfd1-8e3a5fcd0e3a"
                                />
                                <span
                                    className="text-[#9f9fa9] text-sm leading-5"
                                    data-id="a5839ed2-20b1-5970-8854-da7b9f82af7e"
                                >
                                    Buscar por marca, modelo o año
                                </span>
                            </div>
                        </div>
                        <div
                            className="flex px-6 pb-4 gap-2"
                            data-id="89f4c800-d5c1-5c66-8353-522f29327dc5"
                        >
                            <div
                                className="font-medium rounded-full text-sm leading-5 px-4 py-2"
                                style={{
                                    backgroundColor: "oklch(0.795 0.184 86.047)",
                                    color: "oklch(0.421 0.095 57.708)",
                                }}
                                data-id="500f0a82-08d9-5453-aed7-9c46a34e7604"
                            >
                                Todos
                            </div>
                            <div
                                className="font-medium rounded-full bg-zinc-900 text-[#9f9fa9] text-sm leading-5 px-4 py-2"
                                data-id="7ad9b60d-908c-5045-a0fe-cfbd032de1d0"
                            >
                                Frío
                            </div>
                            <div
                                className="font-medium rounded-full bg-zinc-900 text-[#9f9fa9] text-sm leading-5 px-4 py-2"
                                data-id="a819c3e8-72e4-50b8-81f0-191315d1110b"
                            >
                                Con Apartado
                            </div>
                        </div>
                        <div
                            className="overflow-y-auto flex px-6 pb-4 flex-col flex-1 gap-4"
                            data-id="292080c5-e245-57f6-84bb-ae6ab03d8e37"
                        >
                            <div
                                className="rounded-xl bg-zinc-900 flex p-4 items-center gap-4"
                                data-id="23559e0a-144f-5454-af30-2e37df491718"
                            >
                                <div
                                    className="flex-shrink-0 rounded-lg w-22.5 h-17.5 overflow-hidden"
                                    data-id="825cac07-c75a-5f5f-a7c0-821f0bbdd0a7"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1642130204821-74126d1cb88e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBDb3JvbGxhJTIwd2hpdGUlMjBzZWRhbiUyMGNhcnxlbnwxfDJ8fHwxNzc1NzUwMzUyfDA&ixlib=rb-4.1.0&q=80&w=400"
                                        alt="Toyota Corolla"
                                        className="object-cover w-full h-full"
                                        data-photoid="x06lguTO7Hg"
                                        data-authorname="Clementine"
                                        data-authorurl="https://unsplash.com/@s8n3d8gb2js0a3w4"
                                        data-blurhash="LFBN4zxvI9M_NNogWAWADgWAxvog"
                                        data-id="ba1675ba-e7c3-5492-95bd-1208ae5acacd"
                                    />
                                </div>
                                <div
                                    className="min-w-0 flex flex-col flex-1 gap-1"
                                    data-id="e43d95c2-6a50-5cfc-b057-2eb086bddab6"
                                >
                                    <span
                                        className="font-bold text-neutral-50 text-sm leading-5"
                                        data-id="e1594961-e1e7-5632-95ae-0df130840faa"
                                    >
                                        Toyota Corolla 2022
                                    </span>
                                    <span
                                        className="text-[#9f9fa9] text-xs leading-4"
                                        data-id="01866edf-0d65-512f-b1ec-060d9bdb6f89"
                                    >
                                        Sedán · Blanco · 35,000 km
                                    </span>
                                    <span
                                        className="font-bold text-sm leading-5"
                                        style={{ color: "oklch(0.795 0.184 86.047)" }}
                                        data-id="f88d1fbc-c0ca-555f-817b-a4af867d9fa6"
                                    >
                                        $220,000
                                    </span>
                                    <div
                                        className="flex items-center gap-1"
                                        data-id="4e8bfe0f-87af-5e61-b956-e3292b8c9542"
                                    >
                                        <div
                                            className="rounded-full w-2 h-2"
                                            style={{ backgroundColor: "oklch(0.795 0.184 86.047)" }}
                                            data-id="41c64217-8612-5b93-bc20-4bcf3eaadc3f"
                                        />
                                        <span
                                            className="text-xs leading-4"
                                            style={{ color: "oklch(0.795 0.184 86.047)" }}
                                            data-id="17237d89-c60e-5dd8-a662-75a24ad49ae0"
                                        >
                                            Apartado
                                        </span>
                                    </div>
                                    <span
                                        className="text-[#9f9fa9] text-xs leading-4"
                                        style={{ opacity: 0.6 }}
                                        data-id="582a2c42-e629-553a-ab2e-67011261fa1b"
                                    >
                                        Cliente: María Fernanda R.
                                    </span>
                                </div>
                                <ChevronRight
                                    className="size-4 flex-shrink-0 text-[#9f9fa9]"
                                    data-id="250d3b0e-acdf-5f72-9355-5f63a9b9b340"
                                />
                            </div>
                            <div
                                className="rounded-xl bg-zinc-900 flex p-4 items-center gap-4"
                                data-id="8a94d43d-ef16-543b-8b75-e7d16aa0ccd6"
                            >
                                <div
                                    className="flex-shrink-0 rounded-lg w-22.5 h-17.5 overflow-hidden"
                                    data-id="47a56b7d-ddc6-5c9c-8887-795ee15595c8"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1762077656279-4c60ffe2a9e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxNYXpkYSUyMENYLTUlMjByZWQlMjBTVVZ8ZW58MXwyfHx8MTc3NTc1MDM1M3ww&ixlib=rb-4.1.0&q=80&w=400"
                                        alt="Mazda CX-5"
                                        className="object-cover w-full h-full"
                                        data-photoid="TZCo7EgaOvQ"
                                        data-authorname="Ryan Collins"
                                        data-authorurl="https://unsplash.com/@swollfadder"
                                        data-blurhash="L15OQn%M00of_3M{9Fof00IU?bj["
                                        data-id="8356c70b-158e-5c13-bbeb-d7215a4bd235"
                                    />
                                </div>
                                <div
                                    className="min-w-0 flex flex-col flex-1 gap-1"
                                    data-id="456347fd-6ca9-5b5d-a6db-94a0128f9d7b"
                                >
                                    <span
                                        className="font-bold text-neutral-50 text-sm leading-5"
                                        data-id="48d70899-fcd6-506f-99ae-01c7f8fa098f"
                                    >
                                        Mazda CX-5 2023
                                    </span>
                                    <span
                                        className="text-[#9f9fa9] text-xs leading-4"
                                        data-id="a52eec57-d35d-5a96-a894-811862a19bbc"
                                    >
                                        SUV · Rojo · 12,000 km
                                    </span>
                                    <span
                                        className="font-bold text-sm leading-5"
                                        style={{ color: "oklch(0.795 0.184 86.047)" }}
                                        data-id="0f4ef1b1-bc0d-5374-8657-b650a48350c2"
                                    >
                                        $385,000
                                    </span>
                                    <div
                                        className="flex items-center gap-1"
                                        data-id="fb45a5c1-9cdb-5ae3-982a-181af64d6d97"
                                    >
                                        <div
                                            className="rounded-full w-2 h-2"
                                            style={{ backgroundColor: "oklch(0.488 0.243 264.376)" }}
                                            data-id="6b236859-fd44-5d93-bf19-cde1c798ef00"
                                        />
                                        <span
                                            className="text-xs leading-4"
                                            style={{ color: "oklch(0.488 0.243 264.376)" }}
                                            data-id="1e8f3617-fee9-5a91-b6d1-e9737b290901"
                                        >
                                            Frío
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight
                                    className="size-4 flex-shrink-0 text-[#9f9fa9]"
                                    data-id="77d42af8-d3c7-5e04-b863-f43546f90cfe"
                                />
                            </div>
                            <div
                                className="rounded-xl bg-zinc-900 flex p-4 items-center gap-4"
                                data-id="c0c28acf-cfcf-523f-b7f7-23c6c1ec698a"
                            >
                                <div
                                    className="flex-shrink-0 rounded-lg w-22.5 h-17.5 overflow-hidden"
                                    data-id="802864e9-5bd3-57ab-906e-a4913045926d"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1756914741277-54e68bdc9d7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxIb25kYSUyMENpdmljJTIwc2VkYW4lMjBjYXJ8ZW58MXwyfHx8MTc3NTc1MDM1M3ww&ixlib=rb-4.1.0&q=80&w=400"
                                        alt="Honda Civic"
                                        className="object-cover w-full h-full"
                                        data-photoid="U2-J2zVXcyQ"
                                        data-authorname="Pau Gomez"
                                        data-authorurl="https://unsplash.com/@pauggg"
                                        data-blurhash="L76*wA?bDiMxx]x]M{NG4TM{-;t7"
                                        data-id="996e064b-3fff-521f-8b2f-1f10136cd8f0"
                                    />
                                </div>
                                <div
                                    className="min-w-0 flex flex-col flex-1 gap-1"
                                    data-id="45b9d5c2-abd2-5c32-842d-ec2de07b03e4"
                                >
                                    <span
                                        className="font-bold text-neutral-50 text-sm leading-5"
                                        data-id="02bdd886-8deb-5afd-afe2-ba22b71a85f4"
                                    >
                                        Honda Civic 2021
                                    </span>
                                    <span
                                        className="text-[#9f9fa9] text-xs leading-4"
                                        data-id="0824fee9-93c6-5a58-9810-eafdd14057a6"
                                    >
                                        Sedán · Gris · 48,000 km
                                    </span>
                                    <span
                                        className="font-bold text-sm leading-5"
                                        style={{ color: "oklch(0.795 0.184 86.047)" }}
                                        data-id="2c87cfe6-93f2-5dda-b140-e67946ce7bf8"
                                    >
                                        $275,000
                                    </span>
                                    <div
                                        className="flex items-center gap-1"
                                        data-id="6ada5a94-9e04-5a31-876b-7540a2ef4b6f"
                                    >
                                        <div
                                            className="rounded-full w-2 h-2"
                                            style={{ backgroundColor: "oklch(0.795 0.184 86.047)" }}
                                            data-id="40bedaa1-c9b1-50e4-a2b7-6b0df7eff7cf"
                                        />
                                        <span
                                            className="text-xs leading-4"
                                            style={{ color: "oklch(0.795 0.184 86.047)" }}
                                            data-id="4ceb9720-861e-5cf5-9320-8bec1752088a"
                                        >
                                            Apartado
                                        </span>
                                    </div>
                                    <span
                                        className="text-[#9f9fa9] text-xs leading-4"
                                        style={{ opacity: 0.6 }}
                                        data-id="586c1dda-84e4-58b6-a671-8f9960f6e462"
                                    >
                                        Cliente: Carlos Mendoza L.
                                    </span>
                                </div>
                                <ChevronRight
                                    className="size-4 flex-shrink-0 text-[#9f9fa9]"
                                    data-id="dcd28d2d-fa3d-5fc9-8cf3-c21cac358e12"
                                />
                            </div>
                            <div
                                className="rounded-xl bg-zinc-900 flex p-4 items-center gap-4"
                                data-id="fbbfffe6-7ca4-5bd6-b025-b02971692899"
                            >
                                <div
                                    className="flex-shrink-0 rounded-lg w-22.5 h-17.5 overflow-hidden"
                                    data-id="fef83608-1d98-5805-ad93-07c267e7645b"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1775500815209-be0c18223ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxDaGV2cm9sZXQlMjBDYW1hcm8lMjBzcG9ydHMlMjBjYXJ8ZW58MXwyfHx8MTc3NTc1MDM1M3ww&ixlib=rb-4.1.0&q=80&w=400"
                                        alt="Chevrolet Camaro"
                                        className="object-cover w-full h-full"
                                        data-photoid="QnN5SokrQFU"
                                        data-authorname="Florinel ZONE"
                                        data-authorurl="https://unsplash.com/@florinelzone"
                                        data-blurhash="LpHU?_IVD%t7~oRjM{a#oIoet6Rk"
                                        data-id="8244a216-52d4-5d69-b589-b2eb31bf7bda"
                                    />
                                </div>
                                <div
                                    className="min-w-0 flex flex-col flex-1 gap-1"
                                    data-id="db212e87-383f-5257-9163-4ceb0bd0549f"
                                >
                                    <span
                                        className="font-bold text-neutral-50 text-sm leading-5"
                                        data-id="6d05023a-9375-5f6b-b905-0b27fe71f7d8"
                                    >
                                        Chevrolet Camaro 2020
                                    </span>
                                    <span
                                        className="text-[#9f9fa9] text-xs leading-4"
                                        data-id="c5c14a51-7944-55b8-8453-3abc64568770"
                                    >
                                        Deportivo · Negro · 22,000 km
                                    </span>
                                    <span
                                        className="font-bold text-sm leading-5"
                                        style={{ color: "oklch(0.795 0.184 86.047)" }}
                                        data-id="b1cfb86c-fb30-5ffc-a92c-15e8e8d0fa7d"
                                    >
                                        $520,000
                                    </span>
                                    <div
                                        className="flex items-center gap-1"
                                        data-id="5b9d7dae-6d0a-53f2-9c8e-ec9f1b5fa7e8"
                                    >
                                        <div
                                            className="rounded-full w-2 h-2"
                                            style={{ backgroundColor: "oklch(0.488 0.243 264.376)" }}
                                            data-id="92144321-88d6-5ab7-b12f-734f8706d688"
                                        />
                                        <span
                                            className="text-xs leading-4"
                                            style={{ color: "oklch(0.488 0.243 264.376)" }}
                                            data-id="c9d22ddc-cf52-54dd-bf4f-be26f4cf1e68"
                                        >
                                            Frío
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight
                                    className="size-4 flex-shrink-0 text-[#9f9fa9]"
                                    data-id="b147f5a3-b5a3-5279-99ac-9f32e455cd8d"
                                />
                            </div>
                            <div
                                className="rounded-xl bg-zinc-900 flex p-4 items-center gap-4"
                                data-id="95438c1c-affc-5c52-bb44-74e5fcee2875"
                            >
                                <div
                                    className="flex-shrink-0 rounded-lg w-22.5 h-17.5 overflow-hidden"
                                    data-id="dd132f08-8cc3-52f5-b7c3-a7b8de3dd664"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1667970275638-7c2ef6eff862?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxOaXNzYW4lMjBTZW50cmElMjBzZWRhbnxlbnwxfDJ8fHwxNzc1NzUwMzU0fDA&ixlib=rb-4.1.0&q=80&w=400"
                                        alt="Nissan Sentra"
                                        className="object-cover w-full h-full"
                                        data-photoid="dL-QuhJegTQ"
                                        data-authorname="Lukmannil Hakim"
                                        data-authorurl="https://unsplash.com/@lukmen"
                                        data-blurhash="LBAAgsZ~niIpSd%hIUxa~qITNIoz"
                                        data-id="a47c76ec-2e07-56ba-b363-41bbf0be1e57"
                                    />
                                </div>
                                <div
                                    className="min-w-0 flex flex-col flex-1 gap-1"
                                    data-id="e3efa342-e149-59a8-9606-306eade08794"
                                >
                                    <span
                                        className="font-bold text-neutral-50 text-sm leading-5"
                                        data-id="3801ec50-133f-55f1-ba87-2173854cdb92"
                                    >
                                        Nissan Sentra 2023
                                    </span>
                                    <span
                                        className="text-[#9f9fa9] text-xs leading-4"
                                        data-id="92dd01bc-9eb2-5fe5-94d2-7356c9a81a40"
                                    >
                                        Sedán · Azul · 8,500 km
                                    </span>
                                    <span
                                        className="font-bold text-sm leading-5"
                                        style={{ color: "oklch(0.795 0.184 86.047)" }}
                                        data-id="b0c4ecc9-cb36-57d5-a54e-ec78a40961b5"
                                    >
                                        $310,000
                                    </span>
                                    <div
                                        className="flex items-center gap-1"
                                        data-id="aff39936-6d89-5b16-84dd-adc7a580f180"
                                    >
                                        <div
                                            className="rounded-full w-2 h-2"
                                            style={{ backgroundColor: "oklch(0.488 0.243 264.376)" }}
                                            data-id="c3b6c621-de64-56de-9d87-9b6d0751c479"
                                        />
                                        <span
                                            className="text-xs leading-4"
                                            style={{ color: "oklch(0.488 0.243 264.376)" }}
                                            data-id="a468f2bf-d41e-531d-8e7d-ea9f1466bcc3"
                                        >
                                            Frío
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight
                                    className="size-4 flex-shrink-0 text-[#9f9fa9]"
                                    data-id="0e77bba8-b736-55af-a691-1275fc6ac381"
                                />
                            </div>
                            <div
                                className="rounded-xl bg-zinc-900 flex p-4 items-center gap-4"
                                data-id="61b81515-a058-54f2-9110-964327e49554"
                            >
                                <div
                                    className="flex-shrink-0 rounded-lg w-22.5 h-17.5 overflow-hidden"
                                    data-id="4aa8552e-5656-5128-8f8a-6fcbd4a98d81"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1732538895957-25e8cd6a2f28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxGb3JkJTIwRXhwbG9yZXIlMjBTVVYlMjBkYXJrfGVufDF8Mnx8fDE3NzU3NTAzNTN8MA&ixlib=rb-4.1.0&q=80&w=400"
                                        alt="Ford Explorer"
                                        className="object-cover w-full h-full"
                                        data-photoid="P2fkVav0sEg"
                                        data-authorname="Haberdoedas"
                                        data-authorurl="https://unsplash.com/@haberdoedas"
                                        data-blurhash="L25XAM]#$jIoEKJCE#Ne0zkDxCt8"
                                        data-id="b27d7774-f6af-5669-bf37-a5c0627098fb"
                                    />
                                </div>
                                <div
                                    className="min-w-0 flex flex-col flex-1 gap-1"
                                    data-id="dccf5da3-0cbc-521d-95a9-c0a4b544cef5"
                                >
                                    <span
                                        className="font-bold text-neutral-50 text-sm leading-5"
                                        data-id="b7f3176c-3d9e-57ec-8638-286778f7dbd1"
                                    >
                                        Ford Explorer 2022
                                    </span>
                                    <span
                                        className="text-[#9f9fa9] text-xs leading-4"
                                        data-id="18797f15-04d5-589c-ab4b-833e4a2c60df"
                                    >
                                        SUV · Gris Oscuro · 29,000 km
                                    </span>
                                    <span
                                        className="font-bold text-sm leading-5"
                                        style={{ color: "oklch(0.795 0.184 86.047)" }}
                                        data-id="6c141ad0-bdf7-5e94-a851-7432933bd356"
                                    >
                                        $465,000
                                    </span>
                                    <div
                                        className="flex items-center gap-1"
                                        data-id="ec2410e8-db0c-54bb-bb52-f98b9b141761"
                                    >
                                        <div
                                            className="rounded-full w-2 h-2"
                                            style={{ backgroundColor: "oklch(0.795 0.184 86.047)" }}
                                            data-id="4649dc06-fd61-5c04-85b5-cb3e35e7d927"
                                        />
                                        <span
                                            className="text-xs leading-4"
                                            style={{ color: "oklch(0.795 0.184 86.047)" }}
                                            data-id="b5ab3fb7-1e13-5833-b113-96afe3d0a783"
                                        >
                                            Apartado
                                        </span>
                                    </div>
                                    <span
                                        className="text-[#9f9fa9] text-xs leading-4"
                                        style={{ opacity: 0.6 }}
                                        data-id="c7345bec-4e12-5163-99eb-7d674646e461"
                                    >
                                        Cliente: Ana Sofía G.
                                    </span>
                                </div>
                                <ChevronRight
                                    className="size-4 flex-shrink-0 text-[#9f9fa9]"
                                    data-id="0de90775-9102-5a60-9322-eefee8bb6d25"
                                />
                            </div>
                            <div
                                className="flex py-4 justify-center items-center"
                                data-id="c459361d-3a06-55cf-b785-7b1d3fc07b52"
                            >
                                <span
                                    className="text-[#9f9fa9] text-xs leading-4"
                                    data-id="bb89456f-19bc-585b-8e10-669e4d3e0b0c"
                                >
                                    12 unidades en inventario
                                </span>
                            </div>
                        </div>
                    </div>
                    <div
                        className="bg-zinc-900 border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid px-2 pt-2 pb-6"
                        data-id="e98dd313-b7e8-5924-83fc-599a58ffffaf"
                    >
                        <div
                            className="flex flex-row justify-around items-center"
                            data-id="d697dc4e-f75f-5657-816e-b235da1102d4"
                        >
                            <div
                                className="flex p-2 flex-col items-center gap-1"
                                data-id="f5304df0-8f87-5f68-9339-239f74fd0a18"
                            >
                                <Home
                                    className="size-5 text-[#9f9fa9]"
                                    data-id="84e0f0dc-a3aa-5cec-a911-bd3c1c1b523a"
                                />
                                <span
                                    className="text-[#9f9fa9] text-xs leading-4"
                                    data-id="2dc26193-7976-59c4-8059-b68baeebff5e"
                                >
                                    Inicio
                                </span>
                            </div>
                            <div
                                className="flex p-2 flex-col items-center gap-1"
                                data-id="72a2ba34-268f-53e5-be0f-346fe2e5ebe0"
                            >
                                <ClipboardList
                                    className="size-5 text-[#9f9fa9]"
                                    data-id="3020d2f2-3a27-5df6-a06e-77a0674a3c9e"
                                />
                                <span
                                    className="text-[#9f9fa9] text-xs leading-4"
                                    data-id="dc1b8ab2-d1fd-5d59-8b99-14f113382b9f"
                                >
                                    Avalúos
                                </span>
                            </div>
                            <div
                                className="flex p-2 flex-col items-center gap-1"
                                data-id="7fa5d170-953d-5bc8-8e76-47d4e06fb5b5"
                            >
                                <Users
                                    className="size-5 text-[#9f9fa9]"
                                    data-id="8d2a7865-6741-5ff3-86ec-97f7b6cd05b0"
                                />
                                <span
                                    className="text-[#9f9fa9] text-xs leading-4"
                                    data-id="398be1e1-83e1-5f6c-8735-a4557205bb2e"
                                >
                                    Clientes
                                </span>
                            </div>
                            <div
                                className="flex p-2 flex-col items-center gap-1"
                                data-id="162b172c-bd84-57b8-830c-f7a797329ef7"
                            >
                                <HandCoins
                                    className="size-5 text-[#9f9fa9]"
                                    data-id="f5d54c56-3e7c-5e18-8209-8500ffd011b3"
                                />
                                <span
                                    className="text-[#9f9fa9] text-xs leading-4"
                                    data-id="7a47dd9f-5191-5299-8576-bdcbc9dfe791"
                                >
                                    Apartados
                                </span>
                            </div>
                            <div
                                className="flex p-2 flex-col items-center gap-1"
                                data-id="ff62a469-6ce5-539a-95f0-564053fecc38"
                            >
                                <div
                                    className="rounded-full flex px-4 py-1 flex-col items-center gap-1"
                                    style={{ backgroundColor: "oklch(0.795 0.184 86.047)" }}
                                    data-id="961a3d02-9240-512a-89bb-88063b4f5776"
                                >
                                    <Car
                                        className="size-5"
                                        style={{ color: "oklch(0.421 0.095 57.708)" }}
                                        data-id="990f2ded-7081-5393-9223-c8e0e875c954"
                                    />
                                    <span
                                        className="font-semibold text-xs leading-4"
                                        style={{ color: "oklch(0.421 0.095 57.708)" }}
                                        data-id="9ce6c1fd-553f-5741-a7e1-609c802bf0c9"
                                    >
                                        Inventario
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
