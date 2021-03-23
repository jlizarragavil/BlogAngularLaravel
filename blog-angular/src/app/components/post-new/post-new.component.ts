import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.services';
import { CategoryService } from '../../services/category.service';
import { global } from "../../services/global";
@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css'],
  providers: [UserService, CategoryService, PostService]
})
export class PostNewComponent implements OnInit {
	public page_title:string;
	public identity;
	public token;
	public post: Post;
	public categories;
  public status;
  public is_edit: boolean;
	public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.gif, jpeg",
    maxSize: "50",
    uploadAPI:  {
      url:global.url+'post/upload',
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
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService:UserService,
		private _categoryService:CategoryService,
		private _postService:PostService
	) { 
		this.page_title = "Crear entrada";
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
    this.is_edit= false;
	}

	ngOnInit(): void {
		this.getCategories();
		this.post = new Post(1,this.identity.sub, 1, '','',null,null);
		console.log(this.post);
	}

	getCategories(){
		this._categoryService.getCategories().subscribe(
			response =>{
				console.log("STATUS: " + response.status);
				if(response.status == "success"){
					this.categories=response.categories;
					console.log("CATEGORIES:" + response.categories);

				}
			},
			error =>{
				console.log(error);
			}
		);
	}
	imageUpload(data){
     let image_data = JSON.parse(data.response);
     this.post.image = image_data.image;
   }

   onSubmit(form){
   	this._postService.create(this.token, this.post).subscribe(

       response =>{
         console.log("STATUS: " + response.status);
         console.log("RESPONSE: " + response);
         if(response.status = "success"){
           this.post = response.post;
           this.status = "success";
           this._router.navigate(['inicio']);
         }else{
            this.status  = "error";

         }
       },
       error =>{
         console.log(error);
         this.status  = "error";
       }
    );
   }

}
