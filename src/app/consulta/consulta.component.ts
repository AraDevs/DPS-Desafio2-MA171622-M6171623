import { Component, OnInit } from '@angular/core';
import { Client } from '../client';
import { Consult } from '../consult';
import { clients, consults } from '../globals';
import { ConsultaService } from '../servicio/consulta.service';
import { ClienteService } from '../servicio/cliente.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css']
})
export class ConsultaComponent implements OnInit {

  $key: string;
  id: number;
  client: Client;
  pet: string;
  treatment: string;
  medicine: string;
  price: number;
  discount: number;
  total: number;

  //Esta variable se usará al actualizar una consulta,
  //para verificar si el cliente a sido cambiado, caso
  //en el cual deberá removerse una visita al cliente
  //original y agregársela al nuevo cliente
  initialClient: Client;
  
  myClients: Client[] = [];
  myConsults: Consult[] = [];

  constructor(public ClientService: ClienteService, public ConsultaService: ConsultaService) { }

  ngOnInit(): void {
    this.leer();
  }

  addCons() {

    var outTitle: string;

    if (this.$key == null) {
      //AGREGAR

      //Generando id
      if (this.myConsults.length == 0) {
        this.id = 1;
      }
      else {
        this.id = this.myConsults[this.myConsults.length - 1].id + 1;
      }
      
      //Agregando visita al cliente
      this.ClientService.addVisit(this.client);

      //Haciendo cálculos
      this.calcDiscount();
      this.calcTotal();

      this.ConsultaService.insertConsulta(new Consult(this.$key, this.id, this.client.$key, this.pet, this.treatment, this.medicine, this.price, this.discount, this.total));
      outTitle = 'Consulta agregada exitosamente.';
    }
    else {
      //ACTUALIZAR

      if (this.client != this.initialClient) {
        //Transfiriendo visita si se cambió de cliente
        this.ClientService.removeVisit(this.initialClient);
        this.ClientService.addVisit(this.client);
        //Recalculando descuento
        this.calcDiscount();
      }
      //Recalculando total
      this.calcTotal();
      this.ConsultaService.updateConsulta(new Consult(this.$key, this.id, this.client.$key, this.pet, this.treatment, this.medicine, this.price, this.discount, this.total));
      outTitle = 'Consulta actualizada exitosamente.';
    }

    var outHtml = 
    '<div class="row"><div class="col-6">Número de consulta:</div><div class="col-6">#' + this.id + '</div></div>' +
    '<div class="row"><div class="col-6">Cliente:</div><div class="col-6">' + this.client.name + '</div></div>' +
    '<div class="row"><div class="col-6">DUI:</div><div class="col-6">' + this.client.dui + '</div></div>' +
    '<div class="row"><div class="col-6">Nombre de mascota:</div><div class="col-6">' + this.pet + '</div></div>' +
    '<div class="row"><div class="col-6">Tratamiento:</div><div class="col-6">' + this.treatment + '</div></div>' +
    '<div class="row"><div class="col-6">Medicamento:</div><div class="col-6">' + this.medicine + '</div></div>' +
    '<div class="row"><div class="col-6">Costo de consulta:</div><div class="col-6">$' + this.price.toFixed(2) +  '</div></div>' +
    '<div class="row"><div class="col-6">Descuento:</div><div class="col-6">$' + (this.price * this.discount / 100).toFixed(2) + '</div></div>' +
    '<div class="row"><div class="col-6">Total a pagar:</div><div class="col-6">$' + this.total.toFixed(2) + '</div></div>';

    this.reset();


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

  onEdit(consulta: Consult){
    this.$key = consulta.$key;
    this.id = consulta.id;
    this.client = this.getClient(consulta.clientKey);
    this.initialClient = this.getClient(consulta.clientKey);
    this.pet = consulta.pet;
    this.treatment = consulta.treatment;
    this.medicine = consulta.medicine;
    this.price = consulta.price;
    this.discount = consulta.discount;
    this.total = consulta.total
 }


  calcDiscount() {
    if (this.client.visits < 2) {
      this.discount = 0;
    }
    else if (this.client.visits < 5) {
      this.discount = 5;
    }
    else {
      this.discount = 8;
    }
  }

  calcTotal() {
    this.total = this.price * (1 - (this.discount / 100))
  }

  getClient(key: string) {
    return this.myClients.find(c=>c.$key===key);
  }

  reset() {
    this.$key = null;
    this.id = null;
    this.client = null;
    this.pet = "";
    this.treatment = "";
    this.medicine = "";
    this.price = 0;
    this.discount = 0;
    this.total = 0;

    this.initialClient = null;
  }

  onDelete($key:string){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success buto',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro de eliminar?',
      text: "Una vez eliminado no se podrá recuperar este registro",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        //Removiendo visita del cliente
        var cons = this.myConsults.find(c=>c.$key===$key);
        var client = this.getClient(cons.clientKey)
        this.ClientService.removeVisit(client);

        //Eliminando consulta
        this.ConsultaService.deleteConsulta($key);

        this.reset();
        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'La consulta ha sido eliminada.',
          'success'
        )
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Operación abortada',
          'error'
        )
      }
    })
  }

  leer(){
    this.ClientService.getCliente().snapshotChanges().subscribe(items=>{
      this.myClients.length = 0;
      items.forEach(element =>{
        let x = element.payload.toJSON();
        x["$key"] = element.key;
        this.myClients.push(x as Client);
      });
    });
    this.ConsultaService.getConsulta().snapshotChanges().subscribe(items=>{
      this.myConsults.length = 0;
      items.forEach(element =>{
        let x = element.payload.toJSON();
        x["$key"] = element.key;
        this.myConsults.push(x as Consult);
      });
    });
  }

}
