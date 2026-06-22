import React from 'react';
import Link from 'next/link';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  colorType?: 'default' | 'success' | 'warning' | 'info' | 'danger';
  href?: string;
  children?: React.ReactNode;
}

function getColorClasses(colorType: string) {
  switch (colorType) {
    case 'success': return 'text-emerald-600';
    case 'warning': return 'text-amber-500';
    case 'danger': return 'text-rose-500';
    case 'info': return 'text-cyan-500';
    default: return 'text-slate-800';
  }
}

function hasActualChildren(children: React.ReactNode): boolean {
  if (!children) return false;
  const arr = React.Children.toArray(children);
  return arr.some(child => {
    if (child === null || child === undefined || child === false || child === true) {
      return false;
    }
    if (typeof child === 'string' && child.trim() === '') {
      return false;
    }
    return true;
  });
}

function TitleNode({ href, title, hasChildren }: any) {
  if (href && hasChildren) {
    return (
      <Link href={href} className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 hover:text-[var(--color-primary)] transition-colors block">
        {title}
      </Link>
    );
  }
  return <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</h3>;
}

export function MetricCard(props: MetricCardProps) {
  const { title, value, subtitle, colorType = 'default', href, children } = props;
  const hasChildren = hasActualChildren(children);
  const isLink = !!(href && !hasChildren);
  const containerClasses = `bg-white rounded-2xl p-5 shadow-sm border border-slate-100 transition-all duration-200 block h-full ${href ? "hover:shadow-md hover:border-[var(--color-primary)]/30 cursor-pointer active:scale-[0.98]" : "hover:shadow-md"}`;

  const content = (
    <>
      <TitleNode href={href} title={title} hasChildren={hasChildren} />
      <div className={`text-3xl font-bold ${getColorClasses(colorType)}`}>{value}</div>
      {subtitle && <p className="text-xs text-slate-400 mt-2 font-medium">{subtitle}</p>}
      {hasChildren && <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">{children}</div>}
    </>
  );

  return isLink ? (
    <Link href={href!} className={containerClasses}>{content}</Link>
  ) : (
    <div className={containerClasses}>{content}</div>
  );
}

