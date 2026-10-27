import type { ReactNode } from "react";

export function PageHead({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="a-head">
      <div>
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export function Kpi({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: "good" | "warn" | "bad" | "info" }) {
  return (
    <div className="kpi">
      <span>{label}</span>
      <b className="display">{value}</b>
      {hint && <small className={tone ? `t-${tone}` : ""}>{hint}</small>}
    </div>
  );
}

export function Card({ title, action, children, className = "" }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`card ${className}`}>
      {(title || action) && (
        <header>
          {title && <h2>{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function Pill({ tone, children }: { tone: "good" | "warn" | "bad" | "info" | "neutral"; children: ReactNode }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

// Single-series vertical bars with hover tooltip and a table fallback.
export function Bars({ data, label, format }: { data: { label: string; value: number; tip?: string }[]; label: string; format: (n: number) => string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const peak = data.findIndex((d) => d.value === max);
  return (
    <figure className="bars" aria-label={label}>
      <div className="bars-plot">
        {[1, 0.5].map((g) => (
          <div key={g} className="bars-grid" style={{ bottom: `${g * 100}%` }}>
            <span>{format(max * g)}</span>
          </div>
        ))}
        {data.map((d, i) => (
          <div key={d.label} className="bar-col" tabIndex={0}>
            {i === peak && <em className="bar-label">{format(d.value)}</em>}
            <div className={`bar${i === peak ? " peak" : ""}`} style={{ height: `${(d.value / max) * 100}%` }} />
            <div className="tip">
              <b>{d.label}</b>
              {format(d.value)}
              {d.tip && <small>{d.tip}</small>}
            </div>
          </div>
        ))}
      </div>
      <div className="bars-x">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
      <details className="as-table">
        <summary>View as table</summary>
        <table>
          <tbody>
            {data.map((d) => (
              <tr key={d.label}>
                <td>{d.label}</td>
                <td>{format(d.value)}</td>
                {d.tip && <td>{d.tip}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

export function HBars({ data, suffix = "" }: { data: { label: string; value: number }[]; suffix?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className="hbars">
      {data.map((d) => (
        <li key={d.label} title={`${d.label}: ${d.value}${suffix}`}>
          <span className="hb-l">{d.label}</span>
          <span className="hb-t">
            <span className="hb-f" style={{ width: `${(d.value / max) * 100}%` }} />
          </span>
          <span className="hb-v">
            {d.value}
            {suffix}
          </span>
        </li>
      ))}
    </ul>
  );
}
