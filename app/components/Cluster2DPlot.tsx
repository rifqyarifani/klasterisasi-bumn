/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
}) as React.ComponentType<any>;

interface KodeSahamData {
  kode_saham: string;
  nama_perusahaan: string;
  PC1: number;
  PC2: number;
  cluster: number;
  gpm: number;
  ebitda: number;
  opm: number;
  npm: number;
  roe: number;
  roa: number;
  roic: number;
  dar: number;
  der: number;
  icr: number;
  dpr: number;
  at: number;
  cr: number;
  qr: number;
  wcta: number;
}

interface Cluster2DPlotProps {
  data: KodeSahamData[];
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
    const x = data.map((kode_saham) => kode_saham.PC1);
    const y = data.map((kode_saham) => kode_saham.PC2);
    // Calculate sizes based on selected variable
    const getSizeValue = (kode_saham: KodeSahamData) => {
      switch (sizeVariable) {
        case "gpm":
          return Math.max(8, kode_saham.gpm * 25);
        case "ebitda":
          return Math.max(8, kode_saham.ebitda * 25);
        case "opm":
          return Math.max(8, kode_saham.opm * 25);
        case "npm":
          return Math.max(8, kode_saham.npm * 25);
        case "roe":
          return Math.max(8, kode_saham.roe * 25);
        case "roa":
          return Math.max(8, kode_saham.roa * 25);
        case "roic":
          return Math.max(8, kode_saham.roic * 25);
        case "dar":
          return Math.max(8, kode_saham.dar * 25);
        case "der":
          return Math.max(8, kode_saham.der * 25);
        case "icr":
          return Math.max(8, kode_saham.icr * 25);
        case "dpr":
          return Math.max(8, kode_saham.dpr * 25);
        case "at":
          return Math.max(8, kode_saham.at * 25);
        case "cr":
          return Math.max(8, kode_saham.cr * 25);
        case "qr":
          return Math.max(8, kode_saham.qr * 25);
        case "wcta":
          return Math.max(8, kode_saham.wcta * 25);
        default:
          return Math.max(8, kode_saham.dpr * 25);
      }
    };

    const sizes = data.map(getSizeValue);
    const colors = data.map((kode_saham) => kode_saham.cluster);
    // Calculate cluster statistics
    const calculateClusterStats = () => {
      const stats: any = {};
      [1, 2, 3].forEach((cluster) => {
        const clusterData = data.filter(
          (kode_saham) => kode_saham.cluster === cluster
        );
        if (clusterData.length > 0) {
          stats[cluster] = {
            count: clusterData.length,
            perusahaan: clusterData.map((c) => ({
              kode_saham: c.kode_saham,
              nama_perusahaan: c.nama_perusahaan,
            })),
            avgGPM:
              clusterData.reduce((sum, c) => sum + c.gpm, 0) /
              clusterData.length,
            avgEBITDA:
              clusterData.reduce((sum, c) => sum + c.ebitda, 0) /
              clusterData.length,
            avgOPM:
              clusterData.reduce((sum, c) => sum + c.opm, 0) /
              clusterData.length,
            avgNPM:
              clusterData.reduce((sum, c) => sum + c.npm, 0) /
              clusterData.length,
            avgROE:
              clusterData.reduce((sum, c) => sum + c.roe, 0) /
              clusterData.length,
            avgROA:
              clusterData.reduce((sum, c) => sum + c.roa, 0) /
              clusterData.length,
            avgROIC:
              clusterData.reduce((sum, c) => sum + c.roic, 0) /
              clusterData.length,
            avgDAR:
              clusterData.reduce((sum, c) => sum + c.dar, 0) /
              clusterData.length,
            avgDER:
              clusterData.reduce((sum, c) => sum + c.der, 0) /
              clusterData.length,
            avgICR:
              clusterData.reduce((sum, c) => sum + c.icr, 0) /
              clusterData.length,
            avgDPR:
              clusterData.reduce((sum, c) => sum + c.dpr, 0) /
              clusterData.length,
            avgAT:
              clusterData.reduce((sum, c) => sum + c.at, 0) /
              clusterData.length,
            avgCR:
              clusterData.reduce((sum, c) => sum + c.cr, 0) /
              clusterData.length,
            avgQR:
              clusterData.reduce((sum, c) => sum + c.qr, 0) /
              clusterData.length,
            avgWCTA:
              clusterData.reduce((sum, c) => sum + c.wcta, 0) /
              clusterData.length,
          };
        }
      });
      setClusterStats(stats);
    };

    calculateClusterStats();

