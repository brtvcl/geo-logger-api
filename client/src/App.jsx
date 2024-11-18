import { useState } from "react";
import Button from "./components/Button";
import Map from "./components/Map";
import MenuButton from "./components/MenuButton";
import RequestView from "./components/RequestView";
import ResponseView from "./components/ResponseView";
import useGlobalState from "./hooks/useGlobalState";
import Areas from "./components/Areas";

function App() {
  const [areas, setAreas] = useGlobalState("areas", []);
  const [responses, setResponses] = useGlobalState("responses", []);
  const [selected, setSelected] = useState("areas");
  return (
    <>
      <div className="flex">
        <div className="flex-[0.4]">
          <RequestView>
            <MenuButton
              selected={selected}
              onSelect={setSelected}
              options={[
                {
                  title: "Areas",
                  value: "areas",
                },
                {
                  title: "Logs",
                  value: "users",
                },
              ]}
            />
            <div className="p-4 flex-1">
              {selected === "areas" && <Areas />}
            </div>
          </RequestView>
          <ResponseView />
        </div>
        <div className="flex-[0.6]">
          <Map areas={[{ lat: 41, lon: 29 }]} />
        </div>
      </div>
    </>
  );
}

export default App;
