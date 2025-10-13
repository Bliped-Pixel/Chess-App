import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pawns',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pawns.html',
  styleUrls: ['./pawns.css']
})
export class Pawns {
  board: number[][] = Array.from({ length: 8 }, () => Array(8).fill(0));
  pawnsPlaced = 0;
  highlightPath = false;

  get threatenedSquares(): boolean[][] {
    const threatened = Array.from({ length: 8 }, () => Array(8).fill(false));
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col] === 1) {
          // Pawns threaten diagonally forward (assuming white pawns)
          if (row > 0 && col > 0) threatened[row - 1][col - 1] = true;
          if (row > 0 && col < 7) threatened[row - 1][col + 1] = true;
        }
      }
    }
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col] === 1) threatened[row][col] = false;
      }
    }
    return threatened;
  }

  get isSolved(): boolean {
    return this.pawnsPlaced === 32;
  }

  resetBoard(): void {
    this.board = Array.from({ length: 8 }, () => Array(8).fill(0));
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
    if (row > 0 && col < 7 && this.board[row - 1][col + 1] === 1) return false;
    return true;
  }
}
