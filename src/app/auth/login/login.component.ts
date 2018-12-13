import { Component, OnInit } from '@angular/core';
import {
  FormControl
} from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { AlertComponent } from '../alert/alert.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username = new FormControl('');
  password = new FormControl('');
  disabled: boolean = false;

  // alert message
  title: string = "Error";
  message: string = "Something went wrong! Please, try again.";

  constructor(
    private router:Router,
    public dialog: MatDialog) { }

  ngOnInit() {

  }

  goLogin () {
    // this.disabled = true;
    const username = this.username.value;
    const password = this.password.value;
    AuthService.authenticate(username, password, (ok, response) => {
      if(ok) {
        this.router.navigateByUrl('/home-repository');
      } else {
        response = JSON.parse(response);
        this.errorAlert(response);
      }
    });
  }

  errorAlert(response: string): void {
    const dialogRef = this.dialog.open(AlertComponent, {
      width: '250px',
      data: {
        title: this.title,
        message: response
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    })
  }
}