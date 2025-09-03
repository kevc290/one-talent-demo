import React from 'react';

interface CompanyLogoProps {
  name: string;
  size?: number;
  className?: string;
}

function hashStringToNumber(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  const words = name
    .replace(/&/g, ' ')
    .replace(/[^A-Za-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return '??';
  if (words.length === 1) {
    const w = words[0];
    return (w[0] + (w[1] || '')).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function CompanyLogo({ name, size = 48, className }: CompanyLogoProps) {
  const hash = hashStringToNumber(name);
  const hue = hash % 360;
  const isCircle = (hash % 2) === 0;
  const bgColor = `hsl(${hue} 70% 45%)`;
  const textColor = '#ffffff';
  const initials = getInitials(name);

  const dimension = size;

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${name} logo`}
      className={className}
    >
      {isCircle ? (
        <circle cx="50" cy="50" r="48" fill={bgColor} />
      ) : (
        <rect x="2" y="2" width="96" height="96" rx="18" ry="18" fill={bgColor} />
      )}
      <text
        x="50"
        y="56"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
        fontWeight="700"
        fontSize="42"
        fill={textColor}
      >
        {initials}
      </text>
    </svg>
  );
}

export default CompanyLogo;


