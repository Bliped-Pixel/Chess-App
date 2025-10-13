import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EightQueens } from '../independence-components/eight-queens/eight-queens';
import { Bishops } from '../independence-components/bishops/bishops';
import { Knights } from '../independence-components/knights/knights';
import { Rooks } from '../independence-components/rooks/rooks';
import { Kings } from '../independence-components/kings/kings';
import { Pawns } from '../independence-components/pawns/pawns';

@Component({
  selector: 'app-independents',
  standalone: true,
  imports: [CommonModule, FormsModule, EightQueens, Bishops, Knights, Rooks, Kings, Pawns],
  templateUrl: './independents.html',
  styleUrls: ['./independents.css']
})
export class Independents {
  selected: 'queens' | 'bishops' | 'knights' | 'rooks' | 'kings' | 'pawns' = 'queens';
}