    const texts = data.map(
      (kode_saham) =>
        `<b>${kode_saham.nama_perusahaan} (${kode_saham.kode_saham})</b><br>` +
        `<b>Cluster ${kode_saham.cluster}</b><br><br>` +
        `📈  <b>Profitability / Return:</b><br>` +
        `• GPM: ${(kode_saham.gpm * 100).toFixed(1)}%<br>` +
        `• EBITDA: ${(kode_saham.ebitda * 100).toFixed(2)}%<br>` +
        `• OPM: ${(kode_saham.opm * 100).toFixed(1)}%<br>` +
        `• NPM  : ${(kode_saham.npm * 100).toFixed(2)}%<br>` +
        `• ROE  : ${(kode_saham.roe * 100).toFixed(2)}%<br>` +
        `• ROA  : ${(kode_saham.roa * 100).toFixed(2)}%<br>` +
        `• ROIC  : ${(kode_saham.roic * 100).toFixed(2)}%<br>` +
        `📊<b>Financial Strength / Leverage:</b><br>` +
        `• DAR: ${(kode_saham.dar * 100).toFixed(1)}%<br>` +
        `• DER: ${(kode_saham.der * 100).toFixed(1)}%<br>` +
        `• ICR: ${kode_saham.icr.toFixed(2)}<br>` +
        `• DPR: ${(kode_saham.dpr * 100).toFixed(1)}%<br>` +
        `📊<b>Dupont / Earning Power:</b><br>` +
        `• AT: ${kode_saham.at.toFixed(2)}<br>` +
        `📊<b>Liquidity:</b><br>` +
        `• CR: ${kode_saham.cr.toFixed(2)}<br>` +
        `• QR: ${kode_saham.qr.toFixed(2)}<br>` +
        `• WCTA: ${kode_saham.wcta.toFixed(2)}<br>`
    );

    // Create discrete colorscale for clusters
    const customColorscale = [
      [0, "rgb(128, 0, 128)"], // Purple for cluster 1
      [0.33, "rgb(128, 0, 128)"], // Purple for cluster 1
      [0.34, "rgb(0, 150, 136)"], // Teal for cluster 2
      [0.66, "rgb(0, 150, 136)"], // Teal for cluster 2
      [0.67, "rgb(255, 193, 7)"], // Amber for cluster 3
      [1, "rgb(255, 193, 7)"], // Amber for cluster 3
    ];

    const trace = {
      x,
      y,
      mode: "markers",
      type: "scatter",
      hoverlabel: {
        align: "left",
      },
      marker: {
        size: sizes,
        color: colors,
        cmin: 0.5,
        cmax: 3.5,
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
          tickvals: [1, 2, 3],
          ticktext: ["Klaster 1", "Klaster 2", "Klaster 3"],
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
      hoverlabel: {
        align: "left",
      },
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
              <option value="gpm">Gross Profit Margin (GPM)</option>
              <option value="ebitda">EBITDA Margin</option>
              <option value="opm">Operating Profit Margin (OPM)</option>
              <option value="npm">Net Profit Margin (NPM)</option>
              <option value="roe">Return on Equity (ROE)</option>
              <option value="roa">Return on Assets (ROA)</option>
              <option value="roic">Return on Invested Capital (ROIC)</option>
              <option value="dar">Debt to Asset Ratio (DAR)</option>
              <option value="der">Debt to Equity Ratio (DER)</option>
              <option value="icr">Interest Coverage Ratio (ICR)</option>
              <option value="dpr">Dividend Payout Ratio (DPR)</option>
              <option value="at">Asset Turnover (AT)</option>
              <option value="cr">Current Ratio (CR)</option>
              <option value="qr">Quick Ratio (QR)</option>
              <option value="wcta">
                Working Capital to Total Assets (WCTA)
              </option>
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
                          📈 Avg GPM: {(stats.avgGPM * 100).toFixed(1)}%
                        </div>
                        <div>
                          📈 Avg EBITDA: {(stats.avgEBITDA * 100).toFixed(1)}%
                        </div>
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
                          📈 Avg ROIC: {(stats.avgROIC * 100).toFixed(1)}%
                        </div>
                        <div>
                          📈 Avg DAR: {(stats.avgDAR * 100).toFixed(1)}%
                        </div>
                        <div>
                          📈 Avg DER: {(stats.avgDER * 100).toFixed(1)}%
                        </div>
                        <div>
                          📈 Avg ICR: {(stats.avgICR * 100).toFixed(1)}%
                        </div>
                        <div>
                          📈 Avg DPR: {(stats.avgDPR * 100).toFixed(1)}%
                        </div>
                        <div>📈 Avg AT: {(stats.avgAT * 100).toFixed(1)}%</div>
                        <div>📈 Avg CR: {(stats.avgCR * 100).toFixed(1)}%</div>
                        <div>📈 Avg QR: {(stats.avgQR * 100).toFixed(1)}%</div>
                        <div>
                          📈 Avg WCTA: {(stats.avgWCTA * 100).toFixed(1)}%
                        </div>
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
                            (p: {
                              kode_saham: string;
                              nama_perusahaan: string;
                            }) => (
                              <li
                                key={p.kode_saham}
                                className="py-1.5 px-2 text-xs text-gray-800 flex items-start justify-between hover:bg-gray-50 rounded"
                              >
                                <span className="font-medium leading-snug">
                                  {p.nama_perusahaan}
                                </span>
                                <span className="ml-2 shrink-0 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200">
                                  {p.kode_saham}
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
