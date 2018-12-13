import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const base: string = '/teknoerp/add-ins/';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(
		private http: HttpClient,
	) { }
	
	static authenticate(username: string, password: string, callback: Function): any {
    	let data = JSON.stringify({
			"username": username,
			"password": password
		});

		let xhr = new XMLHttpRequest();
		xhr.withCredentials = true;

		xhr.addEventListener("readystatechange", function () {
			if (this.readyState === 4) {
				if(this.status !== 200) {
					callback(false, this.responseText);
				} else {
					localStorage.setItem("user", this.responseText);
					//--set expiration
					let expiredAt = new Date();
					expiredAt.setMinutes(expiredAt.getMinutes() + 120);
					localStorage.setItem("expiredAt", expiredAt.toString());
					callback(true, "success");
				}
			}
		});

		xhr.open("POST", base + "authenticate");
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader("Cache-Control", "no-cache");

		xhr.send(data);
  }
}
