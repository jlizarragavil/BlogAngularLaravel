import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/user";
import { global } from "./global";
@Injectable()
export class UserService{
	public url: string;
	public identity;
	public token;

	constructor(
		public _http: HttpClient
	){
		this.url = global.url;
	}

	test(){
		return "Hola mundo Servicio";
	}

	register(user): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'aplication/x-www-form-urlencoded');
		return this._http.post(this.url+'register', user, {headers: headers});
		//return this._http.post('http://api-rest-laravel.com.devel/api/register', 'json=%7B%22id%22%3A1%2C%22name%22%3A%22qwer%22%2C%22surname%22%3A%22qwe%22%2C%22role%22%3A%22ROLE_USER%22%2C%22email%22%3A%22qqwer222%40asd.com%22%2C%22password%22%3A%22qqq%22%2C%22description%22%3A%22%22%2C%22image%22%3A%22%22%7D', {headers: headers});
	}

	signup(user, gettoken = null): Observable<any>{
		if(gettoken!=null){
			user.gettoken = 'true';
		}
		let headers = new HttpHeaders().set('Content-Type', 'aplication/x-www-form-urlencoded');
		return this._http.post('http://api-rest-laravel.com.devel/api/login', user, {headers: headers});

	}

	update(token, user): Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'aplication/x-www-form-urlencoded')
									   .set('Authorization', token);
		return this._http.put('http://api-rest-laravel.com.devel/api/user/update', user, {headers: headers});							   
	}

	getIdentity(){
		let identity = JSON.parse(localStorage.getItem('identity'));
		if(identity && identity != "undefined"){
			this.identity = identity;
		}else{
			this.identity = null;
		}

		return this.identity;
	}

	getToken(){
		let token = localStorage.getItem('token');

		if(token && token != 'undefined'){
			this.token = token;
		}else{
			this.token = null;
		}

		return this.token;
	}

	getPosts(id):Observable<any>{
		let headers = new Headers().set('Content-Type', 'aplication/x-www-form-urlencoded');
		return this._http.get(this.url+'post/user/' + id);
	}

	getUser(id):Observable<any>{
		let headers = new Headers().set('Content-Type', 'aplication/x-www-form-urlencoded');
		return this._http.get(this.url+'user/detail/' + id);
	}
}