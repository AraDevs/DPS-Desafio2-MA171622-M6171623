import { Component, OnInit } from '@angular/core';
import { Client } from '../client';
import { AppComponent } from '../app.component';
import { clients } from '../globals';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  name: string;
  dui: string;
  myClients = clients;
  

  constructor() { }

  ngOnInit(): void {
  }

  addClient() {
    clients.push(new Client(this.name, this.dui, 0));
    this.name = "";
    this.dui = "";
    Swal.fire("Cliente agregado.", "Operación exitosa", "success");
  }

  getDiscount(visits: number) {
    if (visits < 2) {
      return "0%";
    }
    else if (visits <= 4) {
      return "5%";
    }
    else {
      return "10%";
    }
  }
}
