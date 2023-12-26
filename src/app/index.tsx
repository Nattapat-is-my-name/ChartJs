// @ts-nocheck
"use client";

import React, { useEffect, useRef } from "react";
import * as Utils from "./utils";

import "chartjs-plugin-annotation";
import {Chart as ChartConfig} from "chart.js";
import Chart from "chart.js/auto";
import annotationPlugin from "chartjs-plugin-annotation";

const DATA_COUNT = 8;
const MIN = 10;
const MAX = 100;

Utils.srand(8);

const labels = [];
for (let i = 0; i < DATA_COUNT; ++i) {
  labels.push('' + i);
}

const numberCfg = {count: DATA_COUNT, min: MIN, max: MAX};

const data = {
  labels: labels,
  datasets: [{
    data: [600,20,700]
  }, {
    data: Utils.numbers(numberCfg)
  }, {
    data: Utils.numbers(numberCfg)
  }]
};

function minValue(ctx) {
  const dataset = ctx.chart.data.datasets[0];
  const min = dataset.data.reduce((max, point) => Math.min(point, max), Infinity);
  return isFinite(min) ? min : 0;
}

function maxValue(ctx) {
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
  type: 'line',
  borderColor: 'black',
  borderWidth: 3,
  label: {
    display: true,
    backgroundColor: 'black',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 2,
    content: (ctx) => 'Lower bound: ' + minValue(ctx).toFixed(3),
    rotation: 'auto'
  },
  scaleID: 'y',
  value: minValue
};

const annotation2 = {
  type: 'line',
  borderWidth: 3,
  borderColor: 'black',
  label: {
    display: true,
    backgroundColor: 'black',
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 2,
    content: (ctx) => 'Upper bound: ' + maxValue(ctx).toFixed(3),
    rotation: 'auto'
  },
  scaleID: 'y',
  value: maxValue
};

const config = {
  type: 'line',
  data,
  options: {
    scales: {
      y: {
        stacked: true
      }
    },
    plugins: {
      annotation: {
        annotations: {
          annotation1,
          annotation2
        }
      }
    }
  }
} as ChartConfig<"line">;
ChartConfig.register(annotationPlugin);

const LineGraph: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  let myChart: Chart | null = null;

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (ctx) {
        // Chart.register(annotationPlugin as any);

        // eslint-disable-next-line react-hooks/exhaustive-deps
        myChart = new Chart(ctx, {
          ...(config),
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
