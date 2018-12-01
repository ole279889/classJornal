import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpEvent, HttpRequest, HttpXhrBackend} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { User } from '../models';
const LOCAL_STORAGE_KEY = 'users';

@Injectable()
export class UserService {
	
  user: User;
		
  constructor(private http: HttpClient) { }

  getAll() {	
	return this.http.get('http://localhost:3000/listUsers', {responseType: 'json'});
  }

  getById(id: number) {
    return this.http.get(`http://localhost:3000/` + id);
  }
    
  getFIO(id: number) {	
    this.user = this.getLocal().find((user,i) => user.id === id);	
	if (typeof(this.user) != "undefined") {
	  return this.user.firstName + " " + this.user.lastName;
	} else {
	  return "user not found";
	}
  }
	
  register(user: User) {		
    return this.http.post(`http://localhost:3000/addUser`, user);
  }

  /*update(user: User) {
    return this.http.put(`/users/` + user.id, user);
  }*/

  delete(id: number) {
    return this.http.delete('http://localhost:3000/deleteUser/' + id);
  }
	
  saveLocal(users : User[]) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));	
  }
	
  getLocal() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];	
  }
}