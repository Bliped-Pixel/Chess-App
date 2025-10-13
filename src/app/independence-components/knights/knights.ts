import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-knights',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './knights.html',
  styleUrls: ['./knights.css']
})
export class Knights {
  board: number[][] = Array.from({ length: 8 }, () => Array(8).fill(0));
  knightsPlaced = 0;
  highlightPath = false;

  get threatenedSquares(): boolean[][] {
    const threatened = Array.from({ length: 8 }, () => Array(8).fill(false));
    const moves = [
      [2, 1], [1, 2], [-1, 2], [-2, 1],
      [-2, -1], [-1, -2], [1, -2], [2, -1]
    ];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col] === 1) {
          for (const [dr, dc] of moves) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
              threatened[nr][nc] = true;
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
    return this.knightsPlaced === 32;
  }

  resetBoard(): void {
    this.board = Array.from({ length: 8 }, () => Array(8).fill(0));
    this.knightsPlaced = 0;
  }

  placeKnight(row: number, col: number): void {
    if (this.board[row][col] === 1) {
      this.board[row][col] = 0;
      this.knightsPlaced--;
    } else if (this.canPlace(row, col)) {
      this.board[row][col] = 1;
      this.knightsPlaced++;
    }
  }

  canPlace(row: number, col: number): boolean {
    const moves = [
      [2, 1], [1, 2], [-1, 2], [-2, 1],
      [-2, -1], [-1, -2], [1, -2], [2, -1]
    ];
    for (const [dr, dc] of moves) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && this.board[nr][nc] === 1) {
        return false;
      }
    }
    return true;
  }
}
