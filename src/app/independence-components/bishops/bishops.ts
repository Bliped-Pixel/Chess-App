import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bishops',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bishops.html',
  styleUrls: ['./bishops.css']
})
export class Bishops implements OnChanges {
  @Input() size = 8;
  board: number[][] = Array.from({ length: this.size }, () => Array(this.size).fill(0));
  bishopsPlaced = 0;
  highlightPath = false;

  get threatenedSquares(): boolean[][] {
    const threatened = Array.from({ length: this.size }, () => Array(this.size).fill(false));
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 1) {
          for (let i = -(this.size-1); i <= (this.size-1); i++) {
            if (row + i >= 0 && row + i < this.size && col + i >= 0 && col + i < this.size) {
              threatened[row + i][col + i] = true;
            }
            if (row + i >= 0 && row + i < this.size && col - i >= 0 && col - i < this.size) {
              threatened[row + i][col - i] = true;
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
    return this.size * 2 - 2;
  }

  get isSolved(): boolean {
    return this.bishopsPlaced === this.requiredPieces;
  }

  resetBoard(): void {
    this.board = Array.from({ length: this.size }, () => Array(this.size).fill(0));
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
    for (let i = -(this.size-1); i <= (this.size-1); i++) {
      if (
        row + i >= 0 && row + i < this.size && col + i >= 0 && col + i < this.size && this.board[row + i][col + i] === 1
      ) return false;
      if (
        row + i >= 0 && row + i < this.size && col - i >= 0 && col - i < this.size && this.board[row + i][col - i] === 1
      ) return false;
    }
    return true;
  }

  ngOnChanges(changes: SimpleChanges): void { if (changes['size']) this.resetBoard(); }
}
