import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post';
import { User } from '../../models/user';
import { PostService } from '../../services/post.services';
import { global } from "../../services/global";
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [PostService, UserService]
})
export class ProfileComponent implements OnInit {

	public url;
	public posts: Array<Post>;
  public identity;
  public token;
  public user: User;
  constructor(
  	private _postService: PostService,
    private _userService: UserService,
    private _route: ActivatedRoute,
	private _router: Router
  ) {
  this.url = global.url;
  this.identity = _userService.getIdentity();
  this.token = _userService.getToken();
  }

  ngOnInit(): void {
  	  	this._route.params.subscribe(
  		params =>{
  			let userId = +params['id'];
        console.log("USER ID: "+ userId);
  			this.getUser(userId);
  			this.getPosts(userId);
  		});
  	
  }

  getUser(userId){
    console.log("USUARIO:" + userId);
  	this._userService.getUser(userId).subscribe(
  		response =>{

        console.log("UResponse:",response);
  			if(response.status = "success"){
  				this.user = response.user;
  				console.log("USER: ",this.user);
  			}
  		},
  		error =>{
  			console.log(error);
  		}
  	);
  }

  getPosts(userId){
  	this._userService.getPosts(userId).subscribe(
  		response =>{
  			if(response.status = "success"){
  				this.posts = response.posts;
  				console.log("POSTS: ",this.posts);
  			}
  		},
  		error =>{
  			console.log(error);
  		}
  	);
  }

  deletePost(id){
    this._postService.delete(this.token, id).subscribe(
      response =>{
        this._route.params.subscribe(
  		params =>{
  			let userId = +params['id'];
  			this.getPosts(userId);
  		});
      },
      error =>{
        console.log(error);
      }
    );
  }
}
