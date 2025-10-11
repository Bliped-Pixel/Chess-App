import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bishops',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bishops.html',
  styleUrls: ['./bishops.css']
})
export class Bishops {
  board: number[][] = Array.from({ length: 8 }, () => Array(8).fill(0));
  bishopsPlaced = 0;
  highlightPath = false;

  get threatenedSquares(): boolean[][] {
    const threatened = Array.from({ length: 8 }, () => Array(8).fill(false));
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col] === 1) {
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
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col] === 1) threatened[row][col] = false;
      }
    }
    return threatened;
  }

  get isSolved(): boolean {
    return this.bishopsPlaced === 14;
  }

  resetBoard(): void {
    this.board = Array.from({ length: 8 }, () => Array(8).fill(0));
    this.bishopsPlaced = 0;
  }

  placeBishop(row: number, col: number): void {
    if (this.board[row][col] === 1) {
      this.board[row][col] = 0;
      this.bishopsPlaced--;
    } else if (this.canPlace(row, col)) {
      this.board[row][col] = 1;
      this.bishopsPlaced++;
    }
  }

  canPlace(row: number, col: number): boolean {
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
