import React from "react";
import useGlobalState from "../hooks/useGlobalState";

function ResponseView() {
  const [responses, setResponses] = useGlobalState("responses", []);
  const lastResponse = responses[responses.length - 1];

  console.log((lastResponse?.duration / 1000).toFixed(2));
  const duration =
    lastResponse?.duration < 1000
      ? `${lastResponse?.duration}ms`
      : `${(lastResponse?.duration / 1000).toFixed(2)}s`;

  return (
    <div className="max-h-[50vh] overflow-scroll ">
      {lastResponse && (
        <div>
          <div className="flex p-2">
            <h1>Response</h1>
            <p className="ms-auto">
              Duration:
              <span className="font-bold text-green-500 bg-green-200 p-2 ml-4 rounded-lg">
                {duration}
              </span>
            </p>
          </div>
          <pre className="bg-slate-700 text-white font-mono mt-4">
            {JSON.stringify(lastResponse.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ResponseView;
