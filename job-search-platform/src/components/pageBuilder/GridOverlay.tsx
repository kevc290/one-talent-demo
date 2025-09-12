import { useState } from 'react';
import { Grid3X3, Eye, EyeOff } from 'lucide-react';

interface GridOverlayProps {
  columns?: number;
  rows?: number;
  show?: boolean;
}

export function GridOverlay({ columns = 48, rows = 50, show = true }: GridOverlayProps) {
  const [isVisible, setIsVisible] = useState(show);

  if (!isVisible) return null;

  const gridCells = [];
  
  // Create grid cells
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const isColumnMajor = (col + 1) % 12 === 0; // Every 12th column (quarter marks)
      const isColumnMinor = (col + 1) % 4 === 0; // Every 4th column
      const isRowMajor = (row + 1) % 4 === 0; // Every 4th row
      
      gridCells.push(
        <div
          key={`${row}-${col}`}
          className={`
            border-dashed pointer-events-none
            ${isColumnMajor ? 'border-blue-300 border-r-2' : 
              isColumnMinor ? 'border-blue-200 border-r' : 
              'border-gray-100 border-r'}
            ${isRowMajor ? 'border-blue-200 border-b' : 'border-gray-100 border-b'}
          `}
          style={{
            gridColumn: col + 1,
            gridRow: row + 1,
          }}
        />
      );
    }
  }

  return (
    <div 
      className="absolute inset-0 z-10 pointer-events-none"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: '0.5rem', // Match the layout engine gap
      }}
    >
      {gridCells}
      
      {/* Column labels */}
      <div className="absolute -top-6 left-0 right-0 flex text-xs text-gray-500">
        {Array.from({ length: Math.floor(columns / 4) }, (_, i) => (
          <div 
            key={i} 
            className="flex-1 text-center"
            style={{ width: `${400 / columns}%` }}
          >
            {(i + 1) * 4}
          </div>
        ))}
      </div>
      
      {/* Row labels */}
      <div className="absolute -left-8 top-0 bottom-0 flex flex-col text-xs text-gray-500">
        {Array.from({ length: Math.floor(rows / 4) }, (_, i) => (
          <div 
            key={i} 
            className="flex-1 flex items-center"
            style={{ height: `${400 / rows}%` }}
          >
            {(i + 1) * 4}
          </div>
        ))}
      </div>
    </div>
  );
}

export function GridToggle({ onToggle, isVisible }: { onToggle: () => void; isVisible: boolean }) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        isVisible 
          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      title={`${isVisible ? 'Hide' : 'Show'} grid overlay`}
    >
      {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      <Grid3X3 className="w-4 h-4" />
    </button>
  );
}