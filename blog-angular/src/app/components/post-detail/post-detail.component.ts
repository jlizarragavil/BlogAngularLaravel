import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.services';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers: [PostService, UserService]
})
export class PostDetailComponent implements OnInit {

	public post: Post;
  public page_title: string;
  public identity;

  constructor(private _postService: PostService,private _route: ActivatedRoute,
		private _router: Router, private _userService: UserService) { 
    this.page_title = 'Regístrate';
    this.post = new Post(1,1,1,'','','','');
    this.identity = this._userService.getIdentity();
  }

  ngOnInit(): void {

  	this.getPost();
  }

  getPost(){
  	this._route.params.subscribe(
  		params =>{
  			let id = +params['id'];
  			
  			this._postService.getPost(id).subscribe(
  				response =>{
  					console.log("STATUSsss: "+ response.status);
            console.log("RESPONSE: " + JSON.stringify(response.post));
            console.log("RESPONSE: " + response.post);
  					if(response.status=="success"){
  						console.log("Entra IF" + response.post);
  						this.post = response.post;
  					}else{
  						console.log("POSTELSE: " + this.post);
  						this._router.navigate(['inicio']);
  					}
  				},
  				error=>{
  					console.log(error);
  				}
  			);

  		}
  	);
   }
}


