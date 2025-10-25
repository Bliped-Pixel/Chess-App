import { Component } from '@angular/core';
import { CommonModule, NgForOf, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type Piece = 'pawn' | 'bishop' | 'knight' | 'rook' | 'queen' | 'king' | '';
export type BoardCell = { piece: Piece; valid: boolean };

@Component({
  selector: 'app-all-pieces',
  standalone: true,
  imports: [CommonModule, NgForOf, NgFor, NgIf, FormsModule],
  templateUrl: './all-pieces.html',
  styleUrls: ['./all-pieces.css']
})
export class AllPieces {
  board: BoardCell[][] = Array.from({ length: 8 }, () => 
    Array(8).fill(null).map(() => ({ piece: '', valid: true }))
  );

  // typed list for template iteration (avoids string index errors in template type-checking)
  readonly pieces: Piece[] = ['pawn', 'bishop', 'knight', 'rook', 'queen', 'king'];

  requiredCounts: Record<Piece, number> = {
    pawn: 8,
    bishop: 2,
    knight: 2,
    rook: 2,
    queen: 1,
    king: 1,
    '': 0
  };

  placedCounts: Record<Piece, number> = {
    pawn: 0,
    bishop: 0,
    knight: 0,
    rook: 0,
    queen: 0,
    king: 0,
    '': 0
  };

  validCounts: Record<Piece, number> = {
    pawn: 0,
    bishop: 0,
    knight: 0,
    rook: 0,
    queen: 0,
    king: 0,
    '': 0
  };

  selected: Piece = 'pawn';
  highlightPath = true;

  pieceSymbols: Record<Piece, string> = {
    pawn: '\u2659',
    bishop: '\u2657',
    knight: '\u2658',
    rook: '\u2656',
    queen: '\u2655',
    king: '\u2654',
    '': ''
  };

  // Template-safe accessors to avoid indexing with 'any' in templates
  getPlaced(p: Piece): number {
    return this.placedCounts[p] ?? 0;
  }

  getValid(p: Piece): number {
    return this.validCounts[p] ?? 0;
  }

  getRequired(p: Piece): number {
    return this.requiredCounts[p] ?? 0;
  }

  getSymbol(p: Piece | ''): string {
    return this.pieceSymbols[p] ?? '';
  }

  // Return squares threatened by the current board
  get threatenedSquares(): boolean[][] {
    const threatened = Array.from({ length: 8 }, () => Array(8).fill(false));
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this.board[r][c].piece;
        if (!p) continue;
        const attacks = this.attacksFrom(p, r, c);
        for (const [ar, ac] of attacks) {
          if (ar >= 0 && ar < 8 && ac >= 0 && ac < 8) threatened[ar][ac] = true;
        }
      }
    }
    // Do not mark squares occupied by pieces as threatened (visual choice)
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) if (this.board[r][c].piece) threatened[r][c] = false;
    }
    return threatened;
  }

  attacksFrom(piece: Piece, row: number, col: number): Array<[number, number]> {
    const out: Array<[number, number]> = [];
    if (piece === 'pawn') {
      // white pawns: attack upwards (row - 1)
      if (row - 1 >= 0 && col - 1 >= 0) out.push([row - 1, col - 1]);
      if (row - 1 >= 0 && col + 1 < 8) out.push([row - 1, col + 1]);
      return out;
    }
    if (piece === 'knight') {
      const moves = [
        [2, 1], [1, 2], [-1, 2], [-2, 1],
        [-2, -1], [-1, -2], [1, -2], [2, -1]
      ];
      for (const [dr, dc] of moves) out.push([row + dr, col + dc]);
      return out;
    }
    if (piece === 'king') {
      const moves = [
        [1, 0], [0, 1], [-1, 0], [0, -1],
        [1, 1], [-1, -1], [1, -1], [-1, 1]
      ];
      for (const [dr, dc] of moves) out.push([row + dr, col + dc]);
      return out;
    }
    // Sliding pieces: rook, bishop, queen
    const directions: Array<[number, number]> = [];
    if (piece === 'rook' || piece === 'queen') {
      directions.push([1, 0], [-1, 0], [0, 1], [0, -1]);
    }
    if (piece === 'bishop' || piece === 'queen') {
      directions.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
    }
    for (const [dr, dc] of directions) {
      let nr = row + dr;
      let nc = col + dc;
      while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        out.push([nr, nc]);
        if (this.board[nr][nc].piece) break; // blocked by any piece
        nr += dr; nc += dc;
      }
    }
    return out;
  }

  canPlace(row: number, col: number, piece: Piece): boolean {
    if (this.board[row][col].piece) return false; // occupied
    // If square is threatened by existing pieces -> cannot place
    const threatened = this.threatenedSquares;
    if (threatened[row][col]) return false;
    // If placing this piece would attack any existing piece -> cannot place
    const attacks = this.attacksFrom(piece, row, col);
    for (const [ar, ac] of attacks) {
      if (ar >= 0 && ar < 8 && ac >= 0 && ac < 8) {
        if (this.board[ar][ac].piece) return false;
      }
    }
    return true;
  }

  placeOrRemove(row: number, col: number): void {
    const existing = this.board[row][col].piece;
    if (existing) {
      this.board[row][col] = { piece: '', valid: true };
      this.placedCounts[existing]--;
      this.recalculateValidPieces();
      return;
    }
    // Allow placement anywhere
    this.board[row][col] = { piece: this.selected, valid: this.canPlace(row, col, this.selected) };
    this.placedCounts[this.selected]++;
    this.recalculateValidPieces();
  }

  recalculateValidPieces(): void {
    // Reset valid counts
    for (const k of Object.keys(this.validCounts) as Piece[]) {
      this.validCounts[k] = 0;
    }
    
    // Recalculate validity for all pieces
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = this.board[r][c];
        if (cell.piece) {
          const isValid = this.isPieceValid(r, c);
          cell.valid = isValid;
          if (isValid) {
            this.validCounts[cell.piece]++;
          }
        }
      }
    }
  }

  isPieceValid(row: number, col: number): boolean {
    const cell = this.board[row][col];
    const currentPiece = cell.piece;
    if (!currentPiece) return true;
    
    // Temporarily remove piece
    this.board[row][col] = { piece: '', valid: true };
    
    const valid = this.canPlace(row, col, currentPiece);
    
    // Restore piece
    this.board[row][col] = { piece: currentPiece, valid: cell.valid };
    
    return valid;
  }

  resetBoard(): void {
    this.board = Array.from({ length: 8 }, () => 
      Array(8).fill(null).map(() => ({ piece: '', valid: true }))
    );
    for (const k of Object.keys(this.placedCounts) as Piece[]) {
      this.placedCounts[k] = 0;
      this.validCounts[k] = 0;
    }
  }

  get isSolved(): boolean {
    for (const p of ['pawn','bishop','knight','rook','queen','king'] as Piece[]) {
      if (this.placedCounts[p] !== this.requiredCounts[p]) return false;
      if (this.validCounts[p] !== this.requiredCounts[p]) return false;
    }
    return true;
  }

  // All-pieces uses fixed 8×8 board (size selector removed)
}
