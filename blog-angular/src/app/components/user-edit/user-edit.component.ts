import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from "../../services/user.service";
import { global } from "../../services/global";
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {

	public page_title: string;
	public user: User;
	public identity;
	public token;
	public status;
  public url;
  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.gif, jpeg",
    maxSize: "50",
    uploadAPI:  {
      url:global.url+'user/upload',
      method:"POST",
      headers: {
       "Authorization" : this._userService.getToken()
      },
      params: {
        'page': '1'
      },
      responseType: 'blob',
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    fileNameIndex: false,
    replaceTexts: {
      selectFileBtn: 'Select Files',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'Drag N Drop',
      attachPinBtn: 'Attach Files...',
      afterUploadMsg_success: 'Successfully Uploaded !',
      afterUploadMsg_error: 'Upload Failed !',
      sizeLimit: 'Size Limit'
    }
  };
  constructor(
  	private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { 
  	this.page_title = 'Ajustes de usuario';
  	this.user = new User(1, '', '', 'ROLE_USER', '', '', '', '');
  	this.identity = this._userService.getIdentity();
  	this.token = this._userService.getToken();
    this.url = global.url;
  	this.user=this.identity;
  	this.user = new User(this.identity.sub,
  						 this.identity.name,
  	  					 this.identity.surname,
  	   					 this.identity.role,
  	    				 this.identity.email, '',
  	    				 this.identity.description,
  	     				 this.identity.image);
  }

  ngOnInit() {
  }

  onSubmit(form){
  	this._userService.update(this.token, this.user).subscribe(
  		response =>{

  			console.log(response);
  			if(response.status == 'success'){
  				this.status = "success";
  				if(response.changes.name){
  					this.identity.name = response.changes.name;
            console.log("RESPONSE "+response.changes.name);
            console.log("PRIMER IDENTITY "+this.identity.name);
  				}
  				if(response.changes.surname){
  					this.user.name = response.changes.surname;
  				}
  				if(response.changes.email){
  					this.user.name = response.changes.email;
  				}
  				if(response.changes.description){
  					this.user.name = response.changes.description;
  				}
  				if(response.changes.image){
  					this.user.name = response.changes.image;
  				}
          console.log("CHANGES", response);
  				this.identity = response.changes;
          this.identity.sub = this.user.id;
          console.log("SEGUNDO IDENTITY",this.identity);
  				localStorage.setItem('identity', JSON.stringify(this.identity));
          this._router.navigate(['inicio']);

  			}else{
  				this.status = "error";
  			}	
  		},
  		error =>{
  			this.status = "error";
  			console.log(<any>error);
  		}
  		
  	);
  }

   avatarUpload(datos){
     let data = JSON.parse(datos.response);
     this.user.image = data.image;
   }
}
