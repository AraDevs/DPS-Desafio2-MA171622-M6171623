import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { FormsModule } from '@angular/forms';
import { NgxCurrencyModule } from "ngx-currency";

import Swal from 'sweetalert2';

@NgModule({
  declarations: [
    AppComponent,
    ClienteComponent,
    ConsultaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxCurrencyModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
