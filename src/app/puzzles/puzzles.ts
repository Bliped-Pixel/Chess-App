import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-puzzles',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './puzzles.html',
  styleUrls: ['./puzzles.css']
})
export class Puzzles {}
