import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dominance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dominance.html',
  styleUrls: ['./dominance.css']
})
export class Dominance {
  // Game of Dominance - Minimum pieces to dominate entire board
  // Goal: Use the minimum number of pieces to dominate all squares
  
  size = 8;
  board: string[][] = [];
  selectedPiece: string = 'queen';
  highlightDominated = true;
  availableSizes = [4, 5, 6, 7, 8];
  
  availablePieces = [
    { type: 'queen', symbol: '♕' },
    { type: 'rook', symbol: '♖' },
    { type: 'bishop', symbol: '♗' },
    { type: 'knight', symbol: '♘' },
    { type: 'king', symbol: '♔' },
    { type: 'pawn', symbol: '♙' }
  ];
  
  pieceCounts: Record<string, number> = {
    queen: 0,
    rook: 0,
    bishop: 0,
    knight: 0,
    king: 0,
    pawn: 0
  };
  
  // Required pieces for optimal solution: [4x4, 5x5, 6x6, 7x7, 8x8]
  private requiredPiecesData: Record<string, number[]> = {
    rook: [4, 5, 6, 7, 8],
    bishop: [4, 5, 6, 7, 8],
    knight: [4, 5, 8, 10, 12],
    queen: [2, 3, 3, 4, 5],
    king: [4, 4, 4, 9, 9],
    pawn: [8, 12, 18, 25, 28]
  };
  
  constructor() {
    this.initializeBoard();
  }
  
  initializeBoard(): void {
    this.board = Array.from({ length: this.size }, () => Array(this.size).fill(''));
    this.resetCounts();
  }
  
  resetCounts(): void {
    this.pieceCounts = {
      queen: 0,
      rook: 0,
      bishop: 0,
      knight: 0,
      king: 0,
      pawn: 0
    };
  }
  
  changeSize(newSize: number): void {
    this.size = newSize;
    this.initializeBoard();
  }
  
  getRequiredPieces(type: string): number {
    const sizeIndex = this.availableSizes.indexOf(this.size);
    return this.requiredPiecesData[type]?.[sizeIndex] || 0;
  }
  
  getTotalPieces(): number {
    return Object.values(this.pieceCounts).reduce((sum, count) => sum + count, 0);
  }
  
  selectPiece(type: string): void {
    if (this.selectedPiece !== type) {
      this.selectedPiece = type;
      this.resetBoard(type);
    }
  }
  
