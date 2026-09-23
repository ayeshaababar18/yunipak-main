/**
 * AnalyticsDashboard.tsx
 * Google Finance dark UI design applied to real Firebase analytics.
 *
 * Design language: Exact GF mobile dark theme
 *   – Background #0d0e13 · Card #1c1d22 · Row #202228
 *   – Index-style metric cards with inline SVG sparklines + ±badge
 *   – Area/line chart styled like GF's detail view (gradient fill, right Y-axis)
 *   – Watchlist-style entry rows (avatar · name · sparkline · age · ±avg)
 *   – Bottom tab bar: Overview | Entries | Submit
 *   – Period tabs on chart: ALL | L10 | L5
 */

import React, { useState, useEffect } from 'react';
import {
  collection, addDoc, onSnapshot, serverTimestamp,
  query,
  type QueryDocumentSnapshot, type DocumentData,
} from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Filler, Tooltip as CJTooltip,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, CJTooltip);

// ─── Types ─────────────────────────────────────────────────────────────────
interface Entry { id: string; name: string; age: number; message: string; }

// ─── Palette ───────────────────────────────────────────────────────────────
const C = {
  bg:       '#0d0e13',
  surface:  '#17181d',
  card:     '#1c1d22',
  row:      '#202228',
  border:   'rgba(255,255,255,0.08)',
  divider:  'rgba(255,255,255,0.05)',
  green:    '#81c995',
  red:      '#f28b82',
  blue:     '#8ab4f8',
  bluePill: '#1e3a5f',
  text:     '#e8eaed',
  muted:    '#9aa0a6',
  faint:    '#5f6368',
};

// ─── Inline SVG Sparkline ─────────────────────────────────────────────────
const Spark: React.FC<{ data: number[]; color: string; w?: number; h?: number }> = ({ data, color, w = 80, h = 36 }) => {
  if (data.length < 2) {
    return (
      <svg width={w} height={h}>
        <line x1="4" y1={h/2} x2={w-4} y2={h/2}
          stroke={color} strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.4" />
      </svg>
    );
  }
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pad = 3;
  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - ((v - min) / range) * (h - pad * 2),
  }));
  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');
  const areaPath = `M${pts[0].x},${pts[0].y} ` +
    pts.slice(1).map(p => `L${p.x},${p.y}`).join(' ') +
    ` L${pts[pts.length-1].x},${h} L${pts[0].x},${h} Z`;
  const gid = `sg-${color.replace('#','')}`;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.30" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gid})`} />
      <polyline points={polyline} fill="none"
        stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      {/* Last dot */}
      <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r="2.5" fill={color} />
    </svg>
  );
};

// ─── Change badge (GF style: ▼ -0.06%) ────────────────────────────────────
const Badge: React.FC<{ value: number; suffix?: string }> = ({ value, suffix = '' }) => {
  const up = value >= 0;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '2px 8px', borderRadius: 4,
      background: up ? 'rgba(129,201,149,0.14)' : 'rgba(242,139,130,0.14)',
      color: up ? C.green : C.red,
      fontSize: 11, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
      flexShrink: 0,
    }}>
      {up
        ? <svg width="8" height="8" viewBox="0 0 10 10"><path d="M5 1L9 9L1 9Z" fill="currentColor"/></svg>
        : <svg width="8" height="8" viewBox="0 0 10 10"><path d="M5 9L9 1L1 1Z" fill="currentColor"/></svg>}
      {(up ? '+' : '') + value.toFixed(2)}{suffix}
    </span>
  );
};

