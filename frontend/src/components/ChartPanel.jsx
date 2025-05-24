import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

export default function ChartPanel({ products, echelons, simDays, resultA, resultB }) {
    const chartRef = useRef();
    const chartInstanceRef = useRef(null);
    const [productIdx, setProductIdx] = useState(0);
    const [echelonIdx, setEchelonIdx] = useState(0);

    useEffect(() => {
        if (!resultA || !chartRef.current) return;

        const labels = Array.from({ length: simDays }, (_, i) => `Day ${i + 1}`);

        // Main simulation data
        const invA = resultA.inventoryHistory[echelonIdx][productIdx];
        const backlogA = resultA.backlogHistory[echelonIdx][productIdx];
        const ordersA = resultA.ordersHistory[echelonIdx][productIdx];
        const demandA = resultA.demandHistory[productIdx];

        // If in comparison mode, show resultB overlays
        const invB = resultB?.inventoryHistory[echelonIdx][productIdx];
        const backlogB = resultB?.backlogHistory[echelonIdx][productIdx];

        // Destroy previous chart
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        // Compose datasets
        let datasets = [
            {
                label: "Inventory (with feedback)",
                data: invA,
                borderWidth: 2,
                tension: 0.2,
            },
            {
                label: "Backlog (with feedback)",
                data: backlogA,
                borderWidth: 2,
                borderDash: [5, 4],
                tension: 0.2,
            },
            {
                label: "Orders placed",
                data: ordersA,
                borderWidth: 1,
                borderDash: [2, 3],
                tension: 0.2,
            },
            {
                label: "Demand",
                data: demandA,
                borderWidth: 1,
                borderDash: [2, 3],
                tension: 0.2,
            }
        ];

        if (invB && backlogB) {
            datasets = [
                ...datasets,
                {
                    label: "Inventory (NO feedback)",
                    data: invB,
                    borderWidth: 2,
                    borderColor: "#c44",
                    borderDash: [1, 2],
                    tension: 0.2,
                },
                {
                    label: "Backlog (NO feedback)",
                    data: backlogB,
                    borderWidth: 2,
                    borderColor: "#d7b",
                    borderDash: [5, 4],
                    tension: 0.2,
                }
            ];
        }

        // Chart.js instance
        const ctx = chartRef.current.getContext('2d');
        chartInstanceRef.current = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: {
                        display: true,
                        text: `${products[productIdx].name} @ ${echelons[echelonIdx].name}`,
                        font: { size: 17 }
                    }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        // Cleanup
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [resultA, resultB, productIdx, echelonIdx, products, echelons, simDays]);

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 10, gap: 16 }}>
                <label>
                    Product:{" "}
                    <select value={productIdx} onChange={e => setProductIdx(Number(e.target.value))}>
                        {products.map((p, idx) => (
                            <option value={idx} key={idx}>{p.name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Echelon:{" "}
                    <select value={echelonIdx} onChange={e => setEchelonIdx(Number(e.target.value))}>
                        {echelons.map((e, idx) => (
                            <option value={idx} key={idx}>{e.name}</option>
                        ))}
                    </select>
                </label>
            </div>
            <canvas ref={chartRef} width={720} height={370} />
        </div>
    );
}
