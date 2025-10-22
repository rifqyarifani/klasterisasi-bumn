"use client";

import { useState, useEffect } from "react";
import Cluster2DPlot from "./components/Cluster2DPlot";

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

export default function Dashboard() {
  const [data, setData] = useState<KodeSahamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/data.json");
        if (!response.ok) {
          throw new Error("Failed to load data");
        }
        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        setError("Error loading data. Please try again.");
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading Dashboard Visualisasi Klaster 2D...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-2xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            <span className="bg-linear-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
              Dashboard Visualisasi Klaster 2D
            </span>
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Analisis klaster hasil{" "}
            <span className="font-medium text-indigo-600">
              Principal Component Analysis (PCA)
            </span>
          </p>
          <div className="mt-4 h-1 w-48 mx-auto bg-indigo-500 rounded-full" />
        </div>

        <Cluster2DPlot data={data} />
      </div>
    </div>
  );
}