// ─── GF-style index metric card ────────────────────────────────────────────
interface MetricCardProps {
  label: string;
  value: string | number;
  badge?: number;
  badgeSuffix?: string;
  sparkData: number[];
  sparkColor: string;
  loading: boolean;
  onClick?: () => void;
}
const MetricCard: React.FC<MetricCardProps> = ({ label, value, badge, badgeSuffix, sparkData, sparkColor, loading, onClick }) => (
  <div onClick={onClick} style={{
    background: C.card, borderRadius: 12, padding: '14px 14px 10px',
    border: `1px solid ${C.border}`, flex: '1 1 0', minWidth: 0,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.12s ease',
  }}
  onMouseEnter={e => onClick && ((e.currentTarget as HTMLDivElement).style.transform = 'scale(0.98)')}
  onMouseLeave={e => onClick && ((e.currentTarget as HTMLDivElement).style.transform = 'none')}
  >
    <p style={{ fontSize: 12, color: C.muted, fontWeight: 500, margin: '0 0 4px' }}>{label}</p>
    {loading
      ? <div style={{ height: 28, display: 'flex', alignItems: 'center' }}>
          <div style={{ height: 8, width: 70, borderRadius: 4, background: C.row, animation: 'gfa-pulse 1.4s ease infinite' }} />
        </div>
      : <p style={{ fontSize: 22, fontWeight: 700, color: C.text, fontVariantNumeric: 'tabular-nums',
          fontFamily: "'Outfit',sans-serif", lineHeight: 1.15, margin: '0 0 5px' }}>
          {value}
        </p>
    }
    {badge !== undefined && !loading && <Badge value={badge} suffix={badgeSuffix} />}
    <div style={{ marginTop: 8 }}>
      <Spark data={sparkData} color={sparkColor} w={130} h={44} />
    </div>
  </div>
);

