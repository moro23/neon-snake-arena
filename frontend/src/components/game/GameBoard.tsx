import React from 'react';
import { Position, GRID_SIZE, CELL_SIZE } from '@/utils/gameLogic';

interface GameBoardProps {
  snake: Position[];
  food: Position;
}

export const GameBoard: React.FC<GameBoardProps> = ({ snake, food }) => {
  return (
    <div 
      className="relative bg-card border-2 border-primary neon-border game-pixel mx-auto"
      style={{
        width: GRID_SIZE * CELL_SIZE,
        height: GRID_SIZE * CELL_SIZE,
      }}
    >
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: GRID_SIZE }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute w-full border-t border-primary"
            style={{ top: i * CELL_SIZE }}
          />
        ))}
        {Array.from({ length: GRID_SIZE }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute h-full border-l border-primary"
            style={{ left: i * CELL_SIZE }}
          />
        ))}
      </div>

      {/* Snake */}
      {snake.map((segment, index) => (
        <div
          key={`snake-${index}`}
          className="absolute bg-neon-green transition-all duration-75"
          style={{
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            left: segment.x * CELL_SIZE + 1,
            top: segment.y * CELL_SIZE + 1,
            boxShadow: index === 0 ? 'var(--shadow-neon)' : 'none',
            opacity: index === 0 ? 1 : 0.8 - (index * 0.01),
          }}
        />
      ))}

      {/* Food */}
      <div
        className="absolute bg-neon-red animate-pulse"
        style={{
          width: CELL_SIZE - 2,
          height: CELL_SIZE - 2,
          left: food.x * CELL_SIZE + 1,
          top: food.y * CELL_SIZE + 1,
          boxShadow: 'var(--shadow-neon-red)',
        }}
      />
    </div>
  );
};
