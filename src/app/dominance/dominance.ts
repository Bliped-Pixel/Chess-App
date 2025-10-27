import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  PieceType, 
  PieceInfo, 
  CHESS_PIECES, 
  ALL_PIECE_TYPES, 
  getPieceSymbol,
  fileLabel,
  rankLabel,
  DOMINANCE_OPTIMAL_COUNTS
} from '../shared/chess.constants';

type Team = 'white' | 'black';
interface TeamPiece { type: PieceType; team: Team }

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
  
  // Mode: single-piece type or team dominance
  mode: 'single' | 'team' = 'single';

  size = 8;
  board: (PieceType | '')[][] = [];
  selectedPiece: PieceType = 'queen';
  highlightDominated = true;
  availableSizes = [4, 5, 6, 7, 8];
  
  availablePieces: PieceInfo[] = ALL_PIECE_TYPES.map(type => CHESS_PIECES[type]);

  fileLabel(index: number): string { return fileLabel(index); }
  rankLabel(row: number): number { return rankLabel(this.size, row); }
  
  getPieceCount(type: PieceType): number {
    return this.pieceCounts[type];
  }
  
  pieceCounts: Record<PieceType, number> = {
    queen: 0,
    rook: 0,
    bishop: 0,
    knight: 0,
    king: 0,
    pawn: 0
  };
  
  // Team mode state
  teamBoard: (TeamPiece | null)[][] = [];
  selectedTeam: Team = 'white';
  teamCounts: Record<Team, Record<PieceType, number>> = {
    white: { queen: 0, rook: 0, bishop: 0, knight: 0, king: 0, pawn: 0 },
    black: { queen: 0, rook: 0, bishop: 0, knight: 0, king: 0, pawn: 0 }
  };
  
  // Exact number of pieces required for each board size from constants
  private requiredPiecesData = DOMINANCE_OPTIMAL_COUNTS;
  
  constructor() {
    this.initializeBoard();
    this.initializeTeamBoard();
  }
  
  initializeBoard(): void {
    this.board = Array.from({ length: this.size }, () => Array(this.size).fill(''));
    this.resetCounts();
  }
  
  initializeTeamBoard(): void {
    this.teamBoard = Array.from({ length: this.size }, () => Array(this.size).fill(null));
    this.resetTeamCounts();
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
  
  resetTeamCounts(): void {
    this.teamCounts = {
      white: { queen: 0, rook: 0, bishop: 0, knight: 0, king: 0, pawn: 0 },
      black: { queen: 0, rook: 0, bishop: 0, knight: 0, king: 0, pawn: 0 }
    };
  }
  
  changeSize(newSize: number): void {
    this.size = newSize;
    this.initializeBoard();
    this.initializeTeamBoard();
  }
  
  getRequiredPieces(type: PieceType): number {
    const sizeIndex = this.availableSizes.indexOf(this.size);
    return this.requiredPiecesData[type]?.[sizeIndex] || 0;
  }
  
  getTotalPieces(): number {
    return Object.values(this.pieceCounts).reduce((sum, count) => sum + count, 0);
  }
  
  selectPiece(type: PieceType): void {
    if (this.selectedPiece !== type) {
      this.selectedPiece = type;
      this.resetBoard(type);
    }
  }
  
  setMode(newMode: 'single' | 'team'): void {
    this.mode = newMode;
  }
  
  selectTeam(team: Team): void {
    this.selectedTeam = team;
  }
  
  canPlacePiece(row: number, col: number): boolean {
    // Can place if square is empty (no limit enforced)
    return !this.board[row][col];
  }
  
  placeOrRemovePiece(row: number, col: number): void {
    if (this.board[row][col]) {
      // Remove piece
      const pieceType = this.board[row][col];
      this.board[row][col] = '';
      this.pieceCounts[pieceType]--;
    } else if (this.selectedPiece && this.canPlacePiece(row, col)) {
      // Place piece (no limit check)
      this.board[row][col] = this.selectedPiece;
      this.pieceCounts[this.selectedPiece]++;
    }
  }
  
  resetBoard(selectedType: PieceType = this.selectedPiece): void {
    this.initializeBoard();
    this.selectedPiece = selectedType;
  }
  
  // Team mode actions
  canPlaceTeamPiece(row: number, col: number): boolean {
    return !this.teamBoard[row][col];
  }
  
  placeOrRemoveTeamPiece(row: number, col: number): void {
    const cell = this.teamBoard[row][col];
    if (cell) {
      this.teamCounts[cell.team][cell.type]--;
      this.teamBoard[row][col] = null;
    } else if (this.selectedPiece && this.canPlaceTeamPiece(row, col)) {
      const piece: TeamPiece = { type: this.selectedPiece, team: this.selectedTeam };
      this.teamBoard[row][col] = piece;
      this.teamCounts[piece.team][piece.type]++;
      // Auto-alternate team for next placement
      this.selectedTeam = this.selectedTeam === 'white' ? 'black' : 'white';
    }
  }
  
  resetTeamBoard(): void {
    this.initializeTeamBoard();
  }
  
  getPieceSymbol(type: PieceType | ''): string {
    if (!type) return '';
    return getPieceSymbol(type);
  }
  
  getTeamClass(team: Team): string {
    return team === 'white' ? 'team-white' : 'team-black';
  }
  
  getTeamPieceCount(type: PieceType): number {
    return this.teamCounts[this.selectedTeam][type];
  }
  
  get dominatedSquares(): Set<string> {
    const dominated = new Set<string>();
    if (this.mode === 'single') {
      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          const piece = this.board[row][col];
          if (piece) {
            dominated.add(`${row},${col}`);
            const attacks = this.getAttackedSquares(row, col, piece);
            attacks.forEach(key => dominated.add(key));
          }
        }
      }
    } else {
      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          const cell = this.teamBoard[row][col];
          if (cell) {
            dominated.add(`${row},${col}`);
            const attacks = this.getAttacksTeam(row, col, cell.type);
            attacks.forEach(key => dominated.add(key));
          }
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
    
    // Check if the selected piece type has the correct number of pieces placed
    return this.pieceCounts[this.selectedPiece] === this.getRequiredPieces(this.selectedPiece);
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
  
  // Team mode rook attacks (uses teamBoard for blocking)
  private getRookAttacksTeam(row: number, col: number): string[] {
    const attacks: string[] = [];
    for (let c = col + 1; c < this.size; c++) { attacks.push(`${row},${c}`); if (this.teamBoard[row][c]) break; }
    for (let c = col - 1; c >= 0; c--) { attacks.push(`${row},${c}`); if (this.teamBoard[row][c]) break; }
    for (let r = row + 1; r < this.size; r++) { attacks.push(`${r},${col}`); if (this.teamBoard[r][col]) break; }
    for (let r = row - 1; r >= 0; r--) { attacks.push(`${r},${col}`); if (this.teamBoard[r][col]) break; }
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
  
  private getBishopAttacksTeam(row: number, col: number): string[] {
    const attacks: string[] = [];
    for (let i = 1; row + i < this.size && col + i < this.size; i++) { attacks.push(`${row + i},${col + i}`); if (this.teamBoard[row + i][col + i]) break; }
    for (let i = 1; row + i < this.size && col - i >= 0; i++) { attacks.push(`${row + i},${col - i}`); if (this.teamBoard[row + i][col - i]) break; }
    for (let i = 1; row - i >= 0 && col + i < this.size; i++) { attacks.push(`${row - i},${col + i}`); if (this.teamBoard[row - i][col + i]) break; }
    for (let i = 1; row - i >= 0 && col - i >= 0; i++) { attacks.push(`${row - i},${col - i}`); if (this.teamBoard[row - i][col - i]) break; }
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
  
  private getKnightAttacksTeam(row: number, col: number): string[] {
    const attacks: string[] = [];
    const moves = [[2,1],[1,2],[-1,2],[-2,1],[-2,-1],[-1,-2],[1,-2],[2,-1]];
    for (const [dr, dc] of moves) {
      const nr = row + dr; const nc = col + dc;
      if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size) attacks.push(`${nr},${nc}`);
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
  
  private getKingAttacksTeam(row: number, col: number): string[] {
    const attacks: string[] = [];
    const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    for (const [dr, dc] of directions) {
      const nr = row + dr; const nc = col + dc;
      if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size) attacks.push(`${nr},${nc}`);
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
  
  private getPawnAttacksTeam(row: number, col: number): string[] {
    const attacks: string[] = [];
    if (row > 0) {
      if (col > 0) attacks.push(`${row - 1},${col - 1}`);
      if (col < this.size - 1) attacks.push(`${row - 1},${col + 1}`);
    }
    return attacks;
  }
  
  getAttackedSquares(row: number, col: number, piece: PieceType): string[] {
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
  
  private getAttacksTeam(row: number, col: number, piece: PieceType): string[] {
    switch (piece) {
      case 'queen': return [...this.getRookAttacksTeam(row, col), ...this.getBishopAttacksTeam(row, col)];
      case 'rook': return this.getRookAttacksTeam(row, col);
      case 'bishop': return this.getBishopAttacksTeam(row, col);
      case 'knight': return this.getKnightAttacksTeam(row, col);
      case 'king': return this.getKingAttacksTeam(row, col);
      case 'pawn': return this.getPawnAttacksTeam(row, col);
      default: return [];
    }
  }
}

