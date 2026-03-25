"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Lightbulb, LineChart, TrendingUp, Zap } from "lucide-react";
import { SectionCard } from "@/components/deputy/section-card";
import { StatCard } from "@/components/deputy/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import { mockForecasts } from "@/constants/deputy-mock-data";

const metricOptions = ["Enrollment", "Revenue ($M)", "GPA"];
const confidenceColors: Record<string, string> = {
  high: "text-[#166534]",
  medium: "text-[#92400e]",
  low: "text-[#991b1b]",
};

const recommendations = [
  {
    icon: TrendingUp,
    title: "Increase recruitment in Q3",
    description:
      "Baseline forecast shows plateau. A targeted summer recruitment campaign could add 80-120 students.",
  },
  {
    icon: Zap,
    title: "Intervene in Humanities retention",
    description:
      "Conservative scenario driven partly by 16.9% dropout in Humanities. Address root causes to move toward baseline.",
  },
  {
    icon: Lightbulb,
    title: "Diversify revenue streams",
    description:
      "Revenue forecast gap between optimistic and conservative is $630K. Short courses and executive education can reduce risk.",
  },
  {
    icon: LineChart,
    title: "Hire 8-12 new faculty by Fall",
    description:
      "Natural Sciences ratio of 36.9:1 limits enrollment growth. Faculty expansion unlocks optimistic scenario.",
  },
];

export default function ForecastingPage() {
  const [selectedMetric, setSelectedMetric] = useState("Enrollment");
  const [selectedScenario, setSelectedScenario] = useState("scenario-baseline");

  const scenario = mockForecasts.find((s) => s.id === selectedScenario) ?? mockForecasts[1];

  const chartData = scenario.projections.map((p) => ({
    period: p.period,
    actual: p.actual,
    forecast: p.actual !== null ? null : p.forecast,
    upper: p.actual !== null ? null : p.upper,
    lower: p.actual !== null ? null : p.lower,
    value: p.actual ?? p.forecast,
  }));

  const lastForecast = scenario.projections[scenario.projections.length - 1];

  const scenarioComparisonData = scenario.projections.map((p, i) => {
    const opt = mockForecasts[0].projections[i];
    const base = mockForecasts[1].projections[i];
    const cons = mockForecasts[2].projections[i];
    return {
      period: p.period,
      Optimistic: opt.actual ?? opt.forecast,
      Baseline: base.actual ?? base.forecast,
      Conservative: cons.actual ?? cons.forecast,
    };
  });

  return (
    <div>
      <PageHeader
        title="Forecasting & Strategic Planning"
        description="Enrollment, revenue, and performance projections with scenario modeling"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Forecasted Enrollment"
          value={lastForecast.forecast.toLocaleString()}
          icon={TrendingUp}
          accent="info"
          subtitle={`Sep 2026 (${scenario.name})`}
        />
        <StatCard
          label="Forecasted Revenue"
          value="$15.8M"
          icon={LineChart}
          accent="success"
          subtitle="FY 2026 projection"
        />
        <StatCard
          label="Forecast Confidence"
          value={scenario.projections[6]?.confidence === "high" ? "High" : scenario.projections[6]?.confidence === "medium" ? "Medium" : "Low"}
          icon={Zap}
          accent={
            scenario.projections[6]?.confidence === "high"
              ? "success"
              : scenario.projections[6]?.confidence === "medium"
                ? "warning"
                : "danger"
          }
          subtitle="Near-term projection"
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
        >
          {metricOptions.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <div className="flex gap-1.5">
          {mockForecasts.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedScenario(s.id)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                selectedScenario === s.id
                  ? "bg-foreground text-background"
                  : "border border-border bg-background text-foreground hover:bg-secondary"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title={`${selectedMetric} Forecast — ${scenario.name} Scenario`}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
                <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#actualGrad)"
                  name="Actual"
                  connectNulls={false}
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#forecastGrad)"
                  name="Forecast"
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-2 flex gap-4 text-xs text-secondary-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#3b82f6]" /> Actual
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#f59e0b]" /> Forecast
              </span>
            </div>
          </SectionCard>

          <SectionCard title="Scenario Comparison">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-secondary-foreground">
                    <th className="pb-2 font-medium">Period</th>
                    <th className="pb-2 font-medium text-[#22c55e]">Optimistic</th>
                    <th className="pb-2 font-medium">Baseline</th>
                    <th className="pb-2 font-medium text-[#ef4444]">Conservative</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarioComparisonData
                    .filter((_, i) => i >= 6)
                    .map((row) => (
                      <tr
                        key={row.period}
                        className="border-b border-border hover:bg-secondary/50 last:border-0"
                      >
                        <td className="py-2 font-medium">{row.period}</td>
                        <td className="py-2 text-[#166534]">
                          {row.Optimistic.toLocaleString()}
                        </td>
                        <td className="py-2">{row.Baseline.toLocaleString()}</td>
                        <td className="py-2 text-[#991b1b]">
                          {row.Conservative.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title={`${scenario.name} Scenario`}>
            <p className="mb-3 text-sm text-secondary-foreground">
              {scenario.description}
            </p>
            <p className="mb-2 text-sm font-medium">Key Assumptions</p>
            <ul className="space-y-1.5">
              {scenario.assumptions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                  <span className="text-secondary-foreground">{a}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-1">
              <p className="text-xs font-medium">Confidence by Period</p>
              {scenario.projections.slice(6).map((p) => (
                <div key={p.period} className="flex items-center justify-between text-xs">
                  <span className="text-secondary-foreground">{p.period}</span>
                  <span className={`font-medium capitalize ${confidenceColors[p.confidence]}`}>
                    {p.confidence}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Strategic Recommendations">
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <rec.icon className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium">{rec.title}</p>
                    <p className="mt-0.5 text-xs text-secondary-foreground">
                      {rec.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
