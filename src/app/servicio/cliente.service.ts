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

  addVisit(Clien:Client) {
    this.ClienteLista.update(Clien.$key, {
      visits: Clien.visits + 1
    });
  }

  removeVisit(Clien:Client) {
    this.ClienteLista.update(Clien.$key, {
      visits: Clien.visits - 1
    });
  }

  deleteCliente($key:string){
    this.ClienteLista.remove($key);
  }

  filterCliente(param: string){
    return this.ClienteLista = this.firebase.list('Cliente', ref => ref.orderByChild("name").startAt(param).endAt(param+"\uf8ff"));
  }
}



