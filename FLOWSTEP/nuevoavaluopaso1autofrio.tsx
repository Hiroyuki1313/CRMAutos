import { useEffect } from "react";
import {
    ArrowLeft,
    Camera,
    Car,
    ChevronDown,
    ClipboardList,
    HandCoins,
    Home,
    Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function App() {
    return (
        <div>
            <div
                className="bg-zinc-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible"
                style={{
                    fontFamily: "sans-serif",
                    width: 375,
                    minHeight: 812,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                }}
                data-id="5f7f4ae9-8c8d-5734-a974-bbf95d94e0a3"
            >
                <div
                    className="flex p-4 justify-between items-center"
                    style={{ paddingTop: 48 }}
                    data-id="1554f77f-c44e-5e8e-ba1b-794b44ea7030"
                >
                    <div
                        className="flex items-center gap-4"
                        data-id="bae0a2ba-eafd-5e44-a222-7711a80053af"
                    >
                        <ArrowLeft
                            className="size-6 text-neutral-50"
                            data-id="0159541b-72fe-52e0-8e42-e02887c539ab"
                        />
                        <span
                            className="font-bold text-neutral-50 text-lg leading-7"
                            data-id="64c0927d-1a92-5615-a49b-58b7766e7b7e"
                        >
                            Nuevo Avalúo
                        </span>
                    </div>
                    <div
                        className="flex items-center gap-2"
                        data-id="232f160c-8e4f-5e08-9630-a07c7ae4a409"
                    >
                        <span
                            className="text-sm leading-5"
                            style={{ color: "oklch(0.705 0.015 286.067)" }}
                            data-id="ba387593-c56c-52ee-87fa-427880ae47fe"
                        >
                            Paso 1 de 2
                        </span>
                        <div
                            className="flex ml-2 items-center gap-1"
                            data-id="2b85781b-cee8-57f4-a211-bce7655b68dd"
                        >
                            <div
                                className="rounded-full"
                                style={{
                                    width: 8,
                                    height: 8,
                                    backgroundColor: "oklch(0.795 0.184 86.047)",
                                }}
                                data-id="6433d1c5-8a7f-5232-ab6b-b26fcdfac5d0"
                            />
                            <div
                                className="rounded-full"
                                style={{
                                    width: 8,
                                    height: 8,
                                    backgroundColor: "oklch(0.274 0.006 286.033)",
                                }}
                                data-id="8162814d-3e34-5b90-a55c-304b26961de1"
                            />
                        </div>
                    </div>
                </div>
                <div
                    className="overflow-y-auto flex-1"
                    style={{ paddingBottom: 160 }}
                    data-id="28e673d9-0465-519f-b16a-5a7f0bb5dbca"
                >
                    <div
                        className="rounded-t-3xl flex p-6 flex-col gap-6"
                        style={{ backgroundColor: "oklch(0.21 0.006 285.885)" }}
                        data-id="77d01c1a-b523-5ebb-a38c-ae719ddbc659"
                    >
                        <div
                            className="flex flex-col gap-2"
                            data-id="2140eece-923b-5ae5-a00b-748d88ee0fe8"
                        >
                            <label
                                className="font-medium text-neutral-50 text-sm leading-5"
                                data-id="5eefd8f2-be88-5300-9190-68814da60d9f"
                            >
                                Marca
                            </label>
                            <div
                                className="rounded-xl flex p-4 justify-between items-center"
                                style={{ backgroundColor: "oklch(0.274 0.006 286.033)" }}
                                data-id="7bbc1e2e-a486-5d7a-af09-2ba96cbe31d4"
                            >
                                <span
                                    style={{ color: "oklch(0.705 0.015 286.067)", fontSize: 15 }}
                                    data-id="2795d33d-3e99-5297-85d2-2d18ee013785"
                                >
                                    Seleccionar marca
                                </span>
                                <ChevronDown
                                    className="size-5"
                                    style={{ color: "oklch(0.705 0.015 286.067)" }}
                                    data-id="d5e3e827-b71e-5c58-b84a-ebf73369a5e1"
                                />
                            </div>
                        </div>
                        <div
                            className="flex flex-col gap-2"
                            data-id="16c46a22-f8a4-57fc-aae7-c1e42781966d"
                        >
                            <label
                                className="font-medium text-neutral-50 text-sm leading-5"
                                data-id="ce35e7a1-4094-5d99-9903-2aefa27edd23"
                            >
                                Modelo
                            </label>
                            <div
                                className="rounded-xl p-4"
                                style={{ backgroundColor: "oklch(0.274 0.006 286.033)" }}
                                data-id="261b0766-eb12-542d-b1b3-4e590613a079"
                            >
                                <span
                                    style={{ color: "oklch(0.705 0.015 286.067)", fontSize: 15 }}
                                    data-id="b7e11c24-61fa-5569-9483-53bd822d54a9"
                                >
                                    Ej. Corolla, Civic, Sentra...
                                </span>
                            </div>
                        </div>
                        <div
                            className="flex gap-4"
                            data-id="c99d6710-a934-5de0-8aa3-d35222efc71d"
                        >
                            <div
                                className="flex flex-col flex-1 gap-2"
                                data-id="d8d7359c-7586-5739-bf26-0f3d3bb018ac"
                            >
                                <label
                                    className="font-medium text-neutral-50 text-sm leading-5"
                                    data-id="7e7b30ef-ec93-55a0-8858-64798e64780d"
                                >
                                    Año
                                </label>
                                <div
                                    className="rounded-xl p-4"
                                    style={{ backgroundColor: "oklch(0.274 0.006 286.033)" }}
                                    data-id="dda8f43a-e9ed-57c0-bd61-cdf930684cd6"
                                >
                                    <span
                                        style={{
                                            color: "oklch(0.705 0.015 286.067)",
                                            fontSize: 15,
                                        }}
                                        data-id="ddaf5655-7c32-50c0-9115-f27324459abf"
                                    >
                                        2024
                                    </span>
                                </div>
                            </div>
                            <div
                                className="flex flex-col flex-1 gap-2"
                                data-id="3ce942c4-0722-5192-a3a2-9dc3702c1bca"
                            >
                                <label
                                    className="font-medium text-neutral-50 text-sm leading-5"
                                    data-id="48cfd6d6-27d6-5817-9fca-41816f7969cf"
                                >
                                    Tipo
                                </label>
                                <div
                                    className="rounded-xl flex p-4 justify-between items-center"
                                    style={{ backgroundColor: "oklch(0.274 0.006 286.033)" }}
                                    data-id="4b65fdb7-52c1-541b-b251-72f461000ccc"
                                >
                                    <span
                                        style={{
                                            color: "oklch(0.705 0.015 286.067)",
                                            fontSize: 15,
                                        }}
                                        data-id="47ed24c5-2117-5ad8-87dd-d94f891e1b1a"
                                    >
                                        Sedán
                                    </span>
                                    <ChevronDown
                                        className="size-5"
                                        style={{ color: "oklch(0.705 0.015 286.067)" }}
                                        data-id="036edb8f-863e-5c1e-922f-cd620687a02c"
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className="flex gap-4"
                            data-id="b84d6ee1-a787-53ad-bb7b-fc3b8974ceec"
                        >
                            <div
                                className="flex flex-col flex-1 gap-2"
                                data-id="b440807f-d776-558e-90fb-5255057eeb58"
                            >
                                <label
                                    className="font-medium text-neutral-50 text-sm leading-5"
                                    data-id="fc579088-a6fb-5ce9-ba8a-e4da3c590058"
                                >
                                    Kilometraje
                                </label>
                                <div
                                    className="rounded-xl p-4"
                                    style={{ backgroundColor: "oklch(0.274 0.006 286.033)" }}
                                    data-id="6d4e6edf-0bc0-5cd0-b7c5-f750f0297e23"
                                >
                                    <span
                                        style={{
                                            color: "oklch(0.705 0.015 286.067)",
                                            fontSize: 15,
                                        }}
                                        data-id="66c2120c-4646-5b99-a936-9ebb28a9e3ae"
                                    >
                                        0 km
                                    </span>
                                </div>
                            </div>
                            <div
                                className="flex flex-col flex-1 gap-2"
                                data-id="1f6440ba-ffa1-520f-90ea-ebd34dc17bd2"
                            >
                                <label
                                    className="font-medium text-neutral-50 text-sm leading-5"
                                    data-id="5eb275e3-e4a4-573a-b227-449c42ea4e93"
                                >
                                    Color
                                </label>
                                <div
                                    className="rounded-xl p-4"
                                    style={{ backgroundColor: "oklch(0.274 0.006 286.033)" }}
                                    data-id="863bb47d-8f56-55e6-8336-963e65ce6317"
                                >
                                    <span
                                        style={{
                                            color: "oklch(0.705 0.015 286.067)",
                                            fontSize: 15,
                                        }}
                                        data-id="ff5e5e9d-afe3-58ab-9324-ffd8c7413c2b"
                                    >
                                        Ej. Blanco
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div
                            className="flex flex-col gap-2"
                            data-id="5b157615-463f-572e-b4a5-c252bf2f81aa"
                        >
                            <label
                                className="font-medium text-neutral-50 text-sm leading-5"
                                data-id="d0fce4b5-5f1e-5d95-868d-0943ecff6c3b"
                            >
                                Ubicación / Sucursal
                            </label>
                            <div
                                className="rounded-xl flex p-4 justify-between items-center"
                                style={{ backgroundColor: "oklch(0.274 0.006 286.033)" }}
                                data-id="173ae427-ee49-5509-9075-90bc3269eea6"
                            >
                                <span
                                    style={{ color: "oklch(0.705 0.015 286.067)", fontSize: 15 }}
                                    data-id="7b5755ad-fdbe-5fda-b50c-4eeb624504a7"
                                >
                                    Seleccionar sucursal
                                </span>
                                <ChevronDown
                                    className="size-5"
                                    style={{ color: "oklch(0.705 0.015 286.067)" }}
                                    data-id="98587522-db4d-500c-97cb-f352fee57da3"
                                />
                            </div>
                        </div>
                        <div
                            className="flex flex-col gap-4"
                            data-id="31def7cc-c829-5b36-a517-04edb39fcc41"
                        >
                            <label
                                className="font-medium text-neutral-50 text-sm leading-5"
                                data-id="cff591e0-542e-5c6e-8235-56e730309459"
                            >
                                Fotos de la Unidad
                            </label>
                            <div
                                className="overflow-x-auto flex gap-4"
                                style={{ paddingBottom: 4 }}
                                data-id="e4125de2-5719-5124-998f-9dbf8bf69ad3"
                            >
                                <div
                                    className="flex-shrink-0 rounded-xl overflow-hidden"
                                    style={{ width: 88, height: 88, position: "relative" }}
                                    data-id="8ab78d2e-402a-50c8-b02c-b05c3e0e3f49"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1685783681351-7a8a6ff07e69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxjYXIlMjBpbnRlcmlvciUyMGRhc2hib2FyZCUyMGRhcmt8ZW58MXwyfHx8MTc3NTc0OTg1N3ww&ixlib=rb-4.1.0&q=80&w=400"
                                        alt="Mercedes Benz EQ Back Passenger View"
                                        className="object-cover w-full h-full"
                                        data-photoid="XOfF8WR11Xo"
                                        data-authorname="Divaris Shirichena"
                                        data-authorurl="https://unsplash.com/@divaris"
                                        data-blurhash="LLEyMf%M9FD%_NM{MyM{x[kCV]M{"
                                        data-id="790fdbe9-1b81-56d9-929e-7a065a2d2db6"
                                    />
                                </div>
                                <div
                                    className="flex-shrink-0 rounded-xl flex justify-center items-center"
                                    style={{
                                        width: 88,
                                        height: 88,
                                        border: "2px dashed oklch(0.705 0.015 286.067)",
                                        backgroundColor: "transparent",
                                    }}
                                    data-id="40e94bd5-0f4e-5ae7-8e5e-bf230a1ea8ff"
                                >
                                    <Camera
                                        className="size-6"
                                        style={{ color: "oklch(0.705 0.015 286.067)" }}
                                        data-id="5314ba81-8266-5049-9628-d74df5e0413c"
                                    />
                                </div>
                                <div
                                    className="flex-shrink-0 rounded-xl flex justify-center items-center"
                                    style={{
                                        width: 88,
                                        height: 88,
                                        border: "2px dashed oklch(0.705 0.015 286.067)",
                                        backgroundColor: "transparent",
                                    }}
                                    data-id="f14b460b-7109-59d9-b9a4-c4f6b07e0ac2"
                                >
                                    <Camera
                                        className="size-6"
                                        style={{ color: "oklch(0.705 0.015 286.067)" }}
                                        data-id="e80e61d6-b1e6-5366-8077-b56ba10eb2e5"
                                    />
                                </div>
                                <div
                                    className="flex-shrink-0 rounded-xl flex justify-center items-center"
                                    style={{
                                        width: 88,
                                        height: 88,
                                        border: "2px dashed oklch(0.705 0.015 286.067)",
                                        backgroundColor: "transparent",
                                    }}
                                    data-id="333031f1-d70a-52f3-aacd-53cd4b161bde"
                                >
                                    <Camera
                                        className="size-6"
                                        style={{ color: "oklch(0.705 0.015 286.067)" }}
                                        data-id="94385b79-dd72-5af7-98d0-79e02eaa2e6b"
                                    />
                                </div>
                                <div
                                    className="flex-shrink-0 rounded-xl flex justify-center items-center"
                                    style={{
                                        width: 88,
                                        height: 88,
                                        border: "2px dashed oklch(0.705 0.015 286.067)",
                                        backgroundColor: "transparent",
                                    }}
                                    data-id="0a66290b-b8ec-50d5-b2d7-974d8feaf752"
                                >
                                    <Camera
                                        className="size-6"
                                        style={{ color: "oklch(0.705 0.015 286.067)" }}
                                        data-id="5d93e090-ba5f-5110-b7be-38d34f2852ce"
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className="pt-2"
                            data-id="b1210016-be0b-5b10-9b28-79f290de9406"
                        >
                            <Button
                                className="font-bold rounded-xl text-base leading-6 p-4 w-full"
                                style={{
                                    backgroundColor: "oklch(0.795 0.184 86.047)",
                                    color: "oklch(0.141 0.005 285.823)",
                                    height: 52,
                                }}
                                data-id="58bff9a6-1449-5311-943e-d298641021cf"
                            >
                                Siguiente →
                            </Button>
                        </div>
                    </div>
                </div>
                <div
                    className="flex p-2 justify-around items-center"
                    style={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        width: 375,
                        backgroundColor: "oklch(0.21 0.006 285.885)",
                        borderTop: "1px solid oklch(1 0 0 / 10%)",
                        paddingBottom: 20,
                        paddingTop: 8,
                    }}
                    data-id="f1fb21b9-6269-5da2-a138-fd5cee96c1f1"
                >
                    <div
                        className="flex flex-col items-center gap-1"
                        data-id="542e08b1-0cbe-59b8-a3b9-eaedacb00552"
                    >
                        <Home
                            className="size-5"
                            style={{ color: "oklch(0.705 0.015 286.067)" }}
                            data-id="0c4a935b-4d59-54c9-96e2-06c021c46e99"
                        />
                        <span
                            className="text-xs leading-4"
                            style={{ color: "oklch(0.705 0.015 286.067)" }}
                            data-id="3db01de5-6552-519a-8dbc-0c8cbd00539f"
                        >
                            Inicio
                        </span>
                    </div>
                    <div
                        className="rounded-xl flex px-4 py-1 flex-col items-center gap-1"
                        style={{ backgroundColor: "oklch(0.795 0.184 86.047)" }}
                        data-id="9e0d98fa-2648-5b05-8bfb-54e74eaa929d"
                    >
                        <ClipboardList
                            className="size-5"
                            style={{ color: "oklch(0.141 0.005 285.823)" }}
                            data-id="d1ba1dfe-dbca-5fc7-a1fb-4b4aed13aad9"
                        />
                        <span
                            className="font-semibold text-xs leading-4"
                            style={{ color: "oklch(0.141 0.005 285.823)" }}
                            data-id="77aff52b-56e9-5738-90b4-23964f1639aa"
                        >
                            Avalúos
                        </span>
                    </div>
                    <div
                        className="flex flex-col items-center gap-1"
                        data-id="ea4c17dc-bd56-5c94-a15a-ef40e29fefe0"
                    >
                        <Users
                            className="size-5"
                            style={{ color: "oklch(0.705 0.015 286.067)" }}
                            data-id="7d24c7a6-1984-5d96-bd2c-147a79a3d043"
                        />
                        <span
                            className="text-xs leading-4"
                            style={{ color: "oklch(0.705 0.015 286.067)" }}
                            data-id="a56b60b0-890f-5540-aba6-1cb6c44b05a1"
                        >
                            Clientes
                        </span>
                    </div>
                    <div
                        className="flex flex-col items-center gap-1"
                        data-id="1039b7ed-cdfc-5542-a82c-775bc63e1506"
                    >
                        <HandCoins
                            className="size-5"
                            style={{ color: "oklch(0.705 0.015 286.067)" }}
                            data-id="ce36f7fb-2588-5c87-b2c7-7add34660df1"
                        />
                        <span
                            className="text-xs leading-4"
                            style={{ color: "oklch(0.705 0.015 286.067)" }}
                            data-id="03f31651-beec-570f-8f70-9c328cb691c6"
                        >
                            Apartados
                        </span>
                    </div>
                    <div
                        className="flex flex-col items-center gap-1"
                        data-id="1a117db2-3ce6-5c11-a3be-27305b7059dd"
                    >
                        <Car
                            className="size-5"
                            style={{ color: "oklch(0.705 0.015 286.067)" }}
                            data-id="8c0ded5f-2c58-5153-b661-3dcfebce4720"
                        />
                        <span
                            className="text-xs leading-4"
                            style={{ color: "oklch(0.705 0.015 286.067)" }}
                            data-id="3a3c6690-2ea9-5b5e-adb0-3b4b0dc9cadd"
                        >
                            Inventario
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
