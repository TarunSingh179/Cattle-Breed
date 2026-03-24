import React from 'react';

export default function ResultCard({ result, onReset }) {
  if (!result) return null;
  const { breed, confidence, description, filename, size_bytes } = result;
  const pct = Math.round(confidence * 1000) / 10;

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-800">Prediction Result</h3>
        <button onClick={onReset} className="px-3 py-1.5 text-sm rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700">Reset</button>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-sky-700">{breed}</div>
        <div className="mt-1 text-slate-600">Confidence: <span className="font-medium">{pct}%</span></div>
        <p className="mt-3 text-slate-700">{description}</p>
        <div className="mt-4 text-xs text-slate-500">File: {filename} • {size_bytes} bytes</div>
      </div>
    </div>
  );
}
