import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user';
import { UserService } from "../../services/user.service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

	public page_title: string
	public user: User;
	public status: string;
	public token;
	public identity;
  constructor(
  		private _userService:  UserService,
  		private _router: Router,
  		private _route: ActivatedRoute
  	) { 
  	this.page_title = 'Identifícate';
  	this.user = new User(1, '', '', 'ROLE_USER', '', '', '', '');
  }

  ngOnInit(): void {
  	this.logout();
  }

  onSubmit(form){
  	this._userService.signup(this.user).subscribe(
  		response =>{
  			//token
  			if(response.status!="error"){
  				this.status = "success";
  				this.token = response;

  				//OBJETO USUARIO IDENTIFICADO

			this._userService.signup(this.user, true).subscribe(
			  		response =>{
						this.identity = response;
						console.log("ESTE ES EL TOKEN");
						console.log(this.token);
						console.log("ESTE ES EL OBJETO DEL USUARIO");						
						console.log(this.identity);

						//PERSISTIR DATOS USUARIO IDENTIFICADO Y TOKEN
						localStorage.setItem('token', this.token);
						localStorage.setItem('identity', JSON.stringify(this.identity));

						this._router.navigate(['inicio']);
			  		},
			  		error => {
			  			this.status = "error";
			  			console.log(<any>error)
			  		}
			  	);



  			}else{
  				this.status = "error";
  			}
  		},
  		error => {
  			this.status = "error";
  			console.log(<any>error)
  		}
  	);
  }

  logout(){
  	this._route.params.subscribe(params =>{
  		let logout = +params['sure'];

  		if(logout == 1){
  			localStorage.removeItem('identity');
  			localStorage.removeItem('token');

  			this.identity = null;
  			this.token = null;

  			//REDIRECCION A INICIO
  			this._router.navigate(['inicio']);
  		}
  	});
  }
}
