
export type CellType = 'question' | 'hero' | 'bonus' | 'safe' | 'start' | 'finish';

export interface Cell {
  id: number;
  type: CellType;
  title: string;
  description: string;
  options?: string[];
  correctAnswer?: number;
  heroImage?: string;
}


export interface GameState {
  playerPosition: number;
  isGameOver: boolean;
  history: string[];
  currentEvent: Cell | null;
  isRolling: boolean;
  diceValue: number;
  goldenCards: number;
  isAnswering: boolean;
  isSecondQuestion: boolean;
}
