import React, { useEffect, useState } from "react";
import { getDefaultParams, simulate } from "./api";
import Controls from "./components/Controls";
import ChartPanel from "./components/ChartPanel";
import Inventory3D from "./components/Inventory3D";

export default function App() {
  const [params, setParams] = useState(null);
  const [simResult, setSimResult] = useState(null);

  useEffect(() => {
    getDefaultParams().then(setParams);
  }, []);

  function handleSimulate() {
    simulate(params).then(setSimResult);
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2em" }}>
      <h2>System Dynamics Supply Chain Simulator (VISE+SD)</h2>
      {params &&
        <Controls params={params} setParams={setParams} onSimulate={handleSimulate} />
      }
      {simResult &&
        <>
          <ChartPanel data={simResult} />
          <h3>Inventory in 3D</h3>
          <Inventory3D inventory={simResult.inventory} />
        </>
      }
    </div>
  );
}
