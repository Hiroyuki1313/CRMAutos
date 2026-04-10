import { useEffect } from "react";
import {
    AlertCircle,
    ArrowLeft,
    Building2,
    Car,
    ClipboardList,
    HandCoins,
    Home,
    Megaphone,
    Phone,
    Share2,
    User,
    Users,
} from "lucide-react";

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
                data-id="51767b94-b22e-561b-ad1c-95fc536c7088"
            >
                <div
                    className="flex flex-col"
                    style={{ flex: 1 }}
                    data-id="9f73348b-6346-59b0-8960-00b61eb1526a"
                >
                    <div
                        className="flex px-6 pt-12 pb-6 items-center gap-4"
                        data-id="1688054c-f0d7-56d2-a24e-fc4998fe62c2"
                    >
                        <div
                            className="flex justify-center items-center"
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 12,
                                backgroundColor: "oklch(0.274 0.006 286.033)",
                            }}
                            data-id="ecc8c011-f23c-5bd9-8092-e67e3b72139e"
                        >
                            <ArrowLeft
                                className="size-5"
                                style={{ color: "oklch(0.985 0 0)" }}
                                data-id="b9b89f25-5617-54e1-98d1-83d583efe8d1"
                            />
                        </div>
                        <span
                            style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: "oklch(0.985 0 0)",
                            }}
                            data-id="122d3655-9007-5fc3-9e6b-3415c92d72af"
                        >
                            Nuevo Cliente
                        </span>
                    </div>
                    <div
                        className="flex px-6 pt-2 pb-6 flex-col gap-6"
                        style={{ flex: 1 }}
                        data-id="be62e6a4-2779-5475-8ccd-b3ef20616ca9"
                    >
                        <div
                            className="flex flex-col gap-2"
                            data-id="a2d3fb06-b592-524d-b2c5-995ff48318d3"
                        >
                            <label
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "oklch(0.705 0.015 286.067)",
                                    letterSpacing: 0.5,
                                }}
                                data-id="fa9706bd-9ab8-54c2-ad47-76c30df799ab"
                            >
                                Nombre Completo
                            </label>
                            <div
                                className="flex items-center gap-4"
                                style={{
                                    backgroundColor: "#1E1E1E",
                                    borderRadius: 14,
                                    padding: "14px 16px",
                                    border: "1.5px solid oklch(1 0 0 / 10%)",
                                }}
                                data-id="1c9bcef9-a2aa-53b5-b2d5-105b3fc1e2f8"
                            >
                                <User
                                    className="size-5"
                                    style={{ color: "oklch(0.705 0.015 286.067)", flexShrink: 0 }}
                                    data-id="8c79cd21-a964-5e0d-bf50-f541e9de63b3"
                                />
                                <span
                                    style={{ fontSize: 16, color: "oklch(0.705 0.015 286.067)" }}
                                    data-id="0c002cb0-d5c3-50d6-8af6-e688549475a0"
                                >
                                    Ingresa el nombre completo
                                </span>
                            </div>
                        </div>
                        <div
                            className="flex flex-col gap-2"
                            data-id="9e2a1dc9-1424-5f95-9dad-493ab36ccf0d"
                        >
                            <label
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "oklch(0.705 0.015 286.067)",
                                    letterSpacing: 0.5,
                                }}
                                data-id="0b202481-b2bd-5010-ad8a-78d2c7a43a77"
                            >
                                Teléfono
                            </label>
                            <div
                                className="flex items-center gap-4"
                                style={{
                                    backgroundColor: "#1E1E1E",
                                    borderRadius: 14,
                                    padding: "14px 16px",
                                    border: "1.5px solid oklch(0.704 0.191 22.216)",
                                }}
                                data-id="5d0116bf-e47d-59b2-b2b7-d004a9625e71"
                            >
                                <Phone
                                    className="size-5"
                                    style={{ color: "oklch(0.704 0.191 22.216)", flexShrink: 0 }}
                                    data-id="8ce4c58f-b2e9-5108-a7e3-b59d078f394e"
                                />
                                <span
                                    style={{ fontSize: 16, color: "oklch(0.985 0 0)" }}
                                    data-id="de9ab1f1-7968-5175-9140-64f5afb392b5"
                                >
                                    55 1234 5678
                                </span>
                            </div>
                            <div
                                className="flex items-center gap-1"
                                style={{ paddingLeft: 4, paddingTop: 2 }}
                                data-id="e740a839-5f89-52fb-97f3-e7e77f29ee40"
                            >
                                <AlertCircle
                                    className="size-3"
                                    style={{ color: "oklch(0.704 0.191 22.216)" }}
                                    data-id="94ba791b-7555-5823-a214-3239cbe1fbbb"
                                />
                                <span
                                    style={{
                                        fontSize: 12,
                                        color: "oklch(0.704 0.191 22.216)",
                                        fontWeight: 500,
                                    }}
                                    data-id="8ad6f766-9574-56ea-a198-acc109dd2f85"
                                >
                                    Este teléfono ya está registrado en el sistema
                                </span>
                            </div>
                            <span
                                style={{
                                    fontSize: 11,
                                    color: "oklch(0.705 0.015 286.067)",
                                    paddingLeft: 4,
                                    paddingTop: 2,
                                }}
                                data-id="4628a79d-524a-5ccf-a768-b451606f2637"
                            >
                                El teléfono debe ser único en el sistema
                            </span>
                        </div>
                        <div
                            className="flex flex-col gap-4"
                            data-id="7b506c1d-80db-513b-acc4-80eeae51831f"
                        >
                            <label
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "oklch(0.705 0.015 286.067)",
                                    letterSpacing: 0.5,
                                }}
                                data-id="54d74995-c09c-5371-9ef7-a80ac739371d"
                            >
                                Origen
                            </label>
                            <div
                                className="flex gap-4"
                                data-id="05fe029c-4162-5441-a8a9-1775b60508c5"
                            >
                                <div
                                    className="flex flex-col justify-center items-center gap-2"
                                    style={{
                                        flex: 1,
                                        backgroundColor: "oklch(0.795 0.184 86.047 / 0.15)",
                                        borderRadius: 16,
                                        padding: "18px 8px",
                                        border: "2px solid oklch(0.795 0.184 86.047)",
                                        cursor: "pointer",
                                    }}
                                    data-id="16c514f6-ea84-5db3-aea9-682e9bd08b81"
                                >
                                    <div
                                        className="flex justify-center items-center"
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 12,
                                            backgroundColor: "oklch(0.795 0.184 86.047)",
                                        }}
                                        data-id="64431477-45e5-504d-b3bc-ce2e778179c1"
                                    >
                                        <Megaphone
                                            className="size-5"
                                            style={{ color: "oklch(0.141 0.005 285.823)" }}
                                            data-id="0fd29c91-a0df-5bc8-a8cf-702ed93ffca4"
                                        />
                                    </div>
                                    <span
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: "oklch(0.795 0.184 86.047)",
                                        }}
                                        data-id="8f92f735-06e9-53bc-ba5d-dc4933937f7e"
                                    >
                                        Ads
                                    </span>
                                </div>
                                <div
                                    className="flex flex-col justify-center items-center gap-2"
                                    style={{
                                        flex: 1,
                                        backgroundColor: "#1E1E1E",
                                        borderRadius: 16,
                                        padding: "18px 8px",
                                        border: "2px solid oklch(1 0 0 / 10%)",
                                        cursor: "pointer",
                                    }}
                                    data-id="d5cb40eb-1657-58ae-a523-5298a78cced0"
                                >
                                    <div
                                        className="flex justify-center items-center"
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 12,
                                            backgroundColor: "oklch(0.274 0.006 286.033)",
                                        }}
                                        data-id="30ff1abf-ff15-53dc-aa67-248232fadae5"
                                    >
                                        <Building2
                                            className="size-5"
                                            style={{ color: "oklch(0.705 0.015 286.067)" }}
                                            data-id="c1afcf77-cffd-5d11-a5f8-62e5fa3b462c"
                                        />
                                    </div>
                                    <span
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: "oklch(0.705 0.015 286.067)",
                                        }}
                                        data-id="4df8c6c5-bdd7-5341-b1a5-a5207c37b2ea"
                                    >
                                        Piso
                                    </span>
                                </div>
                                <div
                                    className="flex flex-col justify-center items-center gap-2"
                                    style={{
                                        flex: 1,
                                        backgroundColor: "#1E1E1E",
                                        borderRadius: 16,
                                        padding: "18px 8px",
                                        border: "2px solid oklch(1 0 0 / 10%)",
                                        cursor: "pointer",
                                    }}
                                    data-id="42676a84-434d-55bb-bad0-4d0501fbc7ce"
                                >
                                    <div
                                        className="flex justify-center items-center"
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 12,
                                            backgroundColor: "oklch(0.274 0.006 286.033)",
                                        }}
                                        data-id="a33b8d87-df9c-5734-9e4e-35005c1aa826"
                                    >
                                        <Share2
                                            className="size-5"
                                            style={{ color: "oklch(0.705 0.015 286.067)" }}
                                            data-id="79284ef5-407f-5118-bf44-20a7a986ff1c"
                                        />
                                    </div>
                                    <span
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: "oklch(0.705 0.015 286.067)",
                                        }}
                                        data-id="8433a6e5-2f07-5c88-a278-aa1d846d1336"
                                    >
                                        Redes
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div
                            style={{ flex: 1, minHeight: 24 }}
                            data-id="2ea16741-1bd8-5241-b579-f138fb1acb2c"
                        />
                        <button
                            className="flex justify-center items-center"
                            style={{
                                width: "100%",
                                padding: "18px 0",
                                borderRadius: 16,
                                backgroundColor: "oklch(0.795 0.184 86.047)",
                                border: "none",
                                cursor: "pointer",
                            }}
                            data-id="cd5fe445-9638-54c3-882f-1b0dc67eef24"
                        >
                            <span
                                style={{
                                    fontSize: 17,
                                    fontWeight: 800,
                                    color: "oklch(0.141 0.005 285.823)",
                                    letterSpacing: 0.3,
                                }}
                                data-id="a668294a-1b68-5dd7-a37e-fbfbd886ca88"
                            >
                                Registrar Cliente
                            </span>
                        </button>
                        <div
                            style={{ height: 8 }}
                            data-id="50c89037-9e43-5d9e-83ed-46a621373e14"
                        />
                    </div>
                </div>
                <div
                    className="flex justify-around items-center"
                    style={{
                        backgroundColor: "#1E1E1E",
                        paddingTop: 10,
                        paddingBottom: 28,
                        borderTop: "1px solid oklch(1 0 0 / 10%)",
                    }}
                    data-id="cc67c8e2-c52d-5d6f-a605-19ea88c7e191"
                >
                    <div
                        className="flex flex-col items-center gap-1"
                        style={{ padding: "6px 12px", cursor: "pointer" }}
                        data-id="aef6b8fb-9865-513e-b9ec-d8378108dd19"
                    >
                        <Home
                            className="size-5"
                            style={{ color: "oklch(0.705 0.015 286.067)" }}
                            data-id="8dc7b78f-d896-5752-88f4-97a775dcf05c"
                        />
                        <span
                            style={{
                                fontSize: 10,
                                fontWeight: 500,
                                color: "oklch(0.705 0.015 286.067)",
                            }}
                            data-id="8bdec0c6-84c9-557a-8cb1-8f174f181d68"
                        >
                            Inicio
                        </span>
                    </div>
                    <div
                        className="flex flex-col items-center gap-1"
                        style={{ padding: "6px 12px", cursor: "pointer" }}
                        data-id="0a9ec2c8-d249-51e2-9180-d7bf3793e3d1"
                    >
                        <ClipboardList
                            className="size-5"
                            style={{ color: "oklch(0.705 0.015 286.067)" }}
                            data-id="f2152d31-d624-5425-983d-d0ea99fe1a8d"
                        />
                        <span
                            style={{
                                fontSize: 10,
                                fontWeight: 500,
                                color: "oklch(0.705 0.015 286.067)",
                            }}
                            data-id="c93024ee-bc7c-5834-9ace-be96784757dd"
                        >
                            Avalúos
                        </span>
                    </div>
                    <div
                        className="flex flex-col items-center gap-1"
                        style={{
                            padding: "6px 12px",
                            borderRadius: 14,
                            backgroundColor: "oklch(0.795 0.184 86.047)",
                            cursor: "pointer",
                        }}
                        data-id="c20bf83b-b294-5a92-8657-e2556bcf76c3"
                    >
                        <Users
                            className="size-5"
                            style={{ color: "oklch(0.141 0.005 285.823)" }}
                            data-id="98251e48-1b81-5d8e-8826-bc1432a2a9be"
                        />
                        <span
                            style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: "oklch(0.141 0.005 285.823)",
                            }}
                            data-id="a8b7e7fc-43e9-52be-8ca0-f70d5b408478"
                        >
                            Clientes
                        </span>
                    </div>
                    <div
                        className="flex flex-col items-center gap-1"
                        style={{ padding: "6px 12px", cursor: "pointer" }}
                        data-id="09e9eb7b-8906-5adf-92f1-76fb9446493a"
                    >
                        <HandCoins
                            className="size-5"
                            style={{ color: "oklch(0.705 0.015 286.067)" }}
                            data-id="067c6afe-5c00-5c40-b9c8-ac5645701a43"
                        />
                        <span
                            style={{
                                fontSize: 10,
                                fontWeight: 500,
                                color: "oklch(0.705 0.015 286.067)",
                            }}
                            data-id="e4ef0980-8a20-5871-a4b8-cd0edaf20db0"
                        >
                            Apartados
                        </span>
                    </div>
                    <div
                        className="flex flex-col items-center gap-1"
                        style={{ padding: "6px 12px", cursor: "pointer" }}
                        data-id="53340c79-fcdc-5555-bf5a-c3d5365361c3"
                    >
                        <Car
                            className="size-5"
                            style={{ color: "oklch(0.705 0.015 286.067)" }}
                            data-id="1902f553-f026-57dd-897f-66ea6abae92d"
                        />
                        <span
                            style={{
                                fontSize: 10,
                                fontWeight: 500,
                                color: "oklch(0.705 0.015 286.067)",
                            }}
                            data-id="f042ee32-2935-5e84-bfa1-ee66db0d4882"
                        >
                            Inventario
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
