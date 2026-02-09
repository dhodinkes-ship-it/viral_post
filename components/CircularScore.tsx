
import React from 'react';

interface CircularScoreProps {
  score: number;
  size?: number;
}

export const CircularScore: React.FC<CircularScoreProps> = ({ score, size = 180 }) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return '#22c55e'; // green
    if (s >= 60) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          className="text-white/5"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          className="transition-all duration-1000 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={getColor(score)}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-outfit font-extrabold tracking-tighter" style={{ color: getColor(score) }}>
          {score}
        </span>
        <span className="text-xs uppercase tracking-widest text-slate-400 font-medium">Virality Score</span>
      </div>
    </div>
  );
};
