import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../../shared/models';
import { UserService } from '../../shared/services';

@Component({
  styleUrls: ['users.component.css'],
  templateUrl: 'users.component.html'
})
export class UsersComponent implements OnInit {
  currentUser: User;
  users: User[] = [];

  displayedColumns: string[] = ['login', 'name', 'about', 'edit', 'drop'];
  
  constructor(private userService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadAllUsers();
  }

  deleteUser(id: number) {
    this.userService.delete(id).pipe(first()).subscribe((_users : User[]) => { 
      this.users = _users; 
	  this.userService.refreshUsers();
    });
  }

  private loadAllUsers() {		
    this.userService.getAll().pipe(first()).subscribe((_users : User[]) => {             
	    this.users = _users; 
	    this.userService.saveLocal(_users);       		
    });    	  
  }
  
  userUpd() {
	this.loadAllUsers();
  }
}