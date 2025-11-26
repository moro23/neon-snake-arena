// Pure game logic functions for easy testing

export interface Position {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  isGameOver: boolean;
}

export const GRID_SIZE = 20;
export const CELL_SIZE = 20;

export const getOppositeDirection = (direction: Direction): Direction => {
  const opposites: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  };
  return opposites[direction];
};

export const isOppositeDirection = (current: Direction, newDir: Direction): boolean => {
  return getOppositeDirection(current) === newDir;
};

export const generateFood = (snake: Position[]): Position => {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
  return food;
};

export const getNextHeadPosition = (
  head: Position,
  direction: Direction,
  isPortalMode: boolean
): Position => {
  let newHead = { ...head };

  switch (direction) {
    case 'UP':
      newHead.y -= 1;
      break;
    case 'DOWN':
      newHead.y += 1;
      break;
    case 'LEFT':
      newHead.x -= 1;
      break;
    case 'RIGHT':
      newHead.x += 1;
      break;
  }

  if (isPortalMode) {
    // Wrap around
    if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
    if (newHead.x >= GRID_SIZE) newHead.x = 0;
    if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
    if (newHead.y >= GRID_SIZE) newHead.y = 0;
  }

  return newHead;
};

export const checkWallCollision = (position: Position): boolean => {
  return (
    position.x < 0 ||
    position.x >= GRID_SIZE ||
    position.y < 0 ||
    position.y >= GRID_SIZE
  );
};

export const checkSelfCollision = (head: Position, snake: Position[]): boolean => {
  return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
};

export const checkFoodCollision = (head: Position, food: Position): boolean => {
  return head.x === food.x && head.y === food.y;
};

export const moveSnake = (
  snake: Position[],
  direction: Direction,
  isPortalMode: boolean,
  food: Position
): { newSnake: Position[]; newFood: Position | null; scoreIncrease: number; gameOver: boolean } => {
  const head = snake[0];
  const newHead = getNextHeadPosition(head, direction, isPortalMode);

  // Check wall collision (only in classic mode)
  if (!isPortalMode && checkWallCollision(newHead)) {
    return { newSnake: snake, newFood: null, scoreIncrease: 0, gameOver: true };
  }

  // Check self collision
  if (checkSelfCollision(newHead, snake)) {
    return { newSnake: snake, newFood: null, scoreIncrease: 0, gameOver: true };
  }

  // Check food collision
  const ateFood = checkFoodCollision(newHead, food);
  
  let newSnake: Position[];
  let newFood: Position | null = null;
  let scoreIncrease = 0;

  if (ateFood) {
    // Grow snake
    newSnake = [newHead, ...snake];
    newFood = generateFood(newSnake);
    scoreIncrease = 10;
  } else {
    // Move snake
    newSnake = [newHead, ...snake.slice(0, -1)];
  }

  return { newSnake, newFood, scoreIncrease, gameOver: false };
};

// AI Bot logic for spectator mode
export const getAIDirection = (snake: Position[], food: Position, currentDirection: Direction): Direction => {
  const head = snake[0];
  const dx = food.x - head.x;
  const dy = food.y - head.y;

  // Priority: move toward food, avoiding immediate self-collision and opposite direction
  const possibleMoves: Direction[] = [];

  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal movement priority
    if (dx > 0) possibleMoves.push('RIGHT');
    if (dx < 0) possibleMoves.push('LEFT');
    if (dy > 0) possibleMoves.push('DOWN');
    if (dy < 0) possibleMoves.push('UP');
  } else {
    // Vertical movement priority
    if (dy > 0) possibleMoves.push('DOWN');
    if (dy < 0) possibleMoves.push('UP');
    if (dx > 0) possibleMoves.push('RIGHT');
    if (dx < 0) possibleMoves.push('LEFT');
  }

  // Filter out opposite direction and check for self-collision
  const validMoves = possibleMoves.filter(dir => {
    if (isOppositeDirection(currentDirection, dir)) return false;
    
    const nextHead = getNextHeadPosition(head, dir, true); // Assume portal mode for AI
    return !checkSelfCollision(nextHead, snake);
  });

  return validMoves.length > 0 ? validMoves[0] : currentDirection;
};
