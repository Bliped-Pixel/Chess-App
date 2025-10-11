import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EightQueens } from '../eight-queens/eight-queens';
import { Bishops } from '../bishops/bishops';
import { Knights } from '../knights/knights';
import { Rooks } from '../rooks/rooks';
import { Kings } from '../kings/kings';

@Component({
  selector: 'app-independents',
  standalone: true,
  imports: [CommonModule, FormsModule, EightQueens, Bishops, Knights, Rooks, Kings],
  templateUrl: './independents.html',
  styleUrls: ['./independents.css']
})
export class Independents {
  selected: 'queens' | 'bishops' | 'knights' | 'rooks' | 'kings' = 'queens';
}
