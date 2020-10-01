import { Component, OnInit } from '@angular/core';
import { AuthService } from "../servicio/auth.service";
@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  clientOn: boolean;
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.clientOn = true;
  }

}
