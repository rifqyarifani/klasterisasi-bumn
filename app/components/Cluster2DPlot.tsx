/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
}) as React.ComponentType<any>;

// Menyesuaikan dengan format data terbaru di public/data.json
interface BUMNData {
  NAMA_PERUSAHAAN: string;
  PC1: number;
  PC2: number;
  CLUSTER: number;
  OPM: number;
  NPM: number;
  ROE: number;
  ROA: number;
  DAR: number;
  DER: number;
  CR: number;
  TATO: number;
}

interface Cluster2DPlotProps {
  data: BUMNData[];
}

export default function Cluster2DPlot({ data }: Cluster2DPlotProps) {
  const [plotData, setPlotData] = useState<any[]>([]);
  const [layout, setLayout] = useState<any>({});
  const [isClient, setIsClient] = useState(false);
  const [sizeVariable, setSizeVariable] = useState<string>("dpr");
  const [clusterStats, setClusterStats] = useState<any>({});

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (data.length === 0 || !isClient) return;

    // Prepare data for 2D scatter plot - all points in one trace
    const x = data.map((d) => d.PC1);
    const y = data.map((d) => d.PC2);
    // Calculate sizes based on selected variable (hanya field yang ada di data.json)
    const getSizeValue = (d: BUMNData) => {
      switch (sizeVariable) {
        case "opm":
          return Math.max(8, d.OPM * 25);
        case "npm":
          return Math.max(8, d.NPM * 25);
        case "roe":
          return Math.max(8, d.ROE * 25);
        case "roa":
          return Math.max(8, d.ROA * 25);
        case "dar":
          return Math.max(8, d.DAR * 25);
        case "der":
          return Math.max(8, d.DER * 25);
        case "cr":
          return Math.max(8, d.CR * 25);
        case "tato":
          return Math.max(8, d.TATO * 25);
        default:
          return Math.max(8, d.OPM * 25);
      }
    };

    const sizes = data.map(getSizeValue);
    const colors = data.map((d) => d.CLUSTER);
    // Calculate cluster statistics
    const calculateClusterStats = () => {
      const stats: any = {};
      const uniqueClusters = Array.from(new Set(data.map((d) => d.CLUSTER)));

      uniqueClusters.forEach((cluster) => {
        const clusterData = data.filter((d) => d.CLUSTER === cluster);
        if (clusterData.length > 0) {
          stats[cluster] = {
            count: clusterData.length,
            perusahaan: clusterData.map((c) => ({
              nama_perusahaan: c.NAMA_PERUSAHAAN,
            })),
            avgOPM:
              clusterData.reduce((sum, c) => sum + c.OPM, 0) /
              clusterData.length,
            avgNPM:
              clusterData.reduce((sum, c) => sum + c.NPM, 0) /
              clusterData.length,
            avgROE:
              clusterData.reduce((sum, c) => sum + c.ROE, 0) /
              clusterData.length,
            avgROA:
              clusterData.reduce((sum, c) => sum + c.ROA, 0) /
              clusterData.length,
            avgDAR:
              clusterData.reduce((sum, c) => sum + c.DAR, 0) /
              clusterData.length,
            avgDER:
              clusterData.reduce((sum, c) => sum + c.DER, 0) /
              clusterData.length,
            avgCR:
              clusterData.reduce((sum, c) => sum + c.CR, 0) /
              clusterData.length,
            avgTATO:
              clusterData.reduce((sum, c) => sum + c.TATO, 0) /
              clusterData.length,
          };
        }
      });
      setClusterStats(stats);
    };

    calculateClusterStats();

    const texts = data.map(
      (d) =>
        `<b>${d.NAMA_PERUSAHAAN}</b><br>` +
        `<b>Cluster ${d.CLUSTER}</b><br><br>` +
        `📈 <b>Profitability / Return:</b><br>` +
        `• OPM: ${(d.OPM * 100).toFixed(1)}%<br>` +
        `• NPM: ${(d.NPM * 100).toFixed(2)}%<br>` +
        `• ROE: ${(d.ROE * 100).toFixed(2)}%<br>` +
        `• ROA: ${(d.ROA * 100).toFixed(2)}%<br>` +
        `📊 <b>Financial Strength / Leverage:</b><br>` +
        `• DAR: ${(d.DAR * 100).toFixed(1)}%<br>` +
        `• DER: ${d.DER.toFixed(2)}<br>` +
        `📊 <b>Dupont / Earning Power:</b><br>` +
        `• TATO: ${(d.TATO * 100).toFixed(1)}%<br>` +
        `📊 <b>Liquidity:</b><br>` +
        `• CR: ${d.CR.toFixed(2)}<br>`
    );

    // Create discrete colorscale for clusters (mendukung sampai 4 klaster)
    const customColorscale = [
      [0, "rgb(128, 0, 128)"], // Cluster 1 - Purple
      [0.24, "rgb(128, 0, 128)"],
      [0.25, "rgb(0, 150, 136)"], // Cluster 2 - Teal
      [0.49, "rgb(0, 150, 136)"],
      [0.5, "rgb(255, 193, 7)"], // Cluster 3 - Amber
      [0.74, "rgb(255, 193, 7)"],
      [0.75, "rgb(52, 152, 219)"], // Cluster 4 - Blue
      [1, "rgb(52, 152, 219)"],
    ];

    const trace = {
      x,
      y,
      mode: "markers",
      type: "scatter",
      marker: {
        size: sizes,
        color: colors,
        cmin: 0.5,
        cmax: 4.5,
        colorscale: customColorscale,
        colorbar: {
          tickmode: "array",
          // title: {
          //   text: "Klaster",
          //   font: { size: 16, color: "#2c3e50" },
          // },
          titleside: "right",
          thickness: 15,
          len: 0.5,
          tickvals: [1, 2, 3, 4],
          ticktext: ["Klaster 1", "Klaster 2", "Klaster 3", "Klaster 4"],
          tickfont: { size: 12, color: "#2c3e50" },
        },
        line: {
          color: "rgba(0,0,0,0.3)",
          width: 1,
        },
        opacity: 0.9,
      },
      text: texts,
      hoverinfo: "text",
      showlegend: false,
    };

    setPlotData([trace]);

    // Set layout
    setLayout({
      // title: {
      //   text: "Visualisasi PCA 2D",
      //   font: {
      //     size: 20,
      //     color: "#2c3e50",
      //   },
      //   x: 0.5,
      //   xanchor: "center",
      // },
      xaxis: {
        title: {
          text: "PC1 (First Principal Component)",
          font: { size: 14, color: "#2c3e50" },
        },
        gridcolor: "#e0e0e0",
        zerolinecolor: "#b0b0b0",
        showgrid: true,
        showline: true,
        linecolor: "#2c3e50",
        tickfont: { size: 12, color: "#2c3e50" },
        titlefont: { size: 14, color: "#2c3e50" },
        fixedrange: true,
      },
      yaxis: {
        title: {
          text: "PC2 (Second Principal Component)",
          font: { size: 14, color: "#2c3e50" },
        },
        gridcolor: "#e0e0e0",
        zerolinecolor: "#b0b0b0",
        showgrid: true,
        showline: true,
        linecolor: "#2c3e50",
        tickfont: { size: 12, color: "#2c3e50" },
        titlefont: { size: 14, color: "#2c3e50" },
        fixedrange: true,
      },
      width: 825,
      height: 500,
      margin: {
        l: 60,
        r: 40,
        b: 40,
        t: 0,
        pad: 4,
      },
      paper_bgcolor: "white",
      plot_bgcolor: "white",
    });
  }, [data, isClient, sizeVariable]);

  if (data.length === 0 || !isClient) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-64 text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Plot Area */}
        <div className="lg:col-span-3">
          {/* Size Variable Control */}
          <div className="mb-6 flex items-center justify-center gap-4">
            <label
              htmlFor="sizeVariable"
              className="text-md font-medium text-gray-700"
            >
              Ukuran Titik Berdasarkan:
            </label>
            <select
              id="sizeVariable"
              value={sizeVariable}
              onChange={(e) => setSizeVariable(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="opm">Operating Profit Margin (OPM)</option>
              <option value="npm">Net Profit Margin (NPM)</option>
              <option value="roe">Return on Equity (ROE)</option>
              <option value="roa">Return on Assets (ROA)</option>
              <option value="dar">Debt to Asset Ratio (DAR)</option>
              <option value="der">Debt to Equity Ratio (DER)</option>
              <option value="tato">Total Asset Turnover (TATO)</option>
              <option value="cr">Current Ratio (CR)</option>
            </select>
          </div>

          <div className="flex justify-center">
            <Plot
              data={plotData}
              layout={layout}
              config={{
                responsive: true,
                displayModeBar: false,
                staticPlot: false,
                scrollZoom: false,
                doubleClick: false,
                showTips: true,
                editable: false,
                toImageButtonOptions: {
                  format: "png",
                  filename: "cluster_plot",
                  height: 600,
                  width: 800,
                  scale: 1,
                },
              }}
            />
          </div>
        </div>

        {/* Cluster Statistics Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4 h-fit">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📊 Statistik Klaster
            </h3>
            <div className="space-y-4">
              {Object.keys(clusterStats)
                .sort((a, b) => parseInt(b) - parseInt(a))
                .map((cluster) => {
                  const stats = clusterStats[cluster];
                  const clusterColors: Record<string, string> = {
                    "1": "rgb(128, 0, 128)",
                    "2": "rgb(0, 150, 136)",
                    "3": "rgb(255, 193, 7)",
                    "4": "rgb(52, 152, 219)",
                  };

                  return (
                    <div
                      key={cluster}
                      className="bg-white rounded-lg p-3 shadow-sm"
                    >
                      <div className="flex items-center mb-2">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: clusterColors[cluster] }}
                        ></div>
                        <h4 className="font-medium text-gray-800">
                          Klaster {cluster}
                        </h4>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>
                          📈 Avg OPM: {(stats.avgOPM * 100).toFixed(1)}%
                        </div>
                        <div>
                          📈 Avg NPM: {(stats.avgNPM * 100).toFixed(1)}%
                        </div>
                        <div>
                          📈 Avg ROE: {(stats.avgROE * 100).toFixed(1)}%
                        </div>
                        <div>
                          📈 Avg ROA: {(stats.avgROA * 100).toFixed(1)}%
                        </div>
                        <div>
                          📈 Avg DAR: {(stats.avgDAR * 100).toFixed(1)}%
                        </div>
                        <div>
                          📈 Avg DER: {(stats.avgDER * 100).toFixed(1)}%
                        </div>
                        <div>
                          📈 Avg CR: {(stats.avgCR * 100).toFixed(1)}%
                        </div>
                        <div>📈 Avg TATO: {(stats.avgTATO * 100).toFixed(1)}%</div>
                      </div>
                      <details className="mt-3 group">
                        <summary className="flex items-center justify-between text-xs cursor-pointer select-none py-1 px-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100">
                          <span className="font-medium">Daftar Perusahaan</span>
                          <span className="ml-2 inline-flex items-center justify-center min-w-6 h-5 px-2 rounded-full text-[10px] font-semibold bg-white text-blue-700 ring-1 ring-inset ring-blue-200">
                            {stats.perusahaan.length}
                          </span>
                        </summary>
                        <ul className="mt-2 max-h-48 overflow-y-auto pr-1 divide-y divide-gray-100">
                          {stats.perusahaan.map(
                            (p: { nama_perusahaan: string }) => (
                              <li
                                key={p.nama_perusahaan}
                                className="py-1.5 px-2 text-xs text-gray-800 flex items-start hover:bg-gray-50 rounded"
                              >
                                <span className="font-medium leading-snug">
                                  {p.nama_perusahaan}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </details>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
