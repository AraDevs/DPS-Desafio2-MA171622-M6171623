import { Component, OnInit } from '@angular/core';
import { Client } from '../client';
import { Consult } from '../consult';
import { clients, consults } from '../globals';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {

  client: Client;
  pet: string;
  treatment: string;
  medicine: string;
  price: number;
  
  myClients = clients;
  myConsults = consults;

  constructor() { }

  ngOnInit(): void {
  }

  addCons() {

    var discount: number;
    var total: number;
    
    //Updateing the visit count
    this.client.visits++;

    //Calculating discounts
    if (this.client.visits < 2) {
      discount = 0;
    }
    else if (this.client.visits <= 4) {
      discount = 5;
    }
    else {
      discount = 10;
    }

    total = this.price * (1 - (discount / 100))

    consults.push(new Consult(this.client, this.pet, this.treatment, this.medicine, this.price, discount, total));
    
    var outTitle = 'Consulta agregada exitosamente.';

    var outHtml = 
    '<div class="row"><div class="col-6">Número de consulta:</div><div class="col-6">#' + consults.length + '</div></div>' +
    '<div class="row"><div class="col-6">Cliente:</div><div class="col-6">' + this.client.name + '</div></div>' +
    '<div class="row"><div class="col-6">DUI:</div><div class="col-6">' + this.client.dui + '</div></div>' +
    '<div class="row"><div class="col-6">Nombre de mascota:</div><div class="col-6">' + this.pet + '</div></div>' +
    '<div class="row"><div class="col-6">Tratamiento:</div><div class="col-6">' + this.treatment + '</div></div>' +
    '<div class="row"><div class="col-6">Medicamento:</div><div class="col-6">' + this.medicine + '</div></div>' +
    '<div class="row"><div class="col-6">Costo de consulta:</div><div class="col-6">$' + this.price.toFixed(2) +  '</div></div>' +
    '<div class="row"><div class="col-6">Descuento:</div><div class="col-6">$' + (this.price * discount / 100).toFixed(2) + '</div></div>' +
    '<div class="row"><div class="col-6">Total a pagar:</div><div class="col-6">$' + total.toFixed(2) + '</div></div>';

    this.client = null;
    this.pet = "";
    this.treatment = "";
    this.medicine = "";
    this.price = 0;


    Swal.fire({
      title: outTitle,
      html: outHtml,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
  }

}
