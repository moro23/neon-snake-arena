import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Direction } from '@/utils/gameLogic';

interface ControlsProps {
  onDirectionChange: (direction: Direction) => void;
  disabled?: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ onDirectionChange, disabled }) => {
  return (
    <div className="flex flex-col items-center gap-2 md:hidden">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onDirectionChange('UP')}
        disabled={disabled}
        className="w-16 h-16 border-primary hover:bg-primary/20"
      >
        <ArrowUp className="w-6 h-6" />
      </Button>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDirectionChange('LEFT')}
          disabled={disabled}
          className="w-16 h-16 border-primary hover:bg-primary/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDirectionChange('DOWN')}
          disabled={disabled}
          className="w-16 h-16 border-primary hover:bg-primary/20"
        >
          <ArrowDown className="w-6 h-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDirectionChange('RIGHT')}
          disabled={disabled}
          className="w-16 h-16 border-primary hover:bg-primary/20"
        >
          <ArrowRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};
