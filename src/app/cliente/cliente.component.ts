import { Component, OnInit } from '@angular/core';
import { Client } from '../client';
import { AppComponent } from '../app.component';
import { clients } from '../globals';
import Swal from 'sweetalert2';
import { ClienteService } from '../servicio/cliente.service';
import { NgForm } from '@angular/forms';
import { $ } from 'protractor';

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
  myClients = clients;
  clie:Client;
  

  constructor(
    public ClientService: ClienteService,
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
      title: 'Estas seguro de eliminar?',
      text: "Una vez eliminado no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.ClientService.deleteCliente($key);
        swalWithBootstrapButtons.fire(
          'Eliminado!',
          'Eliminado el cliente.',
          'success'
        )
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Cliente mantenido',
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
        Swal.fire("Cliente actulizado.", "Operación exitosa", "success");
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
    else if (visits <= 4) {
      return "5%";
    }
    else {
      return "10%";
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
    return this.myClients;
  }
}