  canPlacePiece(row: number, col: number): boolean {
    // Can't place if square already has a piece
    if (this.board[row][col]) return false;
    
    // Can't place if square is dominated by another piece
    const squareKey = `${row},${col}`;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] && (r !== row || c !== col)) {
          const attacks = this.getAttackedSquares(r, c, this.board[r][c]);
          if (attacks.includes(squareKey)) {
            return false; // Square is dominated
          }
        }
      }
    }
    
    return true;
  }
  
  placeOrRemovePiece(row: number, col: number): void {
    if (this.board[row][col]) {
      // Remove piece
      const pieceType = this.board[row][col];
      this.board[row][col] = '';
      this.pieceCounts[pieceType]--;
    } else if (this.selectedPiece && this.canPlacePiece(row, col)) {
      // Place piece only if square is not dominated
      this.board[row][col] = this.selectedPiece;
      this.pieceCounts[this.selectedPiece]++;
    }
  }
  
  resetBoard(selectedType: string = this.selectedPiece): void {
    this.initializeBoard();
    this.selectedPiece = selectedType;
  }
  
  getPieceSymbol(type: string): string {
    return this.availablePieces.find(p => p.type === type)?.symbol || '';
  }
  
  get dominatedSquares(): Set<string> {
    const dominated = new Set<string>();
    
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const piece = this.board[row][col];
        if (piece) {
          // Square with piece is dominated
          dominated.add(`${row},${col}`);
          
          // Add attacked squares
          const attacks = this.getAttackedSquares(row, col, piece);
          attacks.forEach(key => dominated.add(key));
        }
      }
    }
    
    return dominated;
  }
  
  isDominated(row: number, col: number): boolean {
    return this.dominatedSquares.has(`${row},${col}`);
  }
  
  get dominationCount(): number {
    return this.dominatedSquares.size;
  }
  
  get dominationPercentage(): number {
    const totalSquares = this.size * this.size;
    return Math.round((this.dominationCount / totalSquares) * 100);
  }
  
  get hasWon(): boolean {
    return this.dominationPercentage === 100;
  }
  
  get isOptimal(): boolean {
    if (!this.hasWon) return false;
    
    // Check if using only one piece type and if it matches the required count
    const nonZeroCounts = Object.entries(this.pieceCounts).filter(([_, count]) => count > 0);
    if (nonZeroCounts.length !== 1) return false;
    
    const [pieceType, count] = nonZeroCounts[0];
    return count === this.getRequiredPieces(pieceType);
  }
  
  getRookAttacks(row: number, col: number): string[] {
    const attacks: string[] = [];
    
    // Right
    for (let c = col + 1; c < this.size; c++) {
      attacks.push(`${row},${c}`);
      if (this.board[row][c]) break; // Blocked by piece
    }
    
    // Left
    for (let c = col - 1; c >= 0; c--) {
      attacks.push(`${row},${c}`);
      if (this.board[row][c]) break;
    }
    
    // Down
    for (let r = row + 1; r < this.size; r++) {
      attacks.push(`${r},${col}`);
      if (this.board[r][col]) break;
    }
    
    // Up
    for (let r = row - 1; r >= 0; r--) {
      attacks.push(`${r},${col}`);
      if (this.board[r][col]) break;
    }
    
    return attacks;
  }
  
  getBishopAttacks(row: number, col: number): string[] {
    const attacks: string[] = [];
    
    // Down-right diagonal
    for (let i = 1; row + i < this.size && col + i < this.size; i++) {
      attacks.push(`${row + i},${col + i}`);
      if (this.board[row + i][col + i]) break;
    }
    
    // Down-left diagonal
    for (let i = 1; row + i < this.size && col - i >= 0; i++) {
      attacks.push(`${row + i},${col - i}`);
      if (this.board[row + i][col - i]) break;
    }
    
    // Up-right diagonal
    for (let i = 1; row - i >= 0 && col + i < this.size; i++) {
      attacks.push(`${row - i},${col + i}`);
      if (this.board[row - i][col + i]) break;
    }
    
    // Up-left diagonal
    for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
      attacks.push(`${row - i},${col - i}`);
      if (this.board[row - i][col - i]) break;
    }
    
    return attacks;
  }
  
  getKnightAttacks(row: number, col: number): string[] {
    const attacks: string[] = [];
    const moves = [
      [2, 1], [1, 2], [-1, 2], [-2, 1],
      [-2, -1], [-1, -2], [1, -2], [2, -1]
    ];
    
    for (const [dr, dc] of moves) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size) {
        attacks.push(`${nr},${nc}`);
      }
    }
    
    return attacks;
  }
  
  getKingAttacks(row: number, col: number): string[] {
    const attacks: string[] = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    
    for (const [dr, dc] of directions) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size) {
        attacks.push(`${nr},${nc}`);
      }
    }
    
    return attacks;
  }
  
  getPawnAttacks(row: number, col: number): string[] {
    const attacks: string[] = [];
    // Pawns attack diagonally forward (assuming white pawns moving up)
    if (row > 0) {
      if (col > 0) attacks.push(`${row - 1},${col - 1}`);
      if (col < this.size - 1) attacks.push(`${row - 1},${col + 1}`);
    }
    return attacks;
  }
  
  getAttackedSquares(row: number, col: number, piece: string): string[] {
    switch (piece) {
      case 'queen':
        return [...this.getRookAttacks(row, col), ...this.getBishopAttacks(row, col)];
      case 'rook':
        return this.getRookAttacks(row, col);
      case 'bishop':
        return this.getBishopAttacks(row, col);
      case 'knight':
        return this.getKnightAttacks(row, col);
      case 'king':
        return this.getKingAttacks(row, col);
      case 'pawn':
        return this.getPawnAttacks(row, col);
      default:
        return [];
    }
  }
}

