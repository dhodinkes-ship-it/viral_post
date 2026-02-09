
import React from 'react';

interface TimelineIssue {
  timestamp: string;
  type: 'drop' | 'attention' | 'low-quality';
  message: string;
  color: string;
}

export const TimelineVisualizer: React.FC<{ issues: TimelineIssue[] }> = ({ issues }) => {
  return (
    <div className="space-y-4">
      <div className="h-3 w-full bg-slate-800 rounded-full relative overflow-hidden">
        {/* Simplified segments */}
        <div className="absolute inset-0 flex">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 h-full border-r border-black/20 ${
                i < 3 ? 'bg-green-500/40' : i < 12 ? 'bg-blue-500/30' : 'bg-slate-600/20'
              }`}
            />
          ))}
        </div>
        {/* Issue Markers */}
        {issues.map((issue, idx) => (
          <div 
            key={idx}
            className="absolute h-full w-1 top-0 animate-pulse"
            style={{ 
                left: `${(idx + 1) * 15}%`, // Mock positioning
                backgroundColor: issue.color 
            }}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {issues.map((issue, idx) => (
          <div key={idx} className="glass-card p-3 rounded-xl flex items-start space-x-3">
            <div className="w-2 h-2 mt-1.5 rounded-full shrink-0" style={{ backgroundColor: issue.color }} />
            <div>
              <p className="text-xs font-bold text-slate-400">{issue.timestamp}</p>
              <p className="text-sm leading-tight text-slate-100">{issue.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
