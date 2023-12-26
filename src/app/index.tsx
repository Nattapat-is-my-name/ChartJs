"use client";
import React, { useEffect, useRef } from "react";

import "chartjs-plugin-annotation";
import Chart from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

// Chart.register(annotationPlugin as any);
const DATA_COUNT = 8;
const MIN = 10;
const MAX = 100;

const labels = [];
for (let i = 0; i < DATA_COUNT; ++i) {
  labels.push("" + i);
}

const numberCfg = { count: DATA_COUNT, min: MIN, max: MAX };

const data = {
  labels: labels,
  datasets: [
    {
      data: [20, 10, 30, 40, 50, 60, 70, 80, 90, 100],
    },
    {
      data: [20, 10, 30, 40, 50, 60, 70, 80, 90, 100],
    },
    {
      data: [20, 10, 30, 40, 50, 60, 70, 80, 90, 100],
    },
  ],
};
function minValue(ctx: any) {
  const dataset = ctx.chart.data.datasets[0];
  const min = dataset.data.reduce(
    (max: number, point: number) => Math.min(point, max),
    Infinity
  );
  return isFinite(min) ? min : 0;
}

function maxValue(ctx: any) {
  const datasets = ctx.chart.data.datasets;
  const count = datasets[0].data.length;
  let max = 0;
  for (let i = 0; i < count; i++) {
    let sum = 0;
    for (const dataset of datasets) {
      sum += dataset.data[i];
    }
    max = Math.max(max, sum);
  }
  return max;
}
const annotation1 = {
  type: "line",
  drawTime: "afterDraw",
  mode: "horizontal",
  borderColor: "red",
  id: "id-0",
  borderWidth: 3,
  label: {
    display: true,
    backgroundColor: "red",
    borderColor: "red",
    borderRadius: 10,
    borderWidth: 2,
    content: (ctx: any) => "Lower bound: " + minValue(ctx).toFixed(3),
    rotation: "auto",
  },
  scaleID: "y-a-1",
  value: minValue,
};

const annotation2 = {
  type: "line",
  borderWidth: 3,
  id: "id-1",
  borderColor: "pink",
  label: {
    display: true,
    backgroundColor: "pink",
    borderColor: "pink",
    borderRadius: 10,
    borderWidth: 2,
    content: (ctx: any) => "Upper bound: " + maxValue(ctx).toFixed(3),
    rotation: "auto",
  },
  scaleID: "y-a-2",
  value: maxValue,
};

const config = {
  type: "line",
  data: data,
  options: {
    scales: {
      y: {
        stacked: true,
        color: "white",
      },
    },
    annotation: {
      annotations: [annotation1, annotation2],
    },
  },
};

const LineGraph: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  let myChart: Chart | null = null;

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (ctx) {
        // Chart.register(annotationPlugin as any);
        Chart.pluginService.register(annotationPlugin);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        myChart = new Chart(ctx, {
          ...(config as any),
        });
      }
    }

    return () => {
      // Cleanup - destroy chart on unmount to prevent memory leaks
      if (myChart) {
        myChart.destroy();
        myChart = null;
      }
    };
  }, []);

  return (
    <div className="w-auto bg-white">
      <canvas id="myChart" ref={(ref) => (chartRef.current = ref)}></canvas>
    </div>
  );
};

export default LineGraph;
