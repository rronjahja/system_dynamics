import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function ChartPanel({ data }) {
    const chartRef = useRef();
    const chartInstanceRef = useRef(null);

    useEffect(() => {
        if (!data || !chartRef.current) return;

        // Cleanup previous instance
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        chartInstanceRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.inventory.map((_, i) => `Day ${i + 1}`),
                datasets: [
                    { label: "Inventory", data: data.inventory, borderWidth: 2 },
                    { label: "Backlog", data: data.backlog, borderWidth: 2 },
                    { label: "Demand", data: data.demand, borderWidth: 2 },
                    { label: "Orders", data: data.orders, borderWidth: 2 }
                ]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'top' } }
            }
        });

        // Cleanup on unmount or update
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [data]);

    return (
        <div>
            <canvas ref={chartRef} width={800} height={350} />
        </div>
    );
}
