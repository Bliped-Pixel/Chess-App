# Chess Constants

This file contains centralized constants and utilities for chess pieces used throughout the application.

## Usage

### Import
```typescript
import { 
  PieceType, 
  CHESS_PIECES, 
  ALL_PIECE_TYPES,
  getPieceSymbol,
  getPieceName,
  fileLabel,
  rankLabel
} from '../shared/chess.constants';
```

### Piece Types
All piece types are lowercase and consistently named:
- `'queen'`, `'rook'`, `'bishop'`, `'knight'`, `'king'`, `'pawn'`

### Constants

#### `CHESS_PIECES`
Record containing piece information:
```typescript
CHESS_PIECES.queen  // { type: 'queen', symbol: '♕', name: 'Queen' }
CHESS_PIECES.rook   // { type: 'rook', symbol: '♖', name: 'Rook' }
// etc.
```

#### `ALL_PIECE_TYPES`
Array of all piece types for iteration: `['queen', 'rook', 'bishop', 'knight', 'king', 'pawn']`

#### `DOMINANCE_OPTIMAL_COUNTS`
Optimal piece counts for Dominance game per board size [4x4, 5x5, 6x6, 7x7, 8x8]

#### `INDEPENDENCE_PIECE_COUNTS`
Required piece counts for Independence puzzles (8x8 board)

### Helper Functions

#### `getPieceSymbol(type: PieceType): string`
Returns the Unicode symbol for a piece type.

#### `getPieceName(type: PieceType): string`
Returns the capitalized name (e.g., 'Queen', 'Rook').

#### `getPiecePluralName(type: PieceType): string`
Returns the plural form (e.g., 'Queens', 'Rooks').

#### `fileLabel(index: number): string`
Converts column index to chess file notation (0 → 'A', 1 → 'B', etc.).

#### `rankLabel(boardSize: number, row: number): number`
Converts row index to chess rank notation (row 0 → rank 8 for 8x8 board).

## Benefits

- ✅ Consistent naming across all components
- ✅ Single source of truth for piece symbols
- ✅ Type-safe piece type definitions
- ✅ Centralized game configuration (optimal counts, requirements)
- ✅ Easy to maintain and update
