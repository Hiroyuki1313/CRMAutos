import { useEffect } from "react";
import {
    ArrowLeft,
    Car,
    ChevronRight,
    ClipboardList,
    FileText,
    HandCoins,
    Home,
    MapPin,
    MessageCircle,
    Phone,
    Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export default function App() {
    return (
        <div>
            <div
                className="bg-zinc-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible"
                style={{
                    fontFamily: "sans-serif",
                    maxWidth: 375,
                    minHeight: 812,
                    position: "relative",
                }}
                data-id="a8d0b41f-5a83-5ae2-b188-1915b0ed638c"
            >
                <div
                    style={{ paddingBottom: 140 }}
                    data-id="881d4d77-3923-50ba-89bf-b670228c63d5"
                >
                    <div
                        className="px-6 pt-6 pb-4"
                        data-id="9d6240ca-9a4b-50e1-b169-9f07840e0a39"
                    >
                        <div
                            className="flex mb-4 items-center gap-4"
                            data-id="cc1caf37-378e-5904-9e1c-42ce4241b021"
                        >
                            <div
                                className="rounded-full flex justify-center items-center w-8 h-8"
                                style={{ backgroundColor: "oklch(0.274 0.006 286.033)" }}
                                data-id="91b4acf1-ec71-5481-a47b-d39a55c69aad"
                            >
                                <ArrowLeft
                                    className="size-5 text-neutral-50"
                                    data-id="e642270e-fd4c-57cd-bad4-7ee11b1efcfd"
                                />
                            </div>
                            <div
                                className="flex-1"
                                data-id="b9079d19-b40d-5d2a-9409-7aeb0e87ecce"
                            >
                                <h1
                                    className="font-bold text-neutral-50 text-xl leading-7"
                                    data-id="f1c2cdec-afb6-5cfb-a3c9-a22773fc0fb6"
                                >
                                    Roberto Méndez
                                </h1>
                                <p
                                    className="text-sm leading-5"
                                    style={{ color: "oklch(0.705 0.015 286.067)" }}
                                    data-id="30f9a195-277b-57ea-af5f-c9d38e0bc6e1"
                                >
                                    +52 81 2345 6789
                                </p>
                            </div>
                            <span
                                className="font-semibold rounded-full text-xs leading-4 px-3 py-1"
                                style={{
                                    backgroundColor: "oklch(0.488 0.243 264.376)",
                                    color: "white",
                                }}
                                data-id="5280a61e-32e7-5270-aec4-027edeb86c31"
                            >
                                Ads
                            </span>
                        </div>
                        <div
                            className="border-black/1 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex gap-6"
                            style={{ borderColor: "oklch(1 0 0 / 10%)" }}
                            data-id="94a6134e-b186-5c66-a3db-d91f4c009923"
                        >
                            <button
                                className="font-semibold text-sm leading-5 pb-2"
                                style={{
                                    color: "oklch(0.795 0.184 86.047)",
                                    borderBottom: "2px solid oklch(0.795 0.184 86.047)",
                                }}
                                data-id="b5794b6f-6ab2-5ef6-bdd2-9fcab666132d"
                            >
                                Info
                            </button>
                            <button
                                className="font-medium text-sm leading-5 pb-2"
                                style={{ color: "oklch(0.705 0.015 286.067)" }}
                                data-id="ee8f89c0-8505-507e-8a18-ccb542aef8b0"
                            >
                                Documentos
                            </button>
                        </div>
                    </div>
                    <div
                        className="flex px-6 flex-col gap-6"
                        data-id="95a6d478-21ec-5e55-b574-7bf8fa6e1108"
                    >
                        <div
                            className="flex flex-col gap-2"
                            data-id="aaaf07ad-45b4-57f9-a822-bdc816e69b37"
                        >
                            <h3
                                className="font-semibold uppercase text-xs leading-4 tracking-wider"
                                style={{ color: "oklch(0.705 0.015 286.067)" }}
                                data-id="4398bd71-685a-5666-87fe-f92ebfa5fc4f"
                            >
                                Probabilidad
                            </h3>
                            <div
                                className="rounded-xl flex overflow-hidden"
                                style={{ backgroundColor: "oklch(0.21 0.006 285.885)" }}
                                data-id="be9b171d-c3b5-5778-b56d-e5199fe3d5f9"
                            >
                                <div
                                    className="font-medium text-center text-xs leading-4 py-2 flex-1"
                                    style={{ color: "oklch(0.705 0.015 286.067)" }}
                                    data-id="9b89132e-0ab0-5646-9f10-ca56f5e7fe10"
                                >
                                    Frío
                                </div>
                                <div
                                    className="font-medium text-center text-xs leading-4 py-2 flex-1"
                                    style={{ color: "oklch(0.705 0.015 286.067)" }}
                                    data-id="36b6dcf8-8cdc-546b-9190-9169e2a161b6"
                                >
                                    Tibio
                                </div>
                                <div
                                    className="font-bold text-center rounded-xl text-xs leading-4 py-2 flex-1"
                                    style={{
                                        backgroundColor: "oklch(0.795 0.184 86.047)",
                                        color: "oklch(0.141 0.005 285.823)",
                                    }}
                                    data-id="c279e0be-5288-5564-8c20-dcde5841ddbd"
                                >
                                    Caliente
                                </div>
                            </div>
                        </div>
                        <div
                            className="flex flex-col gap-2"
                            data-id="f77214e4-3eee-5984-9164-d2394f96756f"
                        >
                            <h3
                                className="font-semibold uppercase text-xs leading-4 tracking-wider"
                                style={{ color: "oklch(0.705 0.015 286.067)" }}
                                data-id="7af4197e-8ca0-54ee-a179-5ad4bc93c1a6"
                            >
                                Autos de Interés
                            </h3>
                            <div
                                className="flex flex-col gap-2"
                                data-id="c871cf89-368f-50ec-956a-895a969c8428"
                            >
                                <Card
                                    className="p-4 flex-row items-center gap-2"
                                    style={{
                                        backgroundColor: "oklch(0.21 0.006 285.885)",
                                        border: "none",
                                    }}
                                    data-id="f0b26949-afa3-5590-8e0b-dc542d9fc82e"
                                >
                                    <div
                                        className="flex-shrink-0 rounded-lg w-20 h-14 overflow-hidden"
                                        data-id="13fa1101-4cc3-5241-996c-f2ec08500124"
                                    >
                                        <img
                                            src="https://images.unsplash.com/photo-1761486554787-89b2b4eb64ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBzZWRhbiUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDF8MHx8fDE3NzU3NDk4NjB8MA&ixlib=rb-4.1.0&q=80&w=400"
                                            alt="BMW M3 (G20)"
                                            className="object-cover w-full h-full"
                                            data-photoid="o-2g4PViOQo"
                                            data-authorname="Roman"
                                            data-authorurl="https://unsplash.com/@rm_reins"
                                            data-blurhash="LKF~EbM}4:Mx$wxu4:sl~Ut6xuWA"
                                            data-id="d6dc000f-b8d6-5566-800b-f80dc197b250"
                                        />
                                    </div>
                                    <div
                                        className="flex flex-col flex-1 gap-1"
                                        data-id="7d97e157-6c7b-5f89-b12d-721bb9df16fb"
                                    >
                                        <p
                                            className="font-bold text-neutral-50 text-sm leading-5"
                                            data-id="d4c1d821-82b2-5681-bdff-f3a883cb137d"
                                        >
                                            BMW M3
                                        </p>
                                        <p
                                            className="text-xs leading-4"
                                            style={{ color: "oklch(0.705 0.015 286.067)" }}
                                            data-id="1e3fd9c2-fb8c-5950-80ce-d0a27fbd3bcf"
                                        >
                                            Sedán · 2023
                                        </p>
                                    </div>
                                    <span
                                        className="font-semibold rounded-full text-xs leading-4 px-2 py-0.5"
                                        style={{
                                            backgroundColor: "oklch(0.696 0.17 162.48)",
                                            color: "oklch(0.141 0.005 285.823)",
                                        }}
                                        data-id="38d98151-47d2-5509-805c-9eff60ba54e3"
                                    >
                                        Disponible
                                    </span>
                                </Card>
                                <Card
                                    className="p-4 flex-row items-center gap-2"
                                    style={{
                                        backgroundColor: "oklch(0.21 0.006 285.885)",
                                        border: "none",
                                    }}
                                    data-id="58a63199-2b51-5e6a-9297-07d53621944c"
                                >
                                    <div
                                        className="flex-shrink-0 rounded-lg w-20 h-14 overflow-hidden"
                                        data-id="bb13e900-31b6-5f38-8895-88e121a033a0"
                                    >
                                        <img
                                            src="https://images.unsplash.com/photo-1767800890927-aebbe5540d61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxTVVYlMjBjYXIlMjBkYXJrJTIwc2hvd3Jvb218ZW58MXwwfHx8MTc3NTc0OTg2MHww&ixlib=rb-4.1.0&q=80&w=400"
                                            alt="Lincoln Navigator"
                                            className="object-cover w-full h-full"
                                            data-photoid="CAgZ-A-zZ5s"
                                            data-authorname="Obi"
                                            data-authorurl="https://unsplash.com/@obionyeador"
                                            data-blurhash="LtI=P*adxutRNGofR*ay~qf6j[ax"
                                            data-id="25e62796-cdce-5013-94cf-3f498750cd6a"
                                        />
                                    </div>
                                    <div
                                        className="flex flex-col flex-1 gap-1"
                                        data-id="eaacc3df-3134-589b-a853-0d2fab06d076"
                                    >
                                        <p
                                            className="font-bold text-neutral-50 text-sm leading-5"
                                            data-id="c7b20ebd-68de-5dfc-a316-e4298c9f61f5"
                                        >
                                            Lincoln Navigator
                                        </p>
                                        <p
                                            className="text-xs leading-4"
                                            style={{ color: "oklch(0.705 0.015 286.067)" }}
                                            data-id="d36ff981-0f04-5fb8-97db-0efa7b8bffb8"
                                        >
                                            SUV · 2024
                                        </p>
                                    </div>
                                    <span
                                        className="font-semibold rounded-full text-xs leading-4 px-2 py-0.5"
                                        style={{
                                            backgroundColor: "oklch(0.795 0.184 86.047)",
                                            color: "oklch(0.141 0.005 285.823)",
                                        }}
                                        data-id="38529335-e3aa-59ab-aaee-a79b5568a554"
                                    >
                                        Apartado
                                    </span>
                                </Card>
                            </div>
                        </div>
                        <div
                            className="flex flex-col gap-2"
                            data-id="17638710-66ba-5ca4-8831-cac043a41629"
                        >
                            <h3
                                className="font-semibold uppercase text-xs leading-4 tracking-wider"
                                style={{ color: "oklch(0.705 0.015 286.067)" }}
                                data-id="431aff60-540f-549f-bbc0-04cdee28e39e"
                            >
                                Historial de Interacciones
                            </h3>
                            <div
                                className="flex flex-col gap-1"
                                data-id="c5f35ee2-e228-5543-889a-7c125ea4fcdd"
                            >
                                <div
                                    className="flex gap-4"
                                    data-id="b5dcc26a-50c6-537d-ab1c-b0fbc90341e2"
                                >
                                    <div
                                        className="flex flex-col items-center"
                                        data-id="55410115-5cf6-57dd-89f2-0a186cd1a7d9"
                                    >
                                        <div
                                            className="rounded-full w-2.5 h-2.5"
                                            style={{ backgroundColor: "oklch(0.795 0.184 86.047)" }}
                                            data-id="96c4d2ae-97bf-5cdd-8597-7a85ece826a0"
                                        />
                                        <div
                                            className="flex-1 w-0.5"
                                            style={{ backgroundColor: "oklch(1 0 0 / 10%)" }}
                                            data-id="bbaa4ca9-136d-5a5f-a6aa-de4d321e69ea"
                                        />
                                    </div>
                                    <div
                                        className="pb-4 flex-1"
                                        data-id="5ddc3e9e-c80c-5beb-bdc4-f2bf015004a5"
                                    >
                                        <div
                                            className="flex mb-1 items-center gap-2"
                                            data-id="1525e767-909a-5f1c-aa2f-8ea478a5a583"
                                        >
                                            <span
                                                className="font-semibold text-neutral-50 text-xs leading-4"
                                                data-id="b18b0305-b125-508d-8730-4394d9b24695"
                                            >
                                                Hoy, 10:30 AM
                                            </span>
                                            <span
                                                className="rounded-full text-xs leading-4 flex px-2 py-0.5 items-center gap-1"
                                                style={{
                                                    backgroundColor: "oklch(0.274 0.006 286.033)",
                                                    color: "oklch(0.696 0.17 162.48)",
                                                }}
                                                data-id="27b0bab5-a4ac-5227-84b8-7ec437613f36"
                                            >
                                                <Phone
                                                    className="size-3"
                                                    data-id="3ee0e855-3081-5b49-94b5-941c3bd75ee3"
                                                />
                                                Llamada
                                            </span>
                                        </div>
                                        <p
                                            className="leading-relaxed text-xs leading-4"
                                            style={{ color: "oklch(0.705 0.015 286.067)" }}
                                            data-id="b8aa42c1-59e8-546d-a94e-6bd80ffb1eb1"
                                        >
                                            Cliente muy interesado en el BMW M3 2023. Solicitó prueba
                                            de manejo para el sábado. Mencionó que tiene enganche del
                                            30%.
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="flex gap-4"
                                    data-id="8b9e70b2-d398-5472-81ac-4deff94a4388"
                                >
                                    <div
                                        className="flex flex-col items-center"
                                        data-id="f34dc10b-c134-5dd7-8ea8-4204737e316e"
                                    >
                                        <div
                                            className="rounded-full w-2.5 h-2.5"
                                            style={{
                                                backgroundColor: "oklch(0.274 0.006 286.033)",
                                                border: "1.5px solid oklch(0.705 0.015 286.067)",
                                            }}
                                            data-id="888a1381-0a6d-5201-896e-f1740793804b"
                                        />
                                        <div
                                            className="flex-1 w-0.5"
                                            style={{ backgroundColor: "oklch(1 0 0 / 10%)" }}
                                            data-id="b447700c-5832-55d8-a6ab-4e83028fc3dd"
                                        />
                                    </div>
                                    <div
                                        className="pb-4 flex-1"
                                        data-id="98a8a350-1c89-5f5c-8e8a-c3cd38873559"
                                    >
                                        <div
                                            className="flex mb-1 items-center gap-2"
                                            data-id="919ff3dd-1b79-51c2-bb6c-90770c0c3004"
                                        >
                                            <span
                                                className="font-semibold text-xs leading-4"
                                                style={{ color: "oklch(0.705 0.015 286.067)" }}
                                                data-id="68f95f97-aa25-5104-9c16-86831eeaf4e2"
                                            >
                                                12 Jun, 3:15 PM
                                            </span>
                                            <span
                                                className="rounded-full text-xs leading-4 flex px-2 py-0.5 items-center gap-1"
                                                style={{
                                                    backgroundColor: "oklch(0.274 0.006 286.033)",
                                                    color: "oklch(0.696 0.17 162.48)",
                                                }}
                                                data-id="8c29fa67-a909-593a-8c8e-bccb846e56dc"
                                            >
                                                <MessageCircle
                                                    className="size-3"
                                                    data-id="05bf1575-91cf-5e97-bc97-3ef919f0220c"
                                                />
                                                WhatsApp
                                            </span>
                                        </div>
                                        <p
                                            className="text-xs leading-4"
                                            style={{
                                                color: "oklch(0.705 0.015 286.067)",
                                                opacity: 0.6,
                                            }}
                                            data-id="d7d92403-93ad-5eef-b2df-22fd33b70f01"
                                        >
                                            Se envió catálogo de vehículos disponibles...
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="flex gap-4"
                                    data-id="e45167b5-9599-54ef-bb39-2d6d2b099876"
                                >
                                    <div
                                        className="flex flex-col items-center"
                                        data-id="eb631d4b-70f4-56ea-8765-57b6396fa0e5"
                                    >
                                        <div
                                            className="rounded-full w-2.5 h-2.5"
                                            style={{
                                                backgroundColor: "oklch(0.274 0.006 286.033)",
                                                border: "1.5px solid oklch(0.705 0.015 286.067)",
                                            }}
                                            data-id="280e3f53-615f-5aa2-a947-e7af4e3b03e7"
                                        />
                                    </div>
                                    <div
                                        className="pb-2 flex-1"
                                        data-id="f0c51a57-f8c4-574b-8623-e2c381ecf657"
                                    >
                                        <div
                                            className="flex mb-1 items-center gap-2"
                                            data-id="714732f9-c274-55d7-b96b-efd7547ea5e7"
                                        >
                                            <span
                                                className="font-semibold text-xs leading-4"
                                                style={{ color: "oklch(0.705 0.015 286.067)" }}
                                                data-id="1afa15c9-c4d3-595b-bb08-9389f98093ba"
                                            >
                                                10 Jun, 11:00 AM
                                            </span>
                                            <span
                                                className="rounded-full text-xs leading-4 flex px-2 py-0.5 items-center gap-1"
                                                style={{
                                                    backgroundColor: "oklch(0.274 0.006 286.033)",
                                                    color: "oklch(0.696 0.17 162.48)",
                                                }}
                                                data-id="9e044297-db38-52a7-aadc-7d3fe9b8b3ce"
                                            >
                                                <MapPin
                                                    className="size-3"
                                                    data-id="344ac54a-139e-5baf-9ba1-f33653c61436"
                                                />
                                                Visita
                                            </span>
                                        </div>
                                        <p
                                            className="text-xs leading-4"
                                            style={{
                                                color: "oklch(0.705 0.015 286.067)",
                                                opacity: 0.6,
                                            }}
                                            data-id="5fca1ff7-5b7f-5939-9579-bf6154507ad6"
                                        >
                                            Primera visita al lote, revisó 3 vehículos...
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="font-semibold text-xs leading-4"
                                style={{ color: "oklch(0.795 0.184 86.047)" }}
                                data-id="019274d2-49a0-5918-8150-8437879fda3b"
                            >
                                Ver historial completo
                                <ChevronRight
                                    className="size-3 inline"
                                    data-id="aa57c1bb-ed3f-5440-ba03-274b58a18fda"
                                />
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        position: "fixed",
                        bottom: 80,
                        left: 0,
                        right: 0,
                        maxWidth: 375,
                        margin: "0 auto",
                        padding: "0 24px",
                        zIndex: 10,
                    }}
                    data-id="a5b51625-4bc8-54f7-bf00-a0d6da24009d"
                >
                    <button
                        className="font-bold rounded-xl text-base leading-6 flex py-4 justify-center items-center gap-2 w-full"
                        style={{
                            backgroundColor: "oklch(0.795 0.184 86.047)",
                            color: "oklch(0.141 0.005 285.823)",
                        }}
                        data-id="ef845ca1-9716-5b18-ab87-1fcda21d00de"
                    >
                        <FileText
                            className="size-5"
                            data-id="ce3a7f82-94d2-5591-af5b-83ddda621cde"
                        />
                        Generar Apartado
                    </button>
                </div>
                <div
                    style={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        maxWidth: 375,
                        margin: "0 auto",
                        backgroundColor: "oklch(0.21 0.006 285.885)",
                        borderTop: "1px solid oklch(1 0 0 / 10%)",
                        zIndex: 20,
                    }}
                    data-id="2b74ce03-fdb7-54b0-9617-fcdd35c87507"
                >
                    <div
                        className="flex pt-2 pb-6 flex-row justify-around items-center"
                        data-id="b4465a5e-1f5c-5610-bf76-c83a7dc6435a"
                    >
                        <div
                            className="flex px-2 py-1 flex-col items-center gap-1"
                            data-id="2cd1c535-11ea-536e-81f8-488cba9d6d5e"
                        >
                            <Home
                                className="size-5"
                                style={{ color: "oklch(0.705 0.015 286.067)" }}
                                data-id="1ef11287-40e1-570b-accc-6e568e127cfc"
                            />
                            <span
                                className="text-xs leading-4"
                                style={{ color: "oklch(0.705 0.015 286.067)" }}
                                data-id="181b2d22-dd5f-5d4b-9876-66016da0de7d"
                            >
                                Inicio
                            </span>
                        </div>
                        <div
                            className="flex px-2 py-1 flex-col items-center gap-1"
                            data-id="1f65ff94-5bbd-548f-ab0e-e86be9dbba5a"
                        >
                            <ClipboardList
                                className="size-5"
                                style={{ color: "oklch(0.705 0.015 286.067)" }}
                                data-id="ef10cbde-41a9-5b95-aece-ad6f46fb58f3"
                            />
                            <span
                                className="text-xs leading-4"
                                style={{ color: "oklch(0.705 0.015 286.067)" }}
                                data-id="7baed15d-9448-5ec1-b2e1-1bcb6b6f30c4"
                            >
                                Avalúos
                            </span>
                        </div>
                        <div
                            className="rounded-xl flex px-3 py-1 flex-col items-center gap-1"
                            style={{ backgroundColor: "oklch(0.795 0.184 86.047)" }}
                            data-id="9af6407b-cb81-5d56-9c4c-c782133d02f6"
                        >
                            <Users
                                className="size-5"
                                style={{ color: "oklch(0.141 0.005 285.823)" }}
                                data-id="cc20c631-a755-597c-a023-dd02e6d1e97a"
                            />
                            <span
                                className="font-semibold text-xs leading-4"
                                style={{ color: "oklch(0.141 0.005 285.823)" }}
                                data-id="90f91c02-a1fd-519e-a61c-803e69e73c76"
                            >
                                Clientes
                            </span>
                        </div>
                        <div
                            className="flex px-2 py-1 flex-col items-center gap-1"
                            data-id="36293715-0a5a-5e53-91f7-855531e700a8"
                        >
                            <HandCoins
                                className="size-5"
                                style={{ color: "oklch(0.705 0.015 286.067)" }}
                                data-id="e0c9431f-ab1d-53eb-9fba-3b5fcdb927b7"
                            />
                            <span
                                className="text-xs leading-4"
                                style={{ color: "oklch(0.705 0.015 286.067)" }}
                                data-id="d0fcfd53-76e3-5627-8345-08574d341de4"
                            >
                                Apartados
                            </span>
                        </div>
                        <div
                            className="flex px-2 py-1 flex-col items-center gap-1"
                            data-id="ed92d61f-5371-5645-b862-6b53a20273d5"
                        >
                            <Car
                                className="size-5"
                                style={{ color: "oklch(0.705 0.015 286.067)" }}
                                data-id="c0050a91-806c-55a8-a657-d7ac06ce53a4"
                            />
                            <span
                                className="text-xs leading-4"
                                style={{ color: "oklch(0.705 0.015 286.067)" }}
                                data-id="171c3f1a-626a-5367-bec9-86086421fd78"
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
