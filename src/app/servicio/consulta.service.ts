import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';

import {Consult} from '../consult';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  
  ConsultaLista: AngularFireList<any>;

  constructor(private firebase: AngularFireDatabase) { }

  getConsulta() {
    return this.ConsultaLista = this.firebase.list('Consulta');
  }

  insertConsulta(Cons: Consult) {
    this.ConsultaLista.push({
      id: Cons.id,
      clientKey: Cons.clientKey,
      pet: Cons.pet,
      treatment: Cons.treatment,
      medicine: Cons.medicine,
      price: Cons.price,
      discount: Cons.discount,
      total: Cons.total
    });
  }

  updateConsulta(Cons: Consult) {
    this.ConsultaLista.update(Cons.$key, {
      id: Cons.id,
      clientKey: Cons.clientKey,
      pet: Cons.pet,
      treatment: Cons.treatment,
      medicine: Cons.medicine,
      price: Cons.price,
      discount: Cons.discount,
      total: Cons.total
    });
  }

  deleteConsulta($key: string) {
    this.ConsultaLista.remove($key);
  }
}
