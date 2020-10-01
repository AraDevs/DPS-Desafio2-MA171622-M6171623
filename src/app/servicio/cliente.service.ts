import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';

import {Client} from '../client'
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  ClienteLista: AngularFireList<any>;
  constructor(private firebase:AngularFireDatabase) { }

  getCliente(){
    return this.ClienteLista = this.firebase.list('Cliente');
  }

  insertCliente(Clien:Client){
    this.ClienteLista.push({
      name: Clien.name,
      dui: Clien.dui,
      visits: Clien.visits
    });
  }

  updateCliente(Clien:Client){
    this.ClienteLista.update(Clien.$key, {
      name: Clien.name,
      dui: Clien.dui,
      visits: Clien.visits
    });
  }

  deleteCliente($key:string){
    this.ClienteLista.remove($key);
  }
}


