import React, { useEffect, useState } from "react";
import { getDefaultParams, simulate } from "./api";
import Controls from "./components/Controls";
import ChartPanel from "./components/ChartPanel";
import Inventory3D from "./components/Inventory3D";
import "./App.css"; // (or style.css) for your modern styles

export default function App() {
  const [params, setParams] = useState(null);
  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDefaultParams().then((def) => setParams(def));
  }, []);

  function handleSimulate() {
    setLoading(true);
    setSimResult(null);
    simulate(params).then((res) => {
      setSimResult(res);
      setLoading(false);
    });
  }

  // Helper for displaying basic stats
  function summaryStats(inventoryHistory) {
    // inventoryHistory: [echelon][product][days]
    if (!inventoryHistory) return [];
    let stats = [];
    for (let e = 0; e < inventoryHistory.length; e++) {
      for (let p = 0; p < inventoryHistory[e].length; p++) {
        const arr = inventoryHistory[e][p];
        stats.push({
          echelon: simResult.echelons[e].name,
          product: simResult.products[p].name,
          min: Math.min(...arr),
          max: Math.max(...arr),
          avg: (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1),
        });
      }
    }
    return stats;
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2em", background: "#f4f7fb", minHeight: "100vh" }}>
      <h2 style={{ color: "#2d3a4a" }}>System Dynamics Supply Chain Simulator</h2>
      <p style={{ maxWidth: 700 }}>
        This interactive tool lets you experiment with <b>multiple products</b> and a <b>three-stage supply chain</b> (Retailer, Wholesaler, Manufacturer).
        Adjust policies and instantly compare supply chain outcomes <span role="img" aria-label="chart">📈</span>.
      </p>
      {params && (
        <Controls params={params} setParams={setParams} onSimulate={handleSimulate} />
      )}
      {loading && <div style={{ fontWeight: "bold", color: "#246", marginTop: 30 }}>Simulating...</div>}

      {simResult && simResult.resultA && simResult.resultA.inventoryHistory && (
        <>
          <div style={{ margin: "2em 0 1em 0", padding: "1em", background: "#fff", borderRadius: 12, boxShadow: "0 2px 6px #eee" }}>
            <h3>Summary (Inventory Ranges):</h3>
            <table style={{ borderCollapse: "collapse", minWidth: 400 }}>
              <thead>
                <tr style={{ background: "#f2f6fa" }}>
                  <th style={{ padding: 6, border: "1px solid #dde" }}>Echelon</th>
                  <th style={{ padding: 6, border: "1px solid #dde" }}>Product</th>
                  <th style={{ padding: 6, border: "1px solid #dde" }}>Min</th>
                  <th style={{ padding: 6, border: "1px solid #dde" }}>Max</th>
                  <th style={{ padding: 6, border: "1px solid #dde" }}>Avg</th>
                </tr>
              </thead>
              <tbody>
                {summaryStats(simResult.resultA.inventoryHistory).map((stat, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: 6, border: "1px solid #dde" }}>{stat.echelon}</td>
                    <td style={{ padding: 6, border: "1px solid #dde" }}>{stat.product}</td>
                    <td style={{ padding: 6, border: "1px solid #dde" }}>{stat.min}</td>
                    <td style={{ padding: 6, border: "1px solid #dde" }}>{stat.max}</td>
                    <td style={{ padding: 6, border: "1px solid #dde" }}>{stat.avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            <div style={{ flex: "2 1 600px" }}>
              <ChartPanel
                products={simResult.products}
                echelons={simResult.echelons}
                simDays={simResult.simDays}
                resultA={simResult.resultA}
                resultB={simResult.resultB}
              />
            </div>
            <div style={{ flex: "1 1 340px", minWidth: 340 }}>
              <h4 style={{ textAlign: "center" }}>3D Inventory</h4>
              <Inventory3D
                products={simResult.products}
                echelons={simResult.echelons}
                simDays={simResult.simDays}
                inventoryHistory={simResult.resultA.inventoryHistory}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
