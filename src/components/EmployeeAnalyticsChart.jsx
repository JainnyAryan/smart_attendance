import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const EmployeeAnalyticsChart = ({ data, type = "bar" }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
            type,
            data: {
                labels: data.labels,
                datasets: data.datasets.map((dataset) => ({
                    label: dataset.label,
                    data: dataset.data,
                    backgroundColor: dataset.backgroundColor,
                    borderColor: dataset.borderColor || "rgba(0, 0, 0, 1)",
                    borderWidth: dataset.borderWidth || 1,
                    fill: dataset.fill || false,
                    tension: dataset.tension || 0.4,
                })),
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, type]);

    return <canvas ref={chartRef} />;
};

export default EmployeeAnalyticsChart;