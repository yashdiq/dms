import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(private router:Router) { }

  title = 'DMS';

  ngOnInit(): void {
    this.checkIsSignedIn();
  }

  checkIsSignedIn(): any {
    const user = localStorage.getItem("user");
    const _expiredAt = localStorage.getItem("expiredAt");
    const expiredAt = new Date(_expiredAt);
    const now = new Date();
    
    if (user) {
      if (now <= expiredAt) {
        this.router.navigateByUrl('/home-repository');
      } else {
        this.router.navigateByUrl('/login');
      }
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
