import React from "react";

export default function Controls({ params, setParams, onSimulate }) {
    function handleChange(e) {
        const { name, value, type, checked, dataset } = e.target;
        if (name === "numProducts" || name === "simDays" || name === "demandMean") {
            setParams((p) => ({ ...p, [name]: Number(value) }));
        } else if (name === "comparison") {
            setParams((p) => ({ ...p, comparison: checked }));
        } else if (dataset.echelon !== undefined) {
            const echelonIdx = Number(dataset.echelon);
            setParams((p) => {
                const echelons = p.echelons.map((ech, idx) =>
                    idx === echelonIdx
                        ? { ...ech, [name]: type === "checkbox" ? checked : (name === "name" ? value : Number(value)) }
                        : ech
                );
                return { ...p, echelons };
            });
        }
    }

    return (
        <div style={{ margin: "1.2em 0" }}>
            <div style={{ marginBottom: 20, display: "flex", gap: 30, alignItems: "center" }}>
                <label>
                    Number of Products:&nbsp;
                    <select name="numProducts" value={params.numProducts} onChange={handleChange}>
                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </label>
                <label>
                    Simulation Days:&nbsp;
                    <input name="simDays" type="number" value={params.simDays} min={5} max={180} onChange={handleChange} style={{ width: 60 }} />
                </label>
                <label>
                    Demand Mean:&nbsp;
                    <input name="demandMean" type="number" value={params.demandMean} min={1} max={500} onChange={handleChange} style={{ width: 60 }} />
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input
                        name="comparison"
                        type="checkbox"
                        checked={params.comparison || false}
                        onChange={handleChange}
                    />
                    Compare with/without feedback & smoothing
                </label>
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "2em",
                    background: "#fafbfc",
                    padding: "1.4em",
                    borderRadius: "12px",
                    boxShadow: "0 2px 6px #e3e3e3",
                    justifyContent: "center"
                }}
            >
                {Array.isArray(params.echelons) &&
                    params.echelons.map((echelon, idx) => (
                        <div
                            key={idx}
                            style={{
                                minWidth: 240,
                                background: "#fff",
                                borderRadius: "10px",
                                boxShadow: "0 2px 6px #ececec",
                                padding: "1.1em 1em",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.85em",
                                alignItems: "stretch"
                            }}
                        >
                            <strong style={{ fontSize: "1.13em", marginBottom: "0.7em", letterSpacing: 0.2 }}>{echelon.name}</strong>
                            <label style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                Name:
                                <input
                                    name="name"
                                    value={echelon.name}
                                    data-echelon={idx}
                                    onChange={handleChange}
                                    style={{ flex: 1, marginLeft: 4 }}
                                />
                            </label>
                            <label style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                Lead Time:
                                <input
                                    name="leadTime"
                                    type="number"
                                    min={1}
                                    max={14}
                                    value={echelon.leadTime}
                                    data-echelon={idx}
                                    onChange={handleChange}
                                    style={{ flex: 1, marginLeft: 4 }}
                                />
                            </label>
                            <label style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                Reorder Point:
                                <input
                                    name="reorderPoint"
                                    type="number"
                                    min={0}
                                    max={1000}
                                    value={echelon.reorderPoint}
                                    data-echelon={idx}
                                    onChange={handleChange}
                                    style={{ flex: 1, marginLeft: 4 }}
                                />
                            </label>
                            <label style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                Order Qty:
                                <input
                                    name="orderQty"
                                    type="number"
                                    min={1}
                                    max={2000}
                                    value={echelon.orderQty}
                                    data-echelon={idx}
                                    onChange={handleChange}
                                    style={{ flex: 1, marginLeft: 4 }}
                                />
                            </label>
                            <label style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                Smoothing:
                                <input
                                    name="smoothing"
                                    type="number"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={echelon.smoothing}
                                    data-echelon={idx}
                                    onChange={handleChange}
                                    style={{ flex: 1, marginLeft: 4 }}
                                />
                            </label>
                            <label style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 3 }}>
                                <input
                                    name="enableSmoothing"
                                    type="checkbox"
                                    checked={echelon.enableSmoothing}
                                    data-echelon={idx}
                                    onChange={handleChange}
                                    style={{ marginRight: 6 }}
                                />
                                Enable Smoothing
                            </label>
                            <label style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                <input
                                    name="enableFeedback"
                                    type="checkbox"
                                    checked={echelon.enableFeedback}
                                    data-echelon={idx}
                                    onChange={handleChange}
                                    style={{ marginRight: 6 }}
                                />
                                Enable Feedback
                            </label>
                        </div>
                    ))}
            </div>
            <button style={{ marginTop: 28, fontWeight: "bold", fontSize: 18, padding: "0.58em 1.7em" }} onClick={onSimulate}>
                Run Simulation
            </button>
        </div>
    );
}
