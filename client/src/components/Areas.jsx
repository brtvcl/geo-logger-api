import React, { useState } from "react";
import Button from "./Button";
import useGlobalState from "../hooks/useGlobalState";
import Radio from "./Radio";

function Areas() {
  const [areas, setAreas] = useGlobalState("areas", []);
  const [responses, setResponses] = useGlobalState("responses", []);
  const [form, setForm] = useState("getAreas");

  function apply() {
    if (form == "getAreas") {
      // Get Areas
      const startTime = Date.now();
      let endTime;
      fetch("http://localhost:3000/areas")
        .then((res) => {
          endTime = Date.now();
          return res.json();
        })
        .then((data) => {
          responses.push({
            duration: endTime - startTime,
            data,
          });
          setAreas(data.areas);
        });
    }
  }
  return (
    <div className="flex-1">
      <div className="flex flex-1 w-full">
        <Button className="ml-auto">Apply</Button>
      </div>
      <div className="flex">
        <div className="flex-1">
          <Radio label="Get Areas" name="form" id="getAreas" value="getAreas" />
        </div>
      </div>
    </div>
  );
}

export default Areas;
