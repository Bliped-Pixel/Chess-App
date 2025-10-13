import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rooks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rooks.html',
  styleUrls: ['./rooks.css']
})
export class Rooks {
  board: number[][] = Array.from({ length: 8 }, () => Array(8).fill(0));
  rooksPlaced = 0;
  highlightPath = false;

  get threatenedSquares(): boolean[][] {
    const threatened = Array.from({ length: 8 }, () => Array(8).fill(false));
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col] === 1) {
          for (let i = 0; i < 8; i++) {
            threatened[row][i] = true;
            threatened[i][col] = true;
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
    return this.rooksPlaced === 8;
  }

  resetBoard(): void {
    this.board = Array.from({ length: 8 }, () => Array(8).fill(0));
    this.rooksPlaced = 0;
  }

  placeRook(row: number, col: number): void {
    if (this.board[row][col] === 1) {
      this.board[row][col] = 0;
      this.rooksPlaced--;
    } else if (this.canPlace(row, col)) {
      this.board[row][col] = 1;
      this.rooksPlaced++;
    }
  }

  canPlace(row: number, col: number): boolean {
    for (let i = 0; i < 8; i++) {
      if (this.board[row][i] === 1 || this.board[i][col] === 1) return false;
    }
    return true;
  }
}
