import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kings.html',
  styleUrls: ['./kings.css']
})
export class Kings implements OnChanges {
  @Input() size = 8;
  board: number[][] = Array.from({ length: this.size }, () => Array(this.size).fill(0));
  kingsPlaced = 0;
  highlightPath = false;

  get threatenedSquares(): boolean[][] {
    const threatened = Array.from({ length: this.size }, () => Array(this.size).fill(false));
    const moves = [
      [1, 0], [0, 1], [-1, 0], [0, -1],
      [1, 1], [-1, -1], [1, -1], [-1, 1]
    ];
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 1) {
          for (const [dr, dc] of moves) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size) {
              threatened[nr][nc] = true;
            }
          }
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
    // Winning counts: 4=4, 5=9, 6=9, 7=16, 8=16
    switch (this.size) {
      case 4: return 4;
      case 5: return 9;
      case 6: return 9;
      case 7: return 16;
      case 8: return 16;
      default: return this.size * 2;
    }
  }

  get isSolved(): boolean {
    return this.kingsPlaced === this.requiredPieces;
  }

  resetBoard(): void {
    this.board = Array.from({ length: this.size }, () => Array(this.size).fill(0));
    this.kingsPlaced = 0;
  }

  placeKing(row: number, col: number): void {
    if (this.board[row][col] === 1) {
      this.board[row][col] = 0;
      this.kingsPlaced--;
    } else if (this.canPlace(row, col)) {
      this.board[row][col] = 1;
      this.kingsPlaced++;
    }
  }

  canPlace(row: number, col: number): boolean {
    const moves = [
      [1, 0], [0, 1], [-1, 0], [0, -1],
      [1, 1], [-1, -1], [1, -1], [-1, 1]
    ];
    for (const [dr, dc] of moves) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < this.size && nc >= 0 && nc < this.size && this.board[nr][nc] === 1) {
        return false;
      }
    }
    return true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['size']) this.resetBoard();
  }
}
