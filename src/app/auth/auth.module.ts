import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatDialogModule
} from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthService } from '../service/auth.service';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  declarations: [
    LoginComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [
    AuthService
  ],
  entryComponents: [AlertComponent]
})
export class AuthModule { }
