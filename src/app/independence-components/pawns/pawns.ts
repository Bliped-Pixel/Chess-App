import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pawns',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pawns.html',
  styleUrls: ['./pawns.css']
})
export class Pawns implements OnChanges {
  @Input() size = 8;
  board: number[][] = Array.from({ length: this.size }, () => Array(this.size).fill(0));
  pawnsPlaced = 0;
  highlightPath = false;

  get threatenedSquares(): boolean[][] {
    const threatened = Array.from({ length: this.size }, () => Array(this.size).fill(false));
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 1) {
          // Pawns threaten diagonally forward (assuming white pawns)
          if (row > 0 && col > 0) threatened[row - 1][col - 1] = true;
          if (row > 0 && col < this.size - 1) threatened[row - 1][col + 1] = true;
        }
      }
    }
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 1) threatened[row][col] = false;
      }
    }
    return threatened;
  }

  get requiredPieces(): number {
    // Winning counts: 4=8, 5=15, 6=18, 7=28, 8=32
    switch (this.size) {
      case 4: return 8;
      case 5: return 15;
      case 6: return 18;
      case 7: return 28;
      case 8: return 32;
      default: return Math.floor((this.size * this.size) / 2);
    }
  }

  get isSolved(): boolean {
    return this.pawnsPlaced === this.requiredPieces;
  }

  resetBoard(): void {
    this.board = Array.from({ length: this.size }, () => Array(this.size).fill(0));
    this.pawnsPlaced = 0;
  }

  placePawn(row: number, col: number): void {
    if (this.board[row][col] === 1) {
      this.board[row][col] = 0;
      this.pawnsPlaced--;
    } else if (this.canPlace(row, col)) {
      this.board[row][col] = 1;
      this.pawnsPlaced++;
    }
  }

  canPlace(row: number, col: number): boolean {
    // Pawns threaten diagonally forward (assuming white pawns)
    if (row > 0 && col > 0 && this.board[row - 1][col - 1] === 1) return false;
    if (row > 0 && col < this.size - 1 && this.board[row - 1][col + 1] === 1) return false;
    return true;
  }

  ngOnChanges(changes: SimpleChanges): void { if (changes['size']) this.resetBoard(); }
}
