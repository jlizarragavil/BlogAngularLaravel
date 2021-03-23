import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Post } from "../models/post";
import { global } from "./global";
@Injectable()
export class PostService{
	public url: string;
	constructor(
		private _http: HttpClient
	){
		this.url = global.url;
	}

	test(){
		return "Hola desde servicio Post";
	}

	create(token, post):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'aplication/x-www-form-urlencoded')
									   .set('Authorization', token);

		return this._http.post(this.url+'post', post, {headers:headers});
	}

	getPosts():Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'aplication/x-www-form-urlencoded');
		return this._http.get(this.url + 'post', {headers:headers});
	}

	getPost(id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'aplication/x-www-form-urlencoded');
		return this._http.get(this.url + 'post/' + id, {headers:headers});
	}

	update(token, post, id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'aplication/x-www-form-urlencoded')
									   .set('Authorization', token);

		return this._http.put(this.url+'post/' + id, post, {headers:headers});
	}

	delete(token, id){
		let headers = new HttpHeaders().set('Content-Type', 'aplication/x-www-form-urlencoded')
									   .set('Authorization', token);
		return this._http.delete(this.url+'post/' + id, {headers:headers});
	}
}	