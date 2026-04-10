import { useEffect } from "react";
import {
    Car,
    ClipboardList,
    HandCoins,
    Home,
    MessageSquare,
    Phone,
    Plus,
    Search,
    Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function App() {
    return (
        <div>
            <div
                className="bg-zinc-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible"
                style={{ fontFamily: "sans-serif", minHeight: 812, maxWidth: 375 }}
                data-id="cf4f8e04-3f41-5df9-8695-5099e57dcecf"
            >
                <div
                    className="flex flex-col"
                    style={{ minHeight: 812 }}
                    data-id="f4da1896-682f-524a-8516-4d305b35a0b2"
                >
                    <div
                        className="overflow-y-auto flex px-6 pt-6 pb-4 flex-col flex-1 gap-6"
                        data-id="c4ef2f22-d3af-524a-a6ab-01b91dd03372"
                    >
                        <div
                            className="flex justify-between items-center"
                            data-id="98936567-bed0-584f-a977-f17b65cd89a5"
                        >
                            <h1
                                className="font-bold text-neutral-50 text-2xl leading-8"
                                data-id="9306c4c9-a7bd-545d-ab02-8eb5bcf2044f"
                            >
                                Clientes
                            </h1>
                            <button
                                className="font-semibold rounded-lg bg-[#f0b100] text-[#733e0a] text-sm leading-5 flex px-4 py-2 items-center gap-2"
                                data-id="ad45d4d6-8a79-5666-b323-dc316356bf80"
                            >
                                <Plus
                                    className="size-4"
                                    data-id="e1b0bbbc-2ea2-5efb-8566-33749558a63b"
                                />
                                <span data-id="45b5cb63-d746-5da6-8c50-45df3a7a6e02">
                                    Nuevo
                                </span>
                            </button>
                        </div>
                        <div
                            className="rounded-xl bg-zinc-900 flex px-4 py-3 items-center gap-2"
                            data-id="fcb777c7-40aa-53a9-a28c-d5d75d700b07"
                        >
                            <Search
                                className="size-4 text-[#9f9fa9]"
                                data-id="0527af2a-fce5-5034-bbee-b644fcc73ea9"
                            />
                            <span
                                className="text-[#9f9fa9] text-sm leading-5"
                                data-id="a95ed36f-ad33-5a06-8198-8e58ff28f189"
                            >
                                Buscar por nombre o teléfono
                            </span>
                        </div>
                        <div
                            className="overflow-x-auto flex items-center gap-2"
                            data-id="acc2acbd-a1b7-5f93-9cd9-9d4939d0ba9f"
                        >
                            <span
                                className="whitespace-nowrap font-semibold rounded-full bg-[#f0b100] text-[#733e0a] text-xs leading-4 px-4 py-1.5"
                                data-id="c439f188-271b-567e-b79b-0239f9361052"
                            >
                                Todos
                            </span>
                            <span
                                className="whitespace-nowrap font-medium rounded-full bg-zinc-900 text-[#9f9fa9] text-xs leading-4 border-white/10 border-1 border-solid px-4 py-1.5"
                                data-id="603f1600-7e0a-59af-9776-09c73385a7ab"
                            >
                                Ads
                            </span>
                            <span
                                className="whitespace-nowrap font-medium rounded-full bg-zinc-900 text-[#9f9fa9] text-xs leading-4 border-white/10 border-1 border-solid px-4 py-1.5"
                                data-id="a53313cf-a7b0-520e-bf38-3e63860723b1"
                            >
                                Piso
                            </span>
                            <span
                                className="whitespace-nowrap font-medium rounded-full bg-zinc-900 text-[#9f9fa9] text-xs leading-4 border-white/10 border-1 border-solid px-4 py-1.5"
                                data-id="baadbbd1-f8ad-5be8-86c4-21a60b6551c0"
                            >
                                Redes
                            </span>
                        </div>
                        <div
                            className="flex flex-col gap-4"
                            data-id="095debf3-6fed-522f-8bc0-4950ed46781f"
                        >
                            <Card
                                className="cursor-pointer rounded-xl bg-zinc-900 border-white/10 border-0 border-solid p-4 gap-4"
                                data-id="f191cfe1-d07a-52d9-8563-e347bd3fa19c"
                            >
                                <CardContent
                                    className="flex p-0 flex-col gap-2"
                                    data-id="c67142cc-d3b4-5948-8d78-3ebbab22baef"
                                >
                                    <div
                                        className="flex justify-between items-center"
                                        data-id="894485f0-851c-5705-ac00-862bec98e408"
                                    >
                                        <span
                                            className="font-bold text-neutral-50 text-base leading-6"
                                            data-id="e84cf368-ac7e-5200-b37b-f64404a63431"
                                        >
                                            Carlos Mendoza
                                        </span>
                                        <div
                                            className="flex items-center gap-2"
                                            data-id="8d536be6-4dfb-5a13-a0ef-22512f29128c"
                                        >
                                            <span
                                                className="flex items-center gap-1"
                                                data-id="baa59abe-38ec-5da1-a253-22e9c67ae0ee"
                                            >
                                                <span
                                                    className="size-2 rounded-full"
                                                    style={{
                                                        backgroundColor: "oklch(0.645 0.246 16.439)",
                                                    }}
                                                    data-id="8046f55a-d118-571f-bf89-f0a15e85ae74"
                                                />
                                                <span
                                                    className="text-[#9f9fa9] text-xs leading-4"
                                                    data-id="25a403d0-4ab1-50eb-b541-8a6bbb518f89"
                                                >
                                                    Caliente
                                                </span>
                                            </span>
                                            <span
                                                className="font-medium rounded-full bg-purple-600/20 text-purple-400 text-xs leading-4 px-2.5 py-0.5"
                                                data-id="bea54a11-d32e-5e97-b0e7-e337a39443a2"
                                            >
                                                Ads
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center gap-2"
                                        data-id="30f10d6f-e34d-5265-ae96-22c3460f721a"
                                    >
                                        <Phone
                                            className="size-3.5 text-[#9f9fa9]"
                                            data-id="d0a56415-69c6-545b-8946-f37100501eab"
                                        />
                                        <span
                                            className="text-[#9f9fa9] text-sm leading-5"
                                            data-id="6d610093-0ef9-5355-8da2-52587fc1d4b4"
                                        >
                                            +52 55 1234 5678
                                        </span>
                                    </div>
                                    <div
                                        className="flex justify-between items-center"
                                        data-id="5b4435be-a6b5-51b6-9767-b175fa358b2d"
                                    >
                                        <div
                                            className="flex items-center gap-1.5"
                                            data-id="5e37f628-410b-52d7-a759-38e4b34a5407"
                                        >
                                            <Car
                                                className="size-3.5 text-[#9f9fa9]"
                                                data-id="58b5a8db-fbc3-5d9a-b365-e833724578e0"
                                            />
                                            <span
                                                className="text-[#9f9fa9] text-xs leading-4"
                                                data-id="3f254268-ca44-505d-af6e-f0ff85c359c8"
                                            >
                                                3 autos de interés
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center gap-1.5"
                                        data-id="7cae2237-2a4c-582f-8d07-9df2db745d8a"
                                    >
                                        <MessageSquare
                                            className="size-3.5 text-[#9f9fa9]"
                                            data-id="8f8c04d9-2968-5420-bbdb-dd04fd09a978"
                                        />
                                        <span
                                            className="truncate text-[#9f9fa9] text-xs leading-4"
                                            data-id="4991e4b7-b01e-5ae1-a850-d518910411b8"
                                        >
                                            Interesado en Camaro 2022, pidió cotización...
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card
                                className="cursor-pointer rounded-xl bg-zinc-900 border-white/10 border-0 border-solid p-4 gap-4"
                                data-id="2a16061d-3daf-52ae-92ed-32db578771e6"
                            >
                                <CardContent
                                    className="flex p-0 flex-col gap-2"
                                    data-id="9037744e-5c3a-577e-abe5-b6a6c781dc32"
                                >
                                    <div
                                        className="flex justify-between items-center"
                                        data-id="6d32f605-91fe-5a4a-a2aa-47fefc906e7a"
                                    >
                                        <span
                                            className="font-bold text-neutral-50 text-base leading-6"
                                            data-id="8baec078-225e-5d63-a4b9-f182e04f36fe"
                                        >
                                            Ana García López
                                        </span>
                                        <div
                                            className="flex items-center gap-2"
                                            data-id="2fb829e5-e89e-5a89-b7b2-80fad6d1df0f"
                                        >
                                            <span
                                                className="flex items-center gap-1"
                                                data-id="16b3c828-064c-5117-be7d-2cd5dae917eb"
                                            >
                                                <span
                                                    className="size-2 rounded-full"
                                                    style={{
                                                        backgroundColor: "oklch(0.769 0.188 70.08)",
                                                    }}
                                                    data-id="50caaf4d-6b7e-5efc-8fa1-b3d7ed4abce3"
                                                />
                                                <span
                                                    className="text-[#9f9fa9] text-xs leading-4"
                                                    data-id="68133467-9390-510d-944e-a7e2f964133c"
                                                >
                                                    Tibio
                                                </span>
                                            </span>
                                            <span
                                                className="font-medium rounded-full bg-blue-600/20 text-blue-400 text-xs leading-4 px-2.5 py-0.5"
                                                data-id="2c4eb52d-ea06-5dfd-bda8-7536992f6bb4"
                                            >
                                                Piso
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center gap-2"
                                        data-id="127f7677-03f7-514e-a0d1-20d3eaa5f81b"
                                    >
                                        <Phone
                                            className="size-3.5 text-[#9f9fa9]"
                                            data-id="f3bb3f4b-27a8-5f19-a143-94df335eef81"
                                        />
                                        <span
                                            className="text-[#9f9fa9] text-sm leading-5"
                                            data-id="7ad77e4a-ef87-5fca-aaa6-7c5c908269db"
                                        >
                                            +52 33 9876 5432
                                        </span>
                                    </div>
                                    <div
                                        className="flex justify-between items-center"
                                        data-id="7356c542-8db5-5532-b9da-458d226e203d"
                                    >
                                        <div
                                            className="flex items-center gap-1.5"
                                            data-id="1ae6a27b-94f7-59e5-a64a-5310b3992395"
                                        >
                                            <Car
                                                className="size-3.5 text-[#9f9fa9]"
                                                data-id="356cbb02-c853-5b4b-8a98-5054d259e2a2"
                                            />
                                            <span
                                                className="text-[#9f9fa9] text-xs leading-4"
                                                data-id="7c29d593-8e54-5131-a33b-83fcfa7eff3f"
                                            >
                                                2 autos de interés
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center gap-1.5"
                                        data-id="9da002d8-1e8d-5cd6-aa16-d95ed936693f"
                                    >
                                        <MessageSquare
                                            className="size-3.5 text-[#9f9fa9]"
                                            data-id="8c484d67-9563-56c9-acdc-428513a578e5"
                                        />
                                        <span
                                            className="truncate text-[#9f9fa9] text-xs leading-4"
                                            data-id="fc83d229-9b94-5a5e-910c-8ebef5eb3a17"
                                        >
                                            Visitó el lote, probó la Tucson 2023...
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card
                                className="cursor-pointer rounded-xl bg-zinc-900 border-white/10 border-0 border-solid p-4 gap-4"
                                data-id="7f6ce1d9-ff0b-534d-a88f-942418190a37"
                            >
                                <CardContent
                                    className="flex p-0 flex-col gap-2"
                                    data-id="f9c52ffc-9b01-5adf-b4cb-851955497eb9"
                                >
                                    <div
                                        className="flex justify-between items-center"
                                        data-id="da95ca69-f74a-5f43-9dcf-ba5dbaf26e4e"
                                    >
                                        <span
                                            className="font-bold text-neutral-50 text-base leading-6"
                                            data-id="fba4731f-00ef-5975-abf3-24470ffaccfd"
                                        >
                                            Roberto Sánchez
                                        </span>
                                        <div
                                            className="flex items-center gap-2"
                                            data-id="48cc462f-cd23-501e-9a5f-7640e8ce1669"
                                        >
                                            <span
                                                className="flex items-center gap-1"
                                                data-id="a64f7779-9214-5d75-9bf0-ab3f86c49228"
                                            >
                                                <span
                                                    className="size-2 rounded-full"
                                                    style={{
                                                        backgroundColor: "oklch(0.488 0.243 264.376)",
                                                    }}
                                                    data-id="4b22353c-62e9-5208-b014-45e1ae1ba622"
                                                />
                                                <span
                                                    className="text-[#9f9fa9] text-xs leading-4"
                                                    data-id="f6f74187-9e38-55f3-a7fc-dd58c7ed406f"
                                                >
                                                    Frío
                                                </span>
                                            </span>
                                            <span
                                                className="font-medium rounded-full bg-green-600/20 text-green-400 text-xs leading-4 px-2.5 py-0.5"
                                                data-id="b3c751ff-15d9-510e-bb12-ecd4ec48ca87"
                                            >
                                                Redes
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center gap-2"
                                        data-id="b99fd7e7-6a10-54a7-98e9-cbbf26764789"
                                    >
                                        <Phone
                                            className="size-3.5 text-[#9f9fa9]"
                                            data-id="7dc8e96d-e826-5a5b-b83e-2c72c804b489"
                                        />
                                        <span
                                            className="text-[#9f9fa9] text-sm leading-5"
                                            data-id="eefca00d-6858-55da-8635-b71c54161763"
                                        >
                                            +52 81 5555 1234
                                        </span>
                                    </div>
                                    <div
                                        className="flex justify-between items-center"
                                        data-id="6b34cca2-e8b1-50cd-b315-dcb03c73dd20"
                                    >
                                        <div
                                            className="flex items-center gap-1.5"
                                            data-id="440930e8-3cc1-5274-959d-96071880449c"
                                        >
                                            <Car
                                                className="size-3.5 text-[#9f9fa9]"
                                                data-id="0e21a8db-bf2d-5334-8651-0e9f75de42db"
                                            />
                                            <span
                                                className="text-[#9f9fa9] text-xs leading-4"
                                                data-id="4094759d-268b-56d8-8cb6-83b6937a0135"
                                            >
                                                1 auto de interés
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center gap-1.5"
                                        data-id="caa79d22-016d-5684-82b5-8f3630533b50"
                                    >
                                        <MessageSquare
                                            className="size-3.5 text-[#9f9fa9]"
                                            data-id="7658b29d-3047-5ce4-9916-5d1aa09b95fa"
                                        />
                                        <span
                                            className="truncate text-[#9f9fa9] text-xs leading-4"
                                            data-id="6b5e3805-9b21-5cc2-9ea5-20ec03d3697a"
                                        >
                                            Preguntó precio por Instagram DM...
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card
                                className="cursor-pointer rounded-xl bg-zinc-900 border-white/10 border-0 border-solid p-4 gap-4"
                                data-id="caef4a4a-cc4c-5924-8e70-324db2110514"
                            >
                                <CardContent
                                    className="flex p-0 flex-col gap-2"
                                    data-id="f129e7e9-0e1e-54ed-af31-0e31574666d7"
                                >
                                    <div
                                        className="flex justify-between items-center"
                                        data-id="03619cd5-c2e4-51b7-9a6f-94ace59c0aff"
                                    >
                                        <span
                                            className="font-bold text-neutral-50 text-base leading-6"
                                            data-id="2200b32d-7dd9-5ef0-8996-e27c41c92d83"
                                        >
                                            María Fernanda Ruiz
                                        </span>
                                        <div
                                            className="flex items-center gap-2"
                                            data-id="17154a72-2355-588a-8cd9-0de23d5d1b00"
                                        >
                                            <span
                                                className="flex items-center gap-1"
                                                data-id="de2abe00-0075-5dbf-b6a7-5e77495b7d6a"
                                            >
                                                <span
                                                    className="size-2 rounded-full"
                                                    style={{
                                                        backgroundColor: "oklch(0.645 0.246 16.439)",
                                                    }}
                                                    data-id="f927d81f-b617-5f43-9e64-fcc68cf4c397"
                                                />
                                                <span
                                                    className="text-[#9f9fa9] text-xs leading-4"
                                                    data-id="84f7e7b3-9f88-564c-8691-e2f429f587b7"
                                                >
                                                    Caliente
                                                </span>
                                            </span>
                                            <span
                                                className="font-medium rounded-full bg-purple-600/20 text-purple-400 text-xs leading-4 px-2.5 py-0.5"
                                                data-id="97e01d1b-1ce5-5f65-b5c0-e6a48c5b612a"
                                            >
                                                Ads
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center gap-2"
                                        data-id="db860c7c-4471-5425-8953-2e7ca8372d9b"
                                    >
                                        <Phone
                                            className="size-3.5 text-[#9f9fa9]"
                                            data-id="5fa260b1-9f6e-5ec6-968a-946691a20042"
                                        />
                                        <span
                                            className="text-[#9f9fa9] text-sm leading-5"
                                            data-id="a2a6b353-e650-549e-82c6-f86228577598"
                                        >
                                            +52 55 4321 8765
                                        </span>
                                    </div>
                                    <div
                                        className="flex justify-between items-center"
                                        data-id="ae31b777-cd30-53aa-9ce0-b0ce1e955a68"
                                    >
                                        <div
                                            className="flex items-center gap-1.5"
                                            data-id="23d7a7e0-0ad4-5c3e-a21c-f93a542cc29c"
                                        >
                                            <Car
                                                className="size-3.5 text-[#9f9fa9]"
                                                data-id="06cd8bbe-f183-541b-abb5-dc5fd40163d2"
                                            />
                                            <span
                                                className="text-[#9f9fa9] text-xs leading-4"
                                                data-id="4072e8c7-1590-5c4b-8da2-35eaefa5017b"
                                            >
                                                4 autos de interés
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center gap-1.5"
                                        data-id="ebdd5e7b-cbad-567d-a26d-08ca2dc93f03"
                                    >
                                        <MessageSquare
                                            className="size-3.5 text-[#9f9fa9]"
                                            data-id="47a8a0b1-3bd6-5261-b7ac-628663d94598"
                                        />
                                        <span
                                            className="truncate text-[#9f9fa9] text-xs leading-4"
                                            data-id="d9441e12-400f-53fb-8a09-194c95e66d02"
                                        >
                                            Quiere apartar la Mazda CX-5, pide financiamiento...
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card
                                className="cursor-pointer rounded-xl bg-zinc-900 border-white/10 border-0 border-solid p-4 gap-4"
                                data-id="1b5f7cd7-474c-50bc-a5e2-433b681ac0ba"
                            >
                                <CardContent
                                    className="flex p-0 flex-col gap-2"
                                    data-id="9c38c5d0-695a-5b15-9543-2ec3612996d8"
                                >
                                    <div
                                        className="flex justify-between items-center"
                                        data-id="1fa574c0-803f-56f0-809e-7b63a8292fa0"
                                    >
                                        <span
                                            className="font-bold text-neutral-50 text-base leading-6"
                                            data-id="d6c1139d-bfdc-5d84-82b3-7d8de76ff7b1"
                                        >
                                            Jorge Hernández
                                        </span>
                                        <div
                                            className="flex items-center gap-2"
                                            data-id="0f1aec8a-c239-55b2-9842-b881d24d2d21"
                                        >
                                            <span
                                                className="flex items-center gap-1"
                                                data-id="ef388bbb-9792-5771-a8b9-683bfa6c53c0"
                                            >
                                                <span
                                                    className="size-2 rounded-full"
                                                    style={{
                                                        backgroundColor: "oklch(0.769 0.188 70.08)",
                                                    }}
                                                    data-id="bd196f3d-10d8-553a-aa55-c7bef8b826e0"
                                                />
                                                <span
                                                    className="text-[#9f9fa9] text-xs leading-4"
                                                    data-id="b8653f5d-eb0f-5195-a06b-780ee77af9de"
                                                >
                                                    Tibio
                                                </span>
                                            </span>
                                            <span
                                                className="font-medium rounded-full bg-blue-600/20 text-blue-400 text-xs leading-4 px-2.5 py-0.5"
                                                data-id="1743daf8-b65f-5051-8d47-a6443548fbe8"
                                            >
                                                Piso
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center gap-2"
                                        data-id="043a12bd-e2b1-5405-813a-afe51db9fb0a"
                                    >
                                        <Phone
                                            className="size-3.5 text-[#9f9fa9]"
                                            data-id="dd0e56b3-fb62-5a7f-ab30-a2f94796f6fd"
                                        />
                                        <span
                                            className="text-[#9f9fa9] text-sm leading-5"
                                            data-id="87bfb222-0b5b-517a-b3fd-d55b16574a7a"
                                        >
                                            +52 33 7777 4444
                                        </span>
                                    </div>
                                    <div
                                        className="flex justify-between items-center"
                                        data-id="08ebfa5f-6a09-54b2-a71a-b3a7b37ae349"
                                    >
                                        <div
                                            className="flex items-center gap-1.5"
                                            data-id="00a1b4ea-4416-5f75-b428-966df2b802be"
                                        >
                                            <Car
                                                className="size-3.5 text-[#9f9fa9]"
                                                data-id="011284c5-a15e-5f24-9922-53c20a44f77e"
                                            />
                                            <span
                                                className="text-[#9f9fa9] text-xs leading-4"
                                                data-id="892cdee4-0234-5fdc-8659-245ccb641028"
                                            >
                                                2 autos de interés
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center gap-1.5"
                                        data-id="2dbbf1a3-2697-5e84-8d58-08aeacd4338b"
                                    >
                                        <MessageSquare
                                            className="size-3.5 text-[#9f9fa9]"
                                            data-id="3bddcaf7-3b7b-5f07-ac78-e5cdae537917"
                                        />
                                        <span
                                            className="truncate text-[#9f9fa9] text-xs leading-4"
                                            data-id="0697b039-4902-50b3-9fcc-edb314bc32c7"
                                        >
                                            Regresó a ver la Civic, comparando con Corolla...
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div
                        className="bg-zinc-900 border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex p-2 flex-row justify-around items-center"
                        data-id="d4329ff2-bf29-5bb5-82a8-bd36f19edbb8"
                    >
                        <div
                            className="flex px-2 py-1 flex-col items-center gap-1"
                            data-id="74f39594-02fa-5e32-a2d7-d4746adac46d"
                        >
                            <Home
                                className="size-5 text-[#9f9fa9]"
                                data-id="8579beb7-52c1-521d-8ea1-b55424aa2804"
                            />
                            <span
                                className="text-[#9f9fa9] text-xs leading-4"
                                data-id="1b72ba41-b862-5a1c-9697-9ad983562f84"
                            >
                                Inicio
                            </span>
                        </div>
                        <div
                            className="flex px-2 py-1 flex-col items-center gap-1"
                            data-id="73032949-4290-5094-9e2b-59c48c7530c3"
                        >
                            <ClipboardList
                                className="size-5 text-[#9f9fa9]"
                                data-id="830ca425-62dc-587a-b513-ef940ff21885"
                            />
                            <span
                                className="text-[#9f9fa9] text-xs leading-4"
                                data-id="2c38b7b8-00e1-597c-b371-37e6cd146c11"
                            >
                                Avalúos
                            </span>
                        </div>
                        <div
                            className="rounded-xl bg-[#f0b100] flex px-2 py-1 flex-col items-center gap-1"
                            data-id="bdaf1279-b263-5c9e-bc65-83a6fddc12e8"
                        >
                            <Users
                                className="size-5 text-[#733e0a]"
                                data-id="916f2109-9210-5dd5-9fac-3876ed16eab9"
                            />
                            <span
                                className="font-semibold text-[#733e0a] text-xs leading-4"
                                data-id="ba80a484-d846-5ed5-84dc-0db49a35a113"
                            >
                                Clientes
                            </span>
                        </div>
                        <div
                            className="flex px-2 py-1 flex-col items-center gap-1"
                            data-id="8c70d8ae-8bc4-5de6-a9f6-54002ffaea8e"
                        >
                            <HandCoins
                                className="size-5 text-[#9f9fa9]"
                                data-id="5ed267a4-74b8-52f3-91cf-4f9b4fc1be0b"
                            />
                            <span
                                className="text-[#9f9fa9] text-xs leading-4"
                                data-id="653ad178-b5d9-539a-abbe-cd71c44d38f3"
                            >
                                Apartados
                            </span>
                        </div>
                        <div
                            className="flex px-2 py-1 flex-col items-center gap-1"
                            data-id="1cdf07ee-596a-5d2d-8606-508741e31641"
                        >
                            <Car
                                className="size-5 text-[#9f9fa9]"
                                data-id="d1fa9b12-8682-5333-a56f-c1bc4d706088"
                            />
                            <span
                                className="text-[#9f9fa9] text-xs leading-4"
                                data-id="e14d350b-3d8d-5d88-8f02-276bb0e3f1ed"
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
