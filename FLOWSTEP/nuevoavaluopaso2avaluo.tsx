import { useEffect } from "react";
import {
  ArrowLeft,
  Camera,
  Car,
  ClipboardList,
  HandCoins,
  Home,
  Info,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <div>
      <div
        className="bg-zinc-950 text-neutral-50 w-full h-fit h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible"
        style={{ fontFamily: "sans-serif", minHeight: 812, maxWidth: 375 }}
        data-id="ef15420f-a805-59c9-ab3e-bc8308b86200"
      >
        <div
          className="min-h-[812px] flex flex-col"
          data-id="11783cf9-feb1-5008-8cf8-c47635df97c9"
        >
          <div
            className="overflow-y-auto pb-20 flex-1"
            data-id="7a357349-cd7b-586a-9dae-c79f6f03ae43"
          >
            <div
              className="flex p-6 flex-col gap-6"
              data-id="56c8b74a-d556-598f-be89-96acfbb62e03"
            >
              <div
                className="flex justify-between items-center"
                data-id="de4bcb4f-1070-5c77-811e-a820df2df331"
              >
                <div
                  className="flex items-center gap-4"
                  data-id="7419c629-21c8-547b-81c9-92a513347a66"
                >
                  <ArrowLeft
                    className="size-5 text-neutral-50"
                    data-id="cbdac602-5994-5906-b1de-20873f3b9287"
                  />
                  <span
                    className="font-semibold text-neutral-50 text-lg leading-7"
                    data-id="4a1d456d-0828-5f41-a6c0-3cc77d22fccc"
                  >
                    Nuevo Avalúo
                  </span>
                </div>
                <div
                  className="flex items-center gap-2"
                  data-id="2c81fe92-7d0f-5b0b-abca-331b042d3e6f"
                >
                  <span
                    className="text-[#9f9fa9] text-xs leading-4"
                    data-id="e70e3593-ab2b-50b1-b148-04c2dd782942"
                  >
                    Paso 2 de 2
                  </span>
                  <div
                    className="flex ml-2 items-center gap-1.5"
                    data-id="3a55946a-3421-5911-8851-faec45a34568"
                  >
                    <div
                      className="rounded-full bg-[#9f9fa9]/40 w-2 h-2"
                      data-id="2a4a4721-8738-5100-9395-c23d261702d3"
                    />
                    <div
                      className="rounded-full bg-[#f0b100] w-2 h-2"
                      data-id="df0f87d1-6c66-5fb0-8eb5-6073cb5d1ef3"
                    />
                  </div>
                </div>
              </div>
              <div
                className="flex flex-col gap-4"
                data-id="ef865033-dc08-5ee8-9a1b-f706e4f00cab"
              >
                <div
                  className="flex flex-col gap-2"
                  data-id="1cd8c1b9-96c8-5603-b5b3-a1ed8dd4f627"
                >
                  <label
                    className="font-medium uppercase text-[#9f9fa9] text-xs leading-4 tracking-wide"
                    data-id="36ae5575-0320-5d6c-814a-c917df6597a4"
                  >
                    Oferta de Compra
                  </label>
                  <div
                    className="rounded-xl bg-zinc-800 flex px-4 py-3.5 items-center"
                    data-id="0384b729-d2ff-57fd-8ea9-50d7f2a066c7"
                  >
                    <span
                      className="text-[#9f9fa9] text-base leading-6 mr-2"
                      data-id="75a4b670-d6c0-576a-b17e-7e3a509b4ba8"
                    >
                      $
                    </span>
                    <span
                      className="text-neutral-50 text-base leading-6"
                      data-id="58749916-1e6e-58e3-b0e4-9a23187fe981"
                    >
                      185,000
                    </span>
                  </div>
                </div>
                <div
                  className="flex flex-col gap-2"
                  data-id="b937bcfe-8c44-54ad-a537-426295dd6201"
                >
                  <label
                    className="font-medium uppercase text-[#9f9fa9] text-xs leading-4 tracking-wide"
                    data-id="d1fb9da1-9ed8-5bf0-8fd0-5d15e5a67596"
                  >
                    Precio de Venta Estimado
                  </label>
                  <div
                    className="rounded-xl bg-zinc-800 flex px-4 py-3.5 items-center"
                    data-id="95a83741-f991-5b9d-bd8a-f2594c434cfc"
                  >
                    <span
                      className="text-[#9f9fa9] text-base leading-6 mr-2"
                      data-id="23b84437-5bcd-5d19-bfbd-04d04b72da0f"
                    >
                      $
                    </span>
                    <span
                      className="text-neutral-50 text-base leading-6"
                      data-id="d9921423-05c9-5108-90a2-ffe66f35ee65"
                    >
                      220,000
                    </span>
                  </div>
                </div>
                <div
                  className="flex flex-col gap-2"
                  data-id="addf8a5e-6a3e-5464-9089-4e44e8f2d968"
                >
                  <label
                    className="font-medium uppercase text-[#9f9fa9] text-xs leading-4 tracking-wide"
                    data-id="9388532b-1db3-51a7-9e6b-49d32f0981bb"
                  >
                    Sub-Estado del Avalúo
                  </label>
                  <div
                    className="flex items-center gap-2"
                    data-id="7b58bb11-fdea-5f8e-9f91-ff2fed69012e"
                  >
                    <div
                      className="border-[oklch(0.6_0.15_250)] text-[oklch(0.7_0.15_250)] font-medium rounded-full text-sm leading-5 border-black/1 border-1 border-solid flex py-2.5 justify-center items-center flex-1"
                      data-id="aa538ad4-7e85-5bee-b3ca-c1f7541267a8"
                    >
                      Frío
                    </div>
                    <div
                      className="border-[oklch(0.7_0.15_55)] text-[oklch(0.75_0.15_55)] font-medium rounded-full text-sm leading-5 border-black/1 border-1 border-solid flex py-2.5 justify-center items-center flex-1"
                      data-id="a2058132-b28b-5bb6-9195-d8b4b1d5dfaa"
                    >
                      Medio
                    </div>
                    <div
                      className="border-[oklch(0.65_0.2_25)] text-[oklch(0.7_0.2_25)] font-medium rounded-full text-sm leading-5 border-black/1 border-1 border-solid flex py-2.5 justify-center items-center flex-1"
                      data-id="8fc3a7f7-c760-5e47-a1d8-54841dea577b"
                    >
                      Alto
                    </div>
                    <div
                      className="font-bold rounded-full bg-[#f0b100] text-[#733e0a] text-sm leading-5 flex py-2.5 justify-center items-center flex-1"
                      data-id="55dafacf-2aa8-5b3a-aa9d-7800887d0863"
                    >
                      Toma
                    </div>
                  </div>
                </div>
                <div
                  className="rounded-xl bg-[#f0b100]/10 border-[#f0b100]/30 border-1 border-solid flex px-4 py-2.5 items-center gap-2"
                  data-id="07b2955b-a538-589e-a243-ead98a36f879"
                >
                  <Info
                    className="size-4 flex-shrink-0 text-[#f0b100]"
                    data-id="08aeacae-44af-58a9-af77-c257e79f7f25"
                  />
                  <span
                    className="font-medium text-[#f0b100] text-xs leading-4"
                    data-id="3f030123-5144-5d1f-b5b7-7f03413d18cd"
                  >
                    El auto pasará automáticamente a Inventario/Lote
                  </span>
                </div>
                <div
                  className="flex flex-col gap-2"
                  data-id="f25a8f18-097e-51d4-84a6-d58654acad7f"
                >
                  <label
                    className="font-medium uppercase text-[#9f9fa9] text-xs leading-4 tracking-wide"
                    data-id="87979f72-4497-5763-8e13-f2cc0bc20383"
                  >
                    Comentarios
                  </label>
                  <div
                    className="min-h-[90px] rounded-xl bg-zinc-800 px-4 py-3.5"
                    data-id="6d48e0b8-28a1-59fe-85ca-d2e2fd024028"
                  >
                    <span
                      className="text-[#9f9fa9]/60 text-sm leading-5"
                      data-id="ba4a0d0e-94cb-59e7-9521-2f8197ae83f2"
                    >
                      Notas de la negociación...
                    </span>
                  </div>
                </div>
                <div
                  className="flex flex-col gap-2"
                  data-id="c230400b-461a-59fe-a464-a896f57b0c2d"
                >
                  <label
                    className="font-medium uppercase text-[#9f9fa9] text-xs leading-4 tracking-wide"
                    data-id="8d3722f2-7f56-5514-8788-402f2064d9fe"
                  >
                    Hoja de Avalúo
                  </label>
                  <div
                    className="rounded-xl border-[#9f9fa9]/30 border-2 border-dashed flex px-4 py-8 flex-col justify-center items-center gap-2"
                    data-id="63fb35cf-80d3-5316-84a5-f8c8c69c420d"
                  >
                    <Camera
                      className="size-8 text-[#9f9fa9]/50"
                      data-id="9b870483-a1d6-5ae4-8bc1-3969d1b85ab0"
                    />
                    <span
                      className="text-center text-[#9f9fa9]/60 text-sm leading-5"
                      data-id="4dfbbac2-2f19-5780-bbdc-a86558569c6a"
                    >
                      Tomar foto o adjuntar documento
                    </span>
                  </div>
                </div>
                <p
                  className="leading-relaxed text-center text-[#9f9fa9]/60 text-xs leading-4"
                  data-id="5a5ef05b-d8f6-54a4-8a85-dcf4cbc7a393"
                >
                  Al guardar, se registrará el auto y el avalúo simultáneamente.
                </p>
                <Button
                  className="font-bold rounded-xl bg-[#f0b100] text-[#733e0a] text-base leading-6 py-6 w-full"
                  data-id="88027d6e-6f66-5055-b2ca-6f913dcff1be"
                >
                  Guardar Avalúo ✓
                </Button>
              </div>
            </div>
          </div>
          <div
            className="fixed max-w-[375px] bg-zinc-800 border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid inset-x-0 bottom-0 mx-auto"
            data-id="b20db2fd-b54b-5b1f-93e1-0aebf83e1be3"
          >
            <div
              className="flex px-1 py-2 flex-row justify-around items-center"
              data-id="a2a81860-07c6-52c9-a690-f20d4f762b94"
            >
              <div
                className="flex px-2 py-1 flex-col items-center gap-1"
                data-id="a726efec-71aa-5095-982b-b51d37db52e7"
              >
                <Home
                  className="size-5 text-[#9f9fa9]"
                  data-id="6ac3caae-47e2-5416-9aae-f6b589d1df6e"
                />
                <span
                  className="text-[#9f9fa9] text-[10px]"
                  data-id="6da8a0f3-2f0c-5016-84b0-fe71adb01547"
                >
                  Inicio
                </span>
              </div>
              <div
                className="rounded-xl bg-[#f0b100] flex px-3 py-1 flex-col items-center gap-1"
                data-id="d3b219c2-e9fa-54a3-b79e-a974b8b28b3f"
              >
                <ClipboardList
                  className="size-5 text-[#733e0a]"
                  data-id="5f580dad-bb79-5ad4-beba-5c9f1a3f82b1"
                />
                <span
                  className="font-semibold text-[#733e0a] text-[10px]"
                  data-id="4088691c-9245-5a72-b1da-254225b31dd7"
                >
                  Avalúos
                </span>
              </div>
              <div
                className="flex px-2 py-1 flex-col items-center gap-1"
                data-id="5c613723-1724-5c2e-982a-701457daeb3f"
              >
                <Users
                  className="size-5 text-[#9f9fa9]"
                  data-id="4f3e4d65-a108-5955-8ddc-e3ca06e2f652"
                />
                <span
                  className="text-[#9f9fa9] text-[10px]"
                  data-id="2cd57736-e8ca-5f2e-a9fe-0b9d3a1da398"
                >
                  Clientes
                </span>
              </div>
              <div
                className="flex px-2 py-1 flex-col items-center gap-1"
                data-id="0e453542-f644-560c-86be-ac5aef2492d2"
              >
                <HandCoins
                  className="size-5 text-[#9f9fa9]"
                  data-id="48915a0f-449f-5850-9f7d-aeeff655e136"
                />
                <span
                  className="text-[#9f9fa9] text-[10px]"
                  data-id="32abedf8-916b-54ab-9381-542a8ca910f7"
                >
                  Apartados
                </span>
              </div>
              <div
                className="flex px-2 py-1 flex-col items-center gap-1"
                data-id="3793b569-5c0f-56f8-b6a5-70ef41017965"
              >
                <Car
                  className="size-5 text-[#9f9fa9]"
                  data-id="b82d55e7-6fc2-5673-9d5d-00c8a8768455"
                />
                <span
                  className="text-[#9f9fa9] text-[10px]"
                  data-id="197f7af3-1e60-56e6-87c0-e52c740f7746"
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
