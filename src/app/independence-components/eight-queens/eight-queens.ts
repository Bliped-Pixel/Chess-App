import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-eight-queens',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eight-queens.html',
  styleUrls: ['./eight-queens.css']
})
export class EightQueens {
  board: number[][] = Array.from({ length: 8 }, () => Array(8).fill(0));
  queensPlaced = 0;

  navbarClosed = false;

  highlightPath = false;

  get threatenedSquares(): boolean[][] {
    const threatened = Array.from({ length: 8 }, () => Array(8).fill(false));
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col] === 1) {
          // Mark row and column
          for (let i = 0; i < 8; i++) {
            threatened[row][i] = true;
            threatened[i][col] = true;
          }
          // Mark diagonals
          for (let i = -7; i <= 7; i++) {
            if (row + i >= 0 && row + i < 8 && col + i >= 0 && col + i < 8) {
              threatened[row + i][col + i] = true;
            }
            if (row + i >= 0 && row + i < 8 && col - i >= 0 && col - i < 8) {
              threatened[row + i][col - i] = true;
            }
          }
        }
      }
    }
    // Don't highlight the queen's own square
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col] === 1) threatened[row][col] = false;
      }
    }
    return threatened;
  }

  get isSolved(): boolean {
    return this.queensPlaced === 8;
  }

  resetBoard(): void {
    this.board = Array.from({ length: 8 }, () => Array(8).fill(0));
    this.queensPlaced = 0;
  }

  placeQueen(row: number, col: number): void {
    if (this.board[row][col] === 1) {
      this.board[row][col] = 0;
      this.queensPlaced--;
    } else if (this.canPlace(row, col)) {
      this.board[row][col] = 1;
      this.queensPlaced++;
    }
  }

  canPlace(row: number, col: number): boolean {
    // Check column and row
    for (let i = 0; i < 8; i++) {
      if (this.board[row][i] === 1 || this.board[i][col] === 1) return false;
    }
    // Check diagonals
    for (let i = -7; i <= 7; i++) {
      if (
        row + i >= 0 && row + i < 8 && col + i >= 0 && col + i < 8 && this.board[row + i][col + i] === 1
      ) return false;
      if (
        row + i >= 0 && row + i < 8 && col - i >= 0 && col - i < 8 && this.board[row + i][col - i] === 1
      ) return false;
    }
    return true;
  }
}