// ─── Entry row (GF watchlist style) ───────────────────────────────────────
const EntryRow: React.FC<{ entry: Entry; avgAge: number; idx: number }> = ({ entry, avgAge, idx }) => {
  const color = idx % 3 === 0 ? C.red : idx % 3 === 1 ? C.green : C.blue;
  const dev = entry.age - avgAge;
  // Mini sparkline: 8-point sine variation around age
  const sparkData = Array.from({ length: 8 }, (_, i) =>
    entry.age + Math.sin((i + entry.name.length) * 1.2) * 2.5
  );
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '36px 1fr 70px 80px',
      alignItems: 'center', gap: '10px',
      padding: '12px 16px', borderBottom: `1px solid ${C.divider}`,
      transition: 'background 0.12s', cursor: 'default',
    }}
    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.row}
    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
    >
      {/* Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: `${color}18`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, color, flexShrink: 0,
      }}>
        {entry.name.charAt(0).toUpperCase()}
      </div>
      {/* Name + message */}
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: 0,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {entry.name}
        </p>
        <p style={{ fontSize: 11, color: C.faint, margin: '2px 0 0',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {entry.message.slice(0, 36)}{entry.message.length > 36 ? '…' : ''}
        </p>
      </div>
      {/* Sparkline */}
      <Spark data={sparkData} color={color} w={64} h={28} />
      {/* Age + deviation */}
      <div style={{ textAlign: 'right' }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: 0, fontVariantNumeric: 'tabular-nums' }}>
          {entry.age}
        </p>
        <p style={{ fontSize: 11, margin: '2px 0 0', fontVariantNumeric: 'tabular-nums',
          color: dev >= 0 ? C.green : C.red }}>
          {dev >= 0 ? '+' : ''}{dev.toFixed(1)} {dev >= 0 ? '↑' : '↓'}
        </p>
      </div>
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────
const AnalyticsDashboard: React.FC = () => {
  const [tab, setTab] = useState<'overview' | 'entries' | 'submit'>('overview');
  const [chartPeriod, setChartPeriod] = useState<'ALL' | 'L10' | 'L5'>('ALL');

  // Form state
  const [name,    setName]    = useState('');
  const [age,     setAge]     = useState('');
  const [message, setMessage] = useState('');
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  // Data state
  const [entries,  setEntries]  = useState<Entry[]>([]);
  const [ready,    setReady]    = useState(false);

  // Derived metrics
  const totalCount = entries.length;
  const avgAge = entries.length > 0
    ? Math.round((entries.reduce((s, e) => s + e.age, 0) / entries.length) * 10) / 10
    : 0;
  const latestEntry = entries[0] ?? null;
  const ageHistory = [...entries].reverse().map(e => e.age);
  const countHistory = [...entries].reverse().map((_, i) => i + 1);

  // ── Firebase listener ───────────────────────────────────────────────────
  useEffect(() => {
    // Remove orderBy to ensure old records without createdAt are still fetched
    const q = query(collection(db, 'form_submissions'));
    const unsub = onSnapshot(q, snap => {
      const docs: (Entry & { _time: number })[] = [];
      snap.forEach((d: QueryDocumentSnapshot<DocumentData>) => {
        const data = d.data();
        let time = 0;
        if (data.createdAt === null) time = Date.now(); // pending local write
        else if (data.createdAt?.toMillis) time = data.createdAt.toMillis();
        else if (data.createdAt) time = Number(data.createdAt) || 0;
        
        docs.push({ 
          id: d.id, 
          name: String(data.name ?? ''), 
          age: Number(data.age ?? 0), 
          message: String(data.message ?? ''),
          _time: time
        });
      });
      // Sort in descending order (newest first)
      docs.sort((a, b) => b._time - a._time);
      // Limit to 30 and remove the temporary _time property
      setEntries(docs.slice(0, 30).map(({ _time, ...rest }) => rest as Entry));
      setReady(true);
    }, (err) => {
      console.error('Firebase error:', err);
      setReady(true);
    });
    return () => unsub();
  }, []);

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim(), a = parseInt(age, 10), m = message.trim();
    if (!n || n.length < 2) { setStatus('error'); setStatusMsg('Name must be at least 2 characters.'); return; }
    if (!age || isNaN(a) || a < 1 || a > 120) { setStatus('error'); setStatusMsg('Enter a valid age between 1 and 120.'); return; }
    if (!m || m.length < 5) { setStatus('error'); setStatusMsg('Message must be at least 5 characters.'); return; }
    setStatus('loading'); setStatusMsg('');
    try {
      await addDoc(collection(db, 'form_submissions'), { name: n, age: a, message: m, createdAt: serverTimestamp() });
      setStatus('success'); setStatusMsg('Entry recorded successfully.');
      setName(''); setAge(''); setMessage('');
      setTimeout(() => { setStatus('idle'); setStatusMsg(''); }, 3000);
    } catch {
      setStatus('error'); setStatusMsg('Submission failed. Please try again.');
    }
  };

  // ── Chart data ──────────────────────────────────────────────────────────
  const periodedEntries = chartPeriod === 'L5' ? entries.slice(0, 5).reverse()
    : chartPeriod === 'L10' ? entries.slice(0, 10).reverse()
    : [...entries].reverse();

  const chartLabels = periodedEntries.map(e => e.name.split(' ')[0]);
  const chartValues = periodedEntries.map(e => e.age);
  const hasChart = chartValues.length >= 2;

  const chartData = {
    labels: chartLabels,
    datasets: [{
      label: 'Age',
      data: chartValues,
      fill: true,
      borderColor: C.red,
      borderWidth: 1.5,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: C.red,
      tension: 0.35,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      backgroundColor: (ctx: any) => {
        const chart = ctx.chart;
        const { ctx: c, chartArea } = chart;
        if (!chartArea) return 'transparent';
        const grad = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        grad.addColorStop(0,    'rgba(242,139,130,0.28)');
        grad.addColorStop(0.65, 'rgba(13,14,19,0.05)');
        grad.addColorStop(1,    'rgba(13,14,19,0.00)');
        return grad;
      },
    }],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 400 },
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: C.card, borderColor: C.border, borderWidth: 1,
        titleColor: C.muted, bodyColor: C.text, padding: 10, cornerRadius: 8,
        callbacks: { label: ctx => `Age: ${ctx.parsed.y}` },
      },
    },
    scales: {
      x: {
        grid: { display: false }, border: { display: false },
        ticks: { color: C.faint, font: { size: 10 }, maxRotation: 0, maxTicksLimit: 7 },
      },
      y: {
        position: 'right',
        grid: { color: 'rgba(255,255,255,0.04)', drawTicks: false },
        border: { display: false },
        ticks: { color: C.faint, font: { size: 10 }, maxTicksLimit: 5 },
      },
    },
  };

  // ── Shared input style ──────────────────────────────────────────────────
  const inp: React.CSSProperties = {
    width: '100%', background: C.row, border: `1px solid ${C.border}`,
    borderRadius: 8, padding: '12px 14px', color: C.text,
    fontSize: 15, fontFamily: 'inherit', outline: 'none',
    transition: 'border-color 0.15s',
  };

  // ── TAB: OVERVIEW ───────────────────────────────────────────────────────
  const renderOverview = () => (
    <div>
      {/* Status bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 16px 14px', fontSize: 12, color: C.muted }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green,
          display: 'inline-block', animation: 'gfa-pulse 2s ease infinite' }} />
        Live · Firebase Firestore · {totalCount} total {totalCount === 1 ? 'entry' : 'entries'}
      </div>

      {/* 3 metric cards */}
      <div style={{ display: 'flex', gap: 10, padding: '0 16px 16px', overflowX: 'auto' }}>
        <MetricCard
          label="Total Entries"
          value={ready ? totalCount : '—'}
          badge={ready && totalCount > 0 ? totalCount : undefined}
          badgeSuffix=" total"
          sparkData={countHistory}
          sparkColor={C.green}
          loading={!ready}
        />
        <MetricCard
          label="Average Age"
          value={ready && avgAge > 0 ? avgAge : '—'}
          badge={ready && avgAge > 0 ? avgAge - 25 : undefined}
          badgeSuffix=" vs 25"
          sparkData={ageHistory}
          sparkColor={avgAge >= 25 ? C.green : C.red}
          loading={!ready}
        />
        <MetricCard
          label="Latest Entry"
          value={latestEntry ? latestEntry.name.split(' ')[0] : '—'}
          badge={latestEntry ? latestEntry.age - avgAge : undefined}
          badgeSuffix=" vs avg"
          sparkData={ageHistory.slice(-8)}
          sparkColor={latestEntry && latestEntry.age >= avgAge ? C.green : C.red}
          loading={!ready}
        />
      </div>

      {/* Main chart — GF detail-view style */}
      <div style={{ background: C.card, borderRadius: 12, margin: '0 16px 16px',
        border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        {/* Chart header */}
        <div style={{ padding: '14px 16px 0' }}>
          <p style={{ fontSize: 11, color: C.faint, textTransform: 'uppercase',
            letterSpacing: '0.08em', margin: '0 0 4px' }}>Age Distribution</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: C.text,
                fontFamily: "'Outfit',sans-serif", fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                {ready && avgAge > 0 ? avgAge : '—'}
              </span>
              {ready && avgAge > 0 && <Badge value={avgAge - 25} suffix=" avg" />}
            </div>
            {/* Period tabs */}
            <div style={{ display: 'flex', gap: 4 }}>
              {(['ALL', 'L10', 'L5'] as const).map(p => (
                <button key={p} onClick={() => setChartPeriod(p)} style={{
                  padding: '5px 10px', borderRadius: 16, border: 'none',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'inherit',
                  background: chartPeriod === p ? C.blue : 'transparent',
                  color: chartPeriod === p ? '#0d1b2e' : C.faint,
                  transition: 'all 0.15s',
                }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart canvas */}
        <div style={{ height: 200, padding: '8px 0 0' }}>
          {!hasChart
            ? <div style={{ height: '100%', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.faint} strokeWidth="1.5">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                <span style={{ fontSize: 13, color: C.faint }}>Submit 2+ entries to see the chart</span>
              </div>
            : <Line data={chartData} options={chartOptions} />
          }
        </div>

        {/* X range labels */}
        {hasChart && (
          <div style={{ display: 'flex', justifyContent: 'space-between',
            padding: '6px 16px 12px', borderTop: `1px solid ${C.divider}` }}>
            <span style={{ fontSize: 11, color: C.faint }}>Oldest</span>
            <span style={{ fontSize: 11, color: C.faint }}>Most Recent</span>
          </div>
        )}
      </div>

      {/* Summary stats card */}
      {ready && totalCount > 0 && (
        <div style={{ background: C.card, borderRadius: 12, margin: '0 16px 16px',
          padding: '14px 16px', border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.text,
            fontFamily: "'Outfit',sans-serif", margin: '0 0 12px' }}>Summary</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px' }}>
            {[
              { label: 'Total Entries',  value: totalCount },
              { label: 'Average Age',    value: avgAge },
              { label: 'Min Age',        value: Math.min(...entries.map(e => e.age)) },
              { label: 'Max Age',        value: Math.max(...entries.map(e => e.age)) },
            ].map(s => (
              <div key={s.label}>
                <p style={{ fontSize: 11, color: C.faint, margin: '0 0 3px' }}>{s.label}</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: C.text,
                  fontVariantNumeric: 'tabular-nums', margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ── TAB: ENTRIES ────────────────────────────────────────────────────────
  const renderEntries = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 16px 14px', fontSize: 12, color: C.muted }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green,
          display: 'inline-block', animation: 'gfa-pulse 2s ease infinite' }} />
        {totalCount} records · Age deviation vs average
      </div>

      <div style={{ background: C.card, borderRadius: 12, margin: '0 16px',
        border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        {/* Column headers */}
        {entries.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 70px 80px',
            gap: '10px', padding: '10px 16px', borderBottom: `1px solid ${C.border}` }}>
            {['', 'NAME', '', 'AGE'].map((h, i) => (
              <span key={i} style={{ fontSize: 10, fontWeight: 600, color: C.faint,
                letterSpacing: '0.07em', textAlign: i === 3 ? 'right' : 'left' }}>{h}</span>
            ))}
          </div>
        )}

        {!ready ? (
          <div style={{ padding: '24px 16px', display: 'flex', alignItems: 'center', gap: 8,
            color: C.faint, fontSize: 13 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke={C.faint} strokeWidth="2.5" strokeOpacity=".2"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke={C.green} strokeWidth="2.5" strokeLinecap="round"
                style={{ animation: 'gfa-spin 0.8s linear infinite', transformOrigin: '12px 12px' }}/>
            </svg>
            Connecting to Firestore…
          </div>
        ) : entries.length === 0 ? (
          <div style={{ padding: '40px 16px', textAlign: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.faint} strokeWidth="1.5" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            <p style={{ color: C.faint, fontSize: 13, marginTop: 10 }}>No entries yet. Use the Submit tab to add one.</p>
          </div>
        ) : (
          entries.map((entry, i) => (
            <EntryRow key={entry.id} entry={entry} avgAge={avgAge} idx={i} />
          ))
        )}
      </div>
    </div>
  );

  // ── TAB: SUBMIT ─────────────────────────────────────────────────────────
  const renderSubmit = () => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 16px 14px', fontSize: 12, color: C.muted }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        Submit an entry
      </div>

      {/* Form card */}
      <div style={{ background: C.card, borderRadius: 12, margin: '0 16px 16px',
        border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: C.text,
            fontFamily: "'Outfit',sans-serif", margin: 0 }}>New Submission</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Name */}
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 11, fontWeight: 600,
              color: C.faint, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              Full Name
            </label>
            <input type="text" placeholder="e.g. Ayesha Khan"
              value={name} onChange={e => setName(e.target.value)} maxLength={80} required
              disabled={status === 'loading'} className="gfa-inp" style={inp} />
          </div>

          {/* Age */}
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 11, fontWeight: 600,
              color: C.faint, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              Age
            </label>
            <input type="number" placeholder="e.g. 24"
              value={age} onChange={e => setAge(e.target.value)} min={1} max={120} required
              disabled={status === 'loading'} className="gfa-inp" style={inp} />
          </div>

          {/* Message */}
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 11, fontWeight: 600,
              color: C.faint, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              Message
            </label>
            <textarea placeholder="Your message…" rows={3}
              value={message} onChange={e => setMessage(e.target.value)} maxLength={1000} required
              disabled={status === 'loading'} className="gfa-inp"
              style={{ ...inp, resize: 'vertical', minHeight: 80 }} />
            <p style={{ textAlign: 'right', fontSize: 11, color: C.faint, marginTop: 3 }}>
              {message.length}/1000
            </p>
          </div>

          {/* Status banner */}
          {statusMsg && (
            <div style={{
              padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 8,
              background: status === 'success' ? 'rgba(129,201,149,0.12)' : 'rgba(242,139,130,0.12)',
              border: `1px solid ${status === 'success' ? 'rgba(129,201,149,0.25)' : 'rgba(242,139,130,0.25)'}`,
              color: status === 'success' ? C.green : C.red,
            }}>
              {status === 'success'
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
              {statusMsg}
            </div>
          )}

          {/* Submit */}
          <button type="submit" id="gfa-submit" disabled={status === 'loading'}
            className="gfa-submit-btn"
            style={{
              padding: '13px', background: 'transparent', color: C.text,
              fontWeight: 600, fontSize: 14, fontFamily: 'inherit',
              border: `1px solid ${C.border}`, borderRadius: 10, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.15s',
              opacity: status === 'loading' ? 0.5 : 1,
            }}>
            {status === 'loading'
              ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke={C.faint} strokeWidth="2.5" strokeOpacity=".3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke={C.text} strokeWidth="2.5" strokeLinecap="round"
                    style={{ animation: 'gfa-spin 0.8s linear infinite', transformOrigin: '12px 12px' }}/>
                </svg> Submitting…</>
              : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg> Submit Entry</>}
          </button>
        </form>
      </div>
    </div>
  );

  // ─── App shell ────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        @keyframes gfa-spin  { to { transform: rotate(360deg); } }
        @keyframes gfa-pulse { 0%,100%{opacity:1}50%{opacity:.35} }
        @keyframes gfa-in    { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none} }
        .gfa-inp:focus   { border-color: ${C.blue} !important; }
        .gfa-inp::placeholder { color: ${C.faint}; }
        .gfa-submit-btn:hover:not(:disabled) {
          background: ${C.blue}18 !important;
          border-color: ${C.blue} !important;
          color: ${C.blue} !important;
        }
        .gfa-submit-btn:disabled { cursor: not-allowed; }
        #gfa-tab-bar { position: sticky; bottom: 0; z-index: 50; }
        
        .gfa-container { max-width: 480px; }
        .gfa-layout { display: flex; flex-direction: column; }
        .gfa-section { display: none; }
        .gfa-section.active { display: block; }
        .gfa-sidebar { display: contents; }
        
        @media (min-width: 1024px) {
          .gfa-container { max-width: 1200px !important; padding: 0 24px; }
          .gfa-layout { flex-direction: row !important; gap: 32px; padding-bottom: 40px !important; }
          .gfa-section { display: block !important; animation: none !important; }
          .gfa-layout > .gfa-section { flex: 2; min-width: 0; }
          .gfa-sidebar { display: flex; flex-direction: column; flex: 1; gap: 24px; min-width: 0; }
          #gfa-tab-bar { display: none !important; }
          .gfa-header { padding: 24px 0 32px !important; }
          .gfa-entries-wrapper { max-height: 600px; overflow-y: auto; padding-right: 4px; }
          .gfa-entries-wrapper::-webkit-scrollbar { width: 6px; }
          .gfa-entries-wrapper::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh', background: C.bg, color: C.text,
        fontFamily: 'Inter, Roboto, system-ui, sans-serif',
        paddingTop: 'clamp(5rem, 9vw, 6.5rem)',
      }}>
        <div className="gfa-container" style={{ margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>

          {/* ── Page header ─────────────────────────────────────────── */}
          <div className="gfa-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 16px 8px', animation: 'gfa-in 0.3s ease both' }}>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 700,
              color: C.text, margin: 0 }}>
              Analytics
            </h1>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg,#4285f4,#34a853,#fbbc04,#ea4335)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff',
            }}>YP</div>
          </div>

          {/* ── Desktop Grid / Mobile Tabs ──────────────────────────── */}
          <div className="gfa-layout" style={{ flex: 1, paddingBottom: 80, animation: 'gfa-in 0.35s ease 0.05s both' }}>
            <div className={`gfa-section ${tab === 'overview' ? 'active' : ''}`}>
              {renderOverview()}
            </div>
            
            <div className="gfa-sidebar">
              <div className={`gfa-section ${tab === 'submit' ? 'active' : ''}`}>
                {renderSubmit()}
              </div>
              <div className={`gfa-section ${tab === 'entries' ? 'active' : ''}`}>
                <div className="gfa-entries-wrapper">
                  {renderEntries()}
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom tab bar ──────────────────────────────────────── */}
          <div id="gfa-tab-bar" style={{
            background: '#111217', borderTop: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-around',
            padding: '6px 8px 12px',
          }}>
            {[
              { id: 'overview', label: 'Overview',
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="6" height="18" rx="1"/><rect x="9" y="8" width="6" height="13" rx="1"/><rect x="16" y="13" width="6" height="8" rx="1"/></svg> },
              { id: 'entries', label: 'Entries',
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
              { id: 'submit', label: 'Submit',
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id as typeof tab)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '6px 24px', borderRadius: 24, border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 500,
                background: tab === t.id ? C.bluePill : 'transparent',
                color: tab === t.id ? C.blue : C.faint,
                transition: 'all 0.2s ease',
              }}>
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsDashboard;
