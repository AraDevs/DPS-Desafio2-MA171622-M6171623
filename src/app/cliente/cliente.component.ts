import { Component, OnInit } from '@angular/core';
import { Client } from '../client';
import { AppComponent } from '../app.component';
import Swal from 'sweetalert2';
import { ClienteService } from '../servicio/cliente.service';
import { ConsultaService } from '../servicio/consulta.service';
import { NgForm } from '@angular/forms';
import { $ } from 'protractor';
import { Consult } from '../consult';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  name: string;
  dui: string;
  $key: string;
  visits: number;
  duiahora : string;
  myClients: Client[] = [];
  myConsults: Consult[] = []
  clie:Client;
  param:string = "";
  

  constructor(
    public ClientService: ClienteService,
    public ConsultaService: ConsultaService
  ) { }

  ngOnInit(): void {
    this.leer();
  }
  onEdit(cliente:Client){
     this.name = cliente.name;
     this.dui  = cliente.dui;
     this.$key = cliente.$key;
     this.visits = cliente.visits;
     this.duiahora = cliente.dui;
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

        //Eliminando consultas del cliente

        this.myConsults.forEach(cons => {
          if (cons.clientKey === $key) {
            this.ConsultaService.deleteConsulta(cons.$key);
          }
        });


        //Eliminando cliente
        this.ClientService.deleteCliente($key);

        this.reset();
        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'El cliente ha sido eliminado.',
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

  addClient() {
    this.clie = this.myClients.find(dui=>dui.dui===this.dui);
    if (this.$key == null) {
      if (this.clie == null) {
        this.ClientService.insertCliente(new Client(this.$key, this.name, this.dui, 0));
        Swal.fire("Cliente agregado.", "Operación exitosa", "success");
      } else {
        Swal.fire("El dui ingresado ya existe", "Error", "error");
      }
      
    } else {
      if (this.clie == null || this.dui == this.duiahora) {
        this.ClientService.updateCliente(new Client(this.$key, this.name, this.dui, this.visits));
        Swal.fire("Cliente actualizado.", "Operación exitosa", "success");
      }
      else{
        Swal.fire("El dui ingresado ya existe", "Error", "error");
      }
    }
    this.reset();
  }
  reset(){
    this.name = null;
    this.dui = null;
    this.$key = null;
  }
  getDiscount(visits: number) {
    if (visits < 2) {
      return "0%";
    }
    else if (visits < 5) {
      return "5%";
    }
    else {
      return "8%";
    }
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

  filter() {
    if(this.param != ""){
      this.ClientService.filterCliente(this.param).snapshotChanges().subscribe(items => {
        this.myClients.length = 0;
        items.forEach(element => {
          let x = element.payload.toJSON();
          x["$key"] = element.key;
          this.myClients.push(x as Client);
        });
      });
    }else{
      this.leer();
    }
  }
}
