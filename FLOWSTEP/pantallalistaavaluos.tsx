import { useEffect } from "react";
import {
    Bell,
    Calendar,
    Car,
    ClipboardList,
    HandCoins,
    Home,
    MapPin,
    Plus,
    Search,
    Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";

export default function App() {
    return (
        <div>
            <div
                className="bg-zinc-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible"
                style={{ fontFamily: "sans-serif", maxWidth: 375, minHeight: 812 }}
                data-id="7f3657cc-3e84-556e-84bc-b5d1dc0b4501"
            >
                <div
                    className="min-h-[812px] flex flex-col"
                    data-id="89c88c03-1ca3-5294-80dd-463ef020eacf"
                >
                    <div
                        className="overflow-y-auto pb-20 flex-1"
                        data-id="564f1ce1-4f14-555a-9068-9a7397e9e205"
                    >
                        <div
                            className="flex p-6 flex-col gap-6"
                            data-id="27dda92e-b6ff-5512-9243-e5394e550c07"
                        >
                            <div
                                className="flex justify-between items-center"
                                data-id="83ff636e-dc7b-51d1-bfe2-5c685256785a"
                            >
                                <span
                                    className="font-bold text-neutral-50 text-xl leading-7"
                                    data-id="25a96a1b-56dc-5109-9e6d-4a79012d50be"
                                >
                                    Avalúos
                                </span>
                                <div
                                    className="flex items-center gap-2"
                                    data-id="381f0d27-7c52-5277-80ce-e2a332f90fb8"
                                >
                                    <div
                                        className="rounded-full bg-zinc-800 flex justify-center items-center w-9 h-9"
                                        data-id="97461f33-8d4b-5f02-bba9-39020ad72e93"
                                    >
                                        <Bell
                                            className="size-4 text-[#9f9fa9]"
                                            data-id="cc20d129-1616-55f1-9f8c-9b532c940e4e"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                className="rounded-xl bg-zinc-800 flex px-4 py-3 items-center"
                                data-id="a029b05d-4b87-530f-a91c-b53c5cb303df"
                            >
                                <Search
                                    className="size-4 flex-shrink-0 text-[#9f9fa9] mr-3"
                                    data-id="c41f3175-8b30-53b6-96f3-ead21eb46eb2"
                                />
                                <span
                                    className="text-[#9f9fa9]/60 text-sm leading-5"
                                    data-id="85f8b42b-9bf4-5317-b6c9-386a3bd67c55"
                                >
                                    Buscar por vehículo o cliente...
                                </span>
                            </div>
                            <div
                                className="overflow-x-auto flex items-center gap-2"
                                data-id="7bf701e4-bbe2-5621-ac23-a442eda7057d"
                            >
                                <div
                                    className="whitespace-nowrap font-bold rounded-full bg-[#f0b100] text-[#733e0a] text-xs leading-4 flex px-4 py-2 justify-center items-center"
                                    data-id="c94b9162-9ac2-5694-963d-b6bc23090f63"
                                >
                                    Todos
                                </div>
                                <div
                                    className="border-[oklch(0.6_0.15_250)] text-[oklch(0.7_0.15_250)] whitespace-nowrap font-medium rounded-full text-xs leading-4 border-black/1 border-1 border-solid flex px-4 py-2 justify-center items-center"
                                    data-id="d79b12e8-65d4-5d74-a492-c5b49a2a1701"
                                >
                                    Frío
                                </div>
                                <div
                                    className="border-[oklch(0.7_0.15_55)] text-[oklch(0.75_0.15_55)] whitespace-nowrap font-medium rounded-full text-xs leading-4 border-black/1 border-1 border-solid flex px-4 py-2 justify-center items-center"
                                    data-id="7f9fb91d-6fe3-5bd4-9b3c-7d46eea656ee"
                                >
                                    Medio
                                </div>
                                <div
                                    className="border-[oklch(0.65_0.2_25)] text-[oklch(0.7_0.2_25)] whitespace-nowrap font-medium rounded-full text-xs leading-4 border-black/1 border-1 border-solid flex px-4 py-2 justify-center items-center"
                                    data-id="acf5b709-8a9d-56a9-80f7-0592a928f6fd"
                                >
                                    Alto
                                </div>
                                <div
                                    className="whitespace-nowrap font-medium rounded-full text-[#f0b100] text-xs leading-4 border-[#f0b100] border-1 border-solid flex px-4 py-2 justify-center items-center"
                                    data-id="1861d010-40c8-5e80-8532-e474a8d8c692"
                                >
                                    Toma
                                </div>
                            </div>
                            <div
                                className="flex flex-col gap-4"
                                data-id="0bbc7f7d-53d5-590e-a7d6-8dc9c04c7290"
                            >
                                <Card
                                    className="rounded-xl bg-zinc-900 border-white/10 border-0 border-solid p-4 gap-4"
                                    data-id="375feadb-ebbd-5562-94a0-581642e112a1"
                                >
                                    <CardHeader
                                        className="p-0 gap-2"
                                        data-id="d7f1082c-5026-54a2-a367-1cc1ae64c19a"
                                    >
                                        <div
                                            className="flex justify-between items-center"
                                            data-id="e50c4c0a-538d-58bc-b6ab-f89588a9a876"
                                        >
                                            <div
                                                className="flex flex-col gap-0.5"
                                                data-id="35fa7798-1cfb-56e0-8023-71f78814b96a"
                                            >
                                                <span
                                                    className="font-semibold text-neutral-50 text-base leading-6"
                                                    data-id="6a9eba31-45af-5312-9b1c-b05f36aed828"
                                                >
                                                    Toyota Corolla 2021
                                                </span>
                                                <span
                                                    className="text-[#9f9fa9] text-xs leading-4"
                                                    data-id="89c8942c-9da9-57b1-9470-729300fe3005"
                                                >
                                                    Carlos Mendoza
                                                </span>
                                            </div>
                                            <div
                                                className="font-bold rounded-full bg-[#f0b100] text-[#733e0a] text-[10px] px-2.5 py-1"
                                                data-id="000daf77-f1dd-5df8-90ad-6b7493f7d760"
                                            >
                                                Toma
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent
                                        className="p-0 gap-2"
                                        data-id="456e9701-5a62-5db5-9990-c5a2b1822ab1"
                                    >
                                        <div
                                            className="flex justify-between items-center"
                                            data-id="3c07d8b2-54bc-5d23-aa53-dc355647188b"
                                        >
                                            <div
                                                className="flex flex-col gap-1"
                                                data-id="217204bd-5d7e-5c62-9ddb-90a15217a9de"
                                            >
                                                <span
                                                    className="uppercase text-[#9f9fa9] text-[10px] tracking-wide"
                                                    data-id="8d3819f8-22e0-51ac-ac84-d5ce38b171df"
                                                >
                                                    Oferta
                                                </span>
                                                <span
                                                    className="font-semibold text-neutral-50 text-sm leading-5"
                                                    data-id="4ee56520-6d17-57f5-8a9d-46de68218899"
                                                >
                                                    $185,000
                                                </span>
                                            </div>
                                            <div
                                                className="flex flex-col gap-1"
                                                data-id="4a1acd73-95c9-529d-ba70-2a6631ea8d40"
                                            >
                                                <span
                                                    className="uppercase text-[#9f9fa9] text-[10px] tracking-wide"
                                                    data-id="a82ca853-5483-5cd9-91ca-bdea32afa21b"
                                                >
                                                    Venta Est.
                                                </span>
                                                <span
                                                    className="font-semibold text-[#f0b100] text-sm leading-5"
                                                    data-id="1cb2c29d-6c3d-5fd2-9269-28a07f3decac"
                                                >
                                                    $220,000
                                                </span>
                                            </div>
                                            <div
                                                className="flex flex-col items-end gap-1"
                                                data-id="c64ff80c-fe45-5353-8004-27d023ab58ac"
                                            >
                                                <span
                                                    className="uppercase text-[#9f9fa9] text-[10px] tracking-wide"
                                                    data-id="040a0197-7f91-5c05-9f5b-dbbb1f6d4264"
                                                >
                                                    Margen
                                                </span>
                                                <span
                                                    className="font-semibold text-neutral-50 text-sm leading-5"
                                                    data-id="1eb7180c-1488-5276-9d8a-0e4db4d59b6f"
                                                >
                                                    $35,000
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter
                                        className="border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex px-0 pt-3 pb-0 justify-between items-center gap-0"
                                        data-id="f70c58ea-62d2-550d-81e7-51878c36d35b"
                                    >
                                        <div
                                            className="flex items-center gap-1.5"
                                            data-id="80ad1dd7-8a44-5d32-8ece-a6f2317c3a84"
                                        >
                                            <Calendar
                                                className="size-3 text-[#9f9fa9]"
                                                data-id="130f68ca-19e9-5273-8ba7-f1875c74ad3a"
                                            />
                                            <span
                                                className="text-[#9f9fa9] text-[10px]"
                                                data-id="409643fc-5d29-5e9c-bcc4-eb017f869989"
                                            >
                                                15 Jun 2025
                                            </span>
                                        </div>
                                        <div
                                            className="flex items-center gap-1.5"
                                            data-id="371bbf87-b87c-55bb-a657-4de2568ff6ed"
                                        >
                                            <MapPin
                                                className="size-3 text-[#9f9fa9]"
                                                data-id="caeac174-b077-5598-96e5-54adc1bb817b"
                                            />
                                            <span
                                                className="text-[#9f9fa9] text-[10px]"
                                                data-id="09b081d3-0b56-5f6c-831b-98ca78b7a81e"
                                            >
                                                Sucursal Norte
                                            </span>
                                        </div>
                                    </CardFooter>
                                </Card>
                                <Card
                                    className="rounded-xl bg-zinc-900 border-white/10 border-0 border-solid p-4 gap-4"
                                    data-id="b094df09-f571-5293-94ed-6b574d5d8744"
                                >
                                    <CardHeader
                                        className="p-0 gap-2"
                                        data-id="a58000d4-451a-5524-8775-8846d4426a25"
                                    >
                                        <div
                                            className="flex justify-between items-center"
                                            data-id="8fed8e15-de77-5afb-9cfa-d8bdcb81495e"
                                        >
                                            <div
                                                className="flex flex-col gap-0.5"
                                                data-id="38750caa-3e2b-5926-9e5f-a78138328fef"
                                            >
                                                <span
                                                    className="font-semibold text-neutral-50 text-base leading-6"
                                                    data-id="4d3cbe9d-50fd-5950-8ab0-1d4e04229b86"
                                                >
                                                    Honda Civic 2020
                                                </span>
                                                <span
                                                    className="text-[#9f9fa9] text-xs leading-4"
                                                    data-id="5e0aa79d-7795-53eb-8737-534ab831b354"
                                                >
                                                    María López
                                                </span>
                                            </div>
                                            <div
                                                className="border-[oklch(0.65_0.2_25)] text-[oklch(0.7_0.2_25)] font-bold rounded-full text-[10px] border-black/1 border-1 border-solid px-2.5 py-1"
                                                data-id="4411feac-e409-50f9-9de4-76bf149f6216"
                                            >
                                                Alto
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent
                                        className="p-0 gap-2"
                                        data-id="75b658d7-1019-5dc5-95f3-aed6602464fb"
                                    >
                                        <div
                                            className="flex justify-between items-center"
                                            data-id="f777ab48-7b3a-57e9-a474-cd921f1c35a4"
                                        >
                                            <div
                                                className="flex flex-col gap-1"
                                                data-id="380b20be-7530-5394-a010-89bdbfec0500"
                                            >
                                                <span
                                                    className="uppercase text-[#9f9fa9] text-[10px] tracking-wide"
                                                    data-id="4fb3f23c-d8c6-5196-847d-6c7b2c380f00"
                                                >
                                                    Oferta
                                                </span>
                                                <span
                                                    className="font-semibold text-neutral-50 text-sm leading-5"
                                                    data-id="08fddd11-4327-50ae-884a-80b23ca03b95"
                                                >
                                                    $160,000
                                                </span>
                                            </div>
                                            <div
                                                className="flex flex-col gap-1"
                                                data-id="8f327d3b-6b88-50e6-b926-9b8b74ff1bbb"
                                            >
                                                <span
                                                    className="uppercase text-[#9f9fa9] text-[10px] tracking-wide"
                                                    data-id="3ba52f09-5d9b-5a80-b963-af646221e3ae"
                                                >
                                                    Venta Est.
                                                </span>
                                                <span
                                                    className="font-semibold text-[#f0b100] text-sm leading-5"
                                                    data-id="4ee26795-c844-5bd8-b08a-59843f25a435"
                                                >
                                                    $195,000
                                                </span>
                                            </div>
                                            <div
                                                className="flex flex-col items-end gap-1"
                                                data-id="8592a0ed-b9c5-5b51-9bee-c63d99656d1c"
                                            >
                                                <span
                                                    className="uppercase text-[#9f9fa9] text-[10px] tracking-wide"
                                                    data-id="57dd4a1f-2f81-5388-81e2-bd2223ec47ee"
                                                >
                                                    Margen
                                                </span>
                                                <span
                                                    className="font-semibold text-neutral-50 text-sm leading-5"
                                                    data-id="cab462df-3bc6-5a1b-a6c5-ccb6ad5607bc"
                                                >
                                                    $35,000
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter
                                        className="border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex px-0 pt-3 pb-0 justify-between items-center gap-0"
                                        data-id="88bdf7d1-06a0-5dbd-9aca-453d92201423"
                                    >
                                        <div
                                            className="flex items-center gap-1.5"
                                            data-id="2ed1def7-eb57-5bd2-bfaa-57bb54fbc8e1"
                                        >
                                            <Calendar
                                                className="size-3 text-[#9f9fa9]"
                                                data-id="a16f8b88-85dc-5ad6-b8e3-a4356afb6236"
                                            />
                                            <span
                                                className="text-[#9f9fa9] text-[10px]"
                                                data-id="d067d212-938a-5ed9-aecc-6aa4e46776e1"
                                            >
                                                14 Jun 2025
                                            </span>
                                        </div>
                                        <div
                                            className="flex items-center gap-1.5"
                                            data-id="2c97d385-f936-5d6a-a9e7-d88c9c93c25f"
                                        >
                                            <MapPin
                                                className="size-3 text-[#9f9fa9]"
                                                data-id="f2303a94-8918-5f6d-880f-91a701698836"
                                            />
                                            <span
                                                className="text-[#9f9fa9] text-[10px]"
                                                data-id="c5fde755-845c-5cfe-9852-c43ddab18f44"
                                            >
                                                Sucursal Centro
                                            </span>
                                        </div>
                                    </CardFooter>
                                </Card>
                                <Card
                                    className="rounded-xl bg-zinc-900 border-white/10 border-0 border-solid p-4 gap-4"
                                    data-id="5cec50a7-bb0c-502f-9403-59c5b6976e6d"
                                >
                                    <CardHeader
                                        className="p-0 gap-2"
                                        data-id="24ed0073-7049-5a35-bf25-c538ccc9a757"
                                    >
                                        <div
                                            className="flex justify-between items-center"
                                            data-id="7374a0ba-2173-5ce0-a4b7-b89595cc1d97"
                                        >
                                            <div
                                                className="flex flex-col gap-0.5"
                                                data-id="716a18e7-ceda-579b-9614-bd2535334662"
                                            >
                                                <span
                                                    className="font-semibold text-neutral-50 text-base leading-6"
                                                    data-id="58734435-2329-572e-bd7f-c19c0698473b"
                                                >
                                                    Nissan Sentra 2019
                                                </span>
                                                <span
                                                    className="text-[#9f9fa9] text-xs leading-4"
                                                    data-id="1d2436e9-1b76-5d57-b0b4-505538f50e24"
                                                >
                                                    Roberto García
                                                </span>
                                            </div>
                                            <div
                                                className="border-[oklch(0.7_0.15_55)] text-[oklch(0.75_0.15_55)] font-bold rounded-full text-[10px] border-black/1 border-1 border-solid px-2.5 py-1"
                                                data-id="6286739c-e9e6-5fce-ae7a-f03b17b531da"
                                            >
                                                Medio
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent
                                        className="p-0 gap-2"
                                        data-id="15547c25-c467-5945-ac70-92b4f91ed427"
                                    >
                                        <div
                                            className="flex justify-between items-center"
                                            data-id="10297ecf-ab3b-581c-bf39-747011b9d856"
                                        >
                                            <div
                                                className="flex flex-col gap-1"
                                                data-id="4b646a19-1399-5fc2-abcb-1834752ccabd"
                                            >
                                                <span
                                                    className="uppercase text-[#9f9fa9] text-[10px] tracking-wide"
                                                    data-id="4d64fb56-5ace-5397-86e3-50bdb923e230"
                                                >
                                                    Oferta
                                                </span>
                                                <span
                                                    className="font-semibold text-neutral-50 text-sm leading-5"
                                                    data-id="b3f31d49-1b12-572c-b50e-3bd5731c3ce0"
                                                >
                                                    $120,000
                                                </span>
                                            </div>
                                            <div
                                                className="flex flex-col gap-1"
                                                data-id="ce876e8f-d152-5a7d-bf1d-31b3b87f5b5d"
                                            >
                                                <span
                                                    className="uppercase text-[#9f9fa9] text-[10px] tracking-wide"
                                                    data-id="514dfd87-769e-5a46-8d70-11c26694b6fa"
                                                >
                                                    Venta Est.
                                                </span>
                                                <span
                                                    className="font-semibold text-[#f0b100] text-sm leading-5"
                                                    data-id="e4fa51ca-d731-5445-a8a4-839115217652"
                                                >
                                                    $148,000
                                                </span>
                                            </div>
                                            <div
                                                className="flex flex-col items-end gap-1"
                                                data-id="efe23ab5-a774-578b-b093-e331b7f3a9b8"
                                            >
                                                <span
                                                    className="uppercase text-[#9f9fa9] text-[10px] tracking-wide"
                                                    data-id="5c294155-e56f-5dbe-8ccc-d2e7bc999e37"
                                                >
                                                    Margen
                                                </span>
                                                <span
                                                    className="font-semibold text-neutral-50 text-sm leading-5"
                                                    data-id="034abaa4-901d-5798-9635-988e8d196898"
                                                >
                                                    $28,000
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter
                                        className="border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex px-0 pt-3 pb-0 justify-between items-center gap-0"
                                        data-id="dd26607d-195e-5a16-aca3-1d6782cc7b35"
                                    >
                                        <div
                                            className="flex items-center gap-1.5"
                                            data-id="9489a825-8dce-5385-abe9-1c06066e575f"
                                        >
                                            <Calendar
                                                className="size-3 text-[#9f9fa9]"
                                                data-id="9010ef58-f310-547f-b937-976eb63c198a"
                                            />
                                            <span
                                                className="text-[#9f9fa9] text-[10px]"
                                                data-id="006cab7a-0195-552a-97c5-c35c08709f50"
                                            >
                                                13 Jun 2025
                                            </span>
                                        </div>
                                        <div
                                            className="flex items-center gap-1.5"
                                            data-id="3d1b98a1-2ec7-599b-b541-703493b4ce33"
                                        >
                                            <MapPin
                                                className="size-3 text-[#9f9fa9]"
                                                data-id="036bdbf6-c647-53f4-92d1-f6e8138a2587"
                                            />
                                            <span
                                                className="text-[#9f9fa9] text-[10px]"
                                                data-id="9af05348-9551-5bbb-a77c-c0de36a449f2"
                                            >
                                                Sucursal Sur
                                            </span>
                                        </div>
                                    </CardFooter>
                                </Card>
                                <Card
                                    className="rounded-xl bg-zinc-900 border-white/10 border-0 border-solid p-4 gap-4"
                                    data-id="ed2d54d4-e94c-59e5-8f39-582eb9d262e3"
                                >
                                    <CardHeader
                                        className="p-0 gap-2"
                                        data-id="7862dfd9-6aed-52ca-be32-46f14676cc3d"
                                    >
                                        <div
                                            className="flex justify-between items-center"
                                            data-id="c3b6d28e-cdb7-5bf2-bdc1-196edcff6f45"
                                        >
                                            <div
                                                className="flex flex-col gap-0.5"
                                                data-id="a5febbad-6e83-5b12-a7b8-85b21c36c504"
                                            >
                                                <span
                                                    className="font-semibold text-neutral-50 text-base leading-6"
                                                    data-id="2074a919-d434-5835-bb97-f9dbf02cd33e"
                                                >
                                                    Mazda 3 2022
                                                </span>
                                                <span
                                                    className="text-[#9f9fa9] text-xs leading-4"
                                                    data-id="2bd6542a-177a-56e0-9480-d4a6ba31e4fc"
                                                >
                                                    Ana Rodríguez
                                                </span>
                                            </div>
                                            <div
                                                className="border-[oklch(0.6_0.15_250)] text-[oklch(0.7_0.15_250)] font-bold rounded-full text-[10px] border-black/1 border-1 border-solid px-2.5 py-1"
                                                data-id="cfb532c9-f579-5c9a-b495-3f830a8ef9d3"
                                            >
                                                Frío
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent
                                        className="p-0 gap-2"
                                        data-id="f8ea8ded-f11f-569e-94e5-a55728097628"
                                    >
                                        <div
                                            className="flex justify-between items-center"
                                            data-id="28e03dcf-efc9-521a-8338-167af14bb9d9"
                                        >
                                            <div
                                                className="flex flex-col gap-1"
                                                data-id="e34d919c-065d-5ff9-b9bb-3eb9dc53ddc9"
                                            >
                                                <span
                                                    className="uppercase text-[#9f9fa9] text-[10px] tracking-wide"
                                                    data-id="4dc0bdcc-84d5-5c9f-8398-518be48ae268"
                                                >
                                                    Oferta
                                                </span>
                                                <span
                                                    className="font-semibold text-neutral-50 text-sm leading-5"
                                                    data-id="aacf1676-7ed5-50bd-9ea1-96311d9e56ec"
                                                >
                                                    $210,000
                                                </span>
                                            </div>
                                            <div
                                                className="flex flex-col gap-1"
                                                data-id="587ef927-609f-5e91-8efb-f63b69ce5465"
                                            >
                                                <span
                                                    className="uppercase text-[#9f9fa9] text-[10px] tracking-wide"
                                                    data-id="5306a543-751b-54db-9e66-b553dd2a990c"
                                                >
                                                    Venta Est.
                                                </span>
                                                <span
                                                    className="font-semibold text-[#f0b100] text-sm leading-5"
                                                    data-id="d566a223-abc7-5831-9260-328c6b1382b6"
                                                >
                                                    $255,000
                                                </span>
                                            </div>
                                            <div
                                                className="flex flex-col items-end gap-1"
                                                data-id="945e2daa-1b0a-5dc2-a7c8-709cfa818205"
                                            >
                                                <span
                                                    className="uppercase text-[#9f9fa9] text-[10px] tracking-wide"
                                                    data-id="01566377-e522-5153-b490-c50eda9c04a9"
                                                >
                                                    Margen
                                                </span>
                                                <span
                                                    className="font-semibold text-neutral-50 text-sm leading-5"
                                                    data-id="3d97a79d-3e90-504e-bac8-1cccb933292a"
                                                >
                                                    $45,000
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter
                                        className="border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex px-0 pt-3 pb-0 justify-between items-center gap-0"
                                        data-id="78aaf599-5727-5333-8ecc-3242240363bc"
                                    >
                                        <div
                                            className="flex items-center gap-1.5"
                                            data-id="c58980cb-ac40-5018-8013-78beab9a0e2d"
                                        >
                                            <Calendar
                                                className="size-3 text-[#9f9fa9]"
                                                data-id="1f9406b7-634a-5ee3-b096-d4739a87f6fa"
                                            />
                                            <span
                                                className="text-[#9f9fa9] text-[10px]"
                                                data-id="87d43b1f-d924-5b02-8a7b-529d6d383fdd"
                                            >
                                                12 Jun 2025
                                            </span>
                                        </div>
                                        <div
                                            className="flex items-center gap-1.5"
                                            data-id="c050774e-b739-5985-bbfa-dcdd7f653bf9"
                                        >
                                            <MapPin
                                                className="size-3 text-[#9f9fa9]"
                                                data-id="9a5585c5-07ab-567c-8c38-aea8e840eac4"
                                            />
                                            <span
                                                className="text-[#9f9fa9] text-[10px]"
                                                data-id="28e023fb-ebc4-5f01-80f2-8a223f6fcf19"
                                            >
                                                Sucursal Norte
                                            </span>
                                        </div>
                                    </CardFooter>
                                </Card>
                                <Card
                                    className="rounded-xl bg-zinc-900 border-white/10 border-0 border-solid p-4 gap-4"
                                    data-id="cb29a168-9c1a-517d-bddc-a78648aff236"
                                >
                                    <CardHeader
                                        className="p-0 gap-2"
                                        data-id="823d4e97-c3b6-5e08-9bb8-79b84d399175"
                                    >
                                        <div
                                            className="flex justify-between items-center"
                                            data-id="c91a1ec1-d501-58e8-bce5-0d66afb6b377"
                                        >
                                            <div
                                                className="flex flex-col gap-0.5"
                                                data-id="d1023783-989f-565d-85e0-0a63dcf74461"
                                            >
                                                <span
                                                    className="font-semibold text-neutral-50 text-base leading-6"
                                                    data-id="fb64f183-98a9-59b3-a948-330885f742db"
                                                >
                                                    VW Jetta 2018
                                                </span>
                                                <span
                                                    className="text-[#9f9fa9] text-xs leading-4"
                                                    data-id="db5f72da-226d-53e1-968e-966c8445a942"
                                                >
                                                    Pedro Sánchez
                                                </span>
                                            </div>
                                            <div
                                                className="font-bold rounded-full bg-[#f0b100] text-[#733e0a] text-[10px] px-2.5 py-1"
                                                data-id="d2d0941a-0173-57c3-b326-d48a242b0261"
                                            >
                                                Toma
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent
                                        className="p-0 gap-2"
                                        data-id="5630b4e0-0f78-54f6-9350-09d2cb3832c8"
                                    >
                                        <div
                                            className="flex justify-between items-center"
                                            data-id="90817bc0-b7b3-5ea8-9224-401d1ace85ab"
                                        >
                                            <div
                                                className="flex flex-col gap-1"
                                                data-id="983ce9e8-b097-5d4b-9a15-3bd824796517"
                                            >
                                                <span
                                                    className="uppercase text-[#9f9fa9] text-[10px] tracking-wide"
                                                    data-id="244fc8e4-098c-57c1-a35f-00d8067f0691"
                                                >
                                                    Oferta
                                                </span>
                                                <span
                                                    className="font-semibold text-neutral-50 text-sm leading-5"
                                                    data-id="a192da13-1e5c-5ee5-9eed-6792c04a5fe5"
                                                >
                                                    $135,000
                                                </span>
                                            </div>
                                            <div
                                                className="flex flex-col gap-1"
                                                data-id="03741006-3840-5df3-b299-0cb46336090e"
                                            >
                                                <span
                                                    className="uppercase text-[#9f9fa9] text-[10px] tracking-wide"
                                                    data-id="506be0d3-882e-522b-bb4c-dbd885904b60"
                                                >
                                                    Venta Est.
                                                </span>
                                                <span
                                                    className="font-semibold text-[#f0b100] text-sm leading-5"
                                                    data-id="79f35868-158a-598d-82ed-60b89375e880"
                                                >
                                                    $168,000
                                                </span>
                                            </div>
                                            <div
                                                className="flex flex-col items-end gap-1"
                                                data-id="814610d1-d2fb-55c9-b439-845357a05545"
                                            >
                                                <span
                                                    className="uppercase text-[#9f9fa9] text-[10px] tracking-wide"
                                                    data-id="7f5d9517-7391-5771-93de-3bc3262f1e03"
                                                >
                                                    Margen
                                                </span>
                                                <span
                                                    className="font-semibold text-neutral-50 text-sm leading-5"
                                                    data-id="09a44367-1442-5926-8a2e-3c49036c1bd4"
                                                >
                                                    $33,000
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter
                                        className="border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex px-0 pt-3 pb-0 justify-between items-center gap-0"
                                        data-id="00c7d173-321a-5a1e-8637-d49732505749"
                                    >
                                        <div
                                            className="flex items-center gap-1.5"
                                            data-id="2f3d9027-048c-5918-961e-418ca5a99ea7"
                                        >
                                            <Calendar
                                                className="size-3 text-[#9f9fa9]"
                                                data-id="4052d85f-c935-5622-9aa5-61bee80912b5"
                                            />
                                            <span
                                                className="text-[#9f9fa9] text-[10px]"
                                                data-id="d8c23277-53c9-5274-85ec-7f87e511a8d7"
                                            >
                                                11 Jun 2025
                                            </span>
                                        </div>
                                        <div
                                            className="flex items-center gap-1.5"
                                            data-id="458b33e9-5620-55fc-a08a-1b03e0f4021e"
                                        >
                                            <MapPin
                                                className="size-3 text-[#9f9fa9]"
                                                data-id="e411cd5b-51b8-5b85-83a7-e1be703e64d8"
                                            />
                                            <span
                                                className="text-[#9f9fa9] text-[10px]"
                                                data-id="80512e52-8764-5851-8339-dc03f2f5ff8e"
                                            >
                                                Sucursal Centro
                                            </span>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    </div>
                    <div
                        className="fixed max-w-[375px] right-6 bottom-16"
                        data-id="bea7ef85-78d9-5973-b788-17aa9b654009"
                    >
                        <Button
                            className="shadow-lg shadow-primary/30 rounded-full bg-[#f0b100] text-[#733e0a] flex p-0 justify-center items-center w-14 h-14"
                            data-id="95fcc29d-51e5-5142-afac-c9635b58c3cc"
                        >
                            <Plus
                                className="size-6"
                                data-id="85ae8ee1-3a72-51e6-badc-6a31cbaa373d"
                            />
                        </Button>
                    </div>
                    <div
                        className="fixed max-w-[375px] bg-zinc-800 border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid inset-x-0 bottom-0 mx-auto"
                        data-id="7ed9391e-47c3-5920-bf56-42dd88a2f4f9"
                    >
                        <div
                            className="flex px-1 py-2 flex-row justify-around items-center"
                            data-id="779f4f3d-397e-5e02-8a05-98de83fe64e1"
                        >
                            <div
                                className="flex px-2 py-1 flex-col items-center gap-1"
                                data-id="8a17e490-cd4a-51c6-a649-e718258a02ed"
                            >
                                <Home
                                    className="size-5 text-[#9f9fa9]"
                                    data-id="d8b7a228-73a1-54ca-8d0d-59242a29d92e"
                                />
                                <span
                                    className="text-[#9f9fa9] text-[10px]"
                                    data-id="9fd809db-9110-592f-85d1-9f8e3ae33bb7"
                                >
                                    Inicio
                                </span>
                            </div>
                            <div
                                className="rounded-xl bg-[#f0b100] flex px-3 py-1 flex-col items-center gap-1"
                                data-id="74d835f0-85d0-53e6-9cc4-75278a1af6d9"
                            >
                                <ClipboardList
                                    className="size-5 text-[#733e0a]"
                                    data-id="a6dafbfb-007a-596d-b723-d2b7d0dca677"
                                />
                                <span
                                    className="font-semibold text-[#733e0a] text-[10px]"
                                    data-id="b278b947-ce94-5b45-8754-27a447412956"
                                >
                                    Avalúos
                                </span>
                            </div>
                            <div
                                className="flex px-2 py-1 flex-col items-center gap-1"
                                data-id="05816927-f1bd-54b8-9b68-ff8c24b6bc25"
                            >
                                <Users
                                    className="size-5 text-[#9f9fa9]"
                                    data-id="e8a28dbe-f173-5cbf-99c5-11095224e2ba"
                                />
                                <span
                                    className="text-[#9f9fa9] text-[10px]"
                                    data-id="95cc2332-c208-5804-b6c8-b9b3172e5ce1"
                                >
                                    Clientes
                                </span>
                            </div>
                            <div
                                className="flex px-2 py-1 flex-col items-center gap-1"
                                data-id="750f8d0a-a4d3-53bc-b687-5b42e485963e"
                            >
                                <HandCoins
                                    className="size-5 text-[#9f9fa9]"
                                    data-id="29561e08-08f0-5b40-bf02-8e1973c43ea0"
                                />
                                <span
                                    className="text-[#9f9fa9] text-[10px]"
                                    data-id="d0bb617d-f761-5a14-b63e-ddc96ddff47f"
                                >
                                    Apartados
                                </span>
                            </div>
                            <div
                                className="flex px-2 py-1 flex-col items-center gap-1"
                                data-id="9ed1b761-2c33-56ad-bcd9-2cd1ad6c6c86"
                            >
                                <Car
                                    className="size-5 text-[#9f9fa9]"
                                    data-id="bfa54fd0-6472-5f78-ab44-bb32e615aad4"
                                />
                                <span
                                    className="text-[#9f9fa9] text-[10px]"
                                    data-id="477aefa4-dc95-59e0-b7ad-6ce561e4a291"
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
