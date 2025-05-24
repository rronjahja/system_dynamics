import React from "react";

export default function Controls({ params, setParams, onSimulate }) {
    function handleChange(e) {
        const { name, value } = e.target;
        setParams((p) => ({ ...p, [name]: Number(value) }));
    }
    return (
        <div style={{ margin: "1em 0" }}>
            <label style={{ marginRight: 10 }}>Lead Time:
                <input name="leadTime" type="number" value={params.leadTime} onChange={handleChange} />
            </label>
            <label style={{ marginRight: 10 }}>Reorder Point:
                <input name="reorderPoint" type="number" value={params.reorderPoint} onChange={handleChange} />
            </label>
            <label style={{ marginRight: 10 }}>Order Qty:
                <input name="orderQty" type="number" value={params.orderQty} onChange={handleChange} />
            </label>
            <label style={{ marginRight: 10 }}>Demand Mean:
                <input name="demandMean" type="number" value={params.demandMean} onChange={handleChange} />
            </label>
            <label style={{ marginRight: 10 }}>Delay:
                <input name="delay" type="number" value={params.delay} onChange={handleChange} />
            </label>
            <label style={{ marginRight: 10 }}>Smoothing:
                <input name="smoothing" type="number" step="0.01" value={params.smoothing} onChange={handleChange} />
            </label>
            <label style={{ marginRight: 10 }}>Sim Days:
                <input name="simDays" type="number" value={params.simDays} onChange={handleChange} />
            </label>
            <button style={{ marginLeft: 15 }} onClick={onSimulate}>Run Simulation</button>
        </div>
    );
}
