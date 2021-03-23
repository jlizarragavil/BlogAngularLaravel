import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Category } from "../models/category";
import { global } from "./global";
@Injectable()
export class CategoryService{
	public url: string;
	constructor(
		private _http: HttpClient
	){
		this.url = global.url;
	}

	create(token, category):Observable <any>{
		let headers = new HttpHeaders().set('Content-Type', 'aplication/x-www-form-urlencoded')
									   .set('Authorization', token);

		return this._http.post(this.url+'category', category, {headers:headers});
	}

	getCategories():Observable<any>{
		let headers = new Headers().set('Content-Type', 'aplication/x-www-form-urlencoded');
		return this._http.get(this.url+'category');
	}
	getCategory(id):Observable<any>{
				let headers = new Headers().set('Content-Type', 'aplication/x-www-form-urlencoded');
		return this._http.get(this.url+'category/' + id);
	}

	getPosts(id):Observable<any>{
		let headers = new Headers().set('Content-Type', 'aplication/x-www-form-urlencoded');
		return this._http.get(this.url+'post/category/' + id);
	}
}	