import { Component } from '@angular/core';
import { Client } from './client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DPS-Desafio1-MA171622-M6171623';
  clientOn: boolean = true;
}
