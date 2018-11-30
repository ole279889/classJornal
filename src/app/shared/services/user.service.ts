import { Injectable } from '@angular/core';
//import { HttpClient } from '@angular/common/http';

import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpEvent, HttpRequest, HttpXhrBackend} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';

import { User } from '../models';

@Injectable()
export class UserService {
			
    constructor(private http: HttpClient) { }

    getAll() {	
		return this.http.get('http://localhost:3000/listUsers', {responseType: 'json'});;
    }

    getById(id: number) {
        return this.http.get(`http://localhost:3000/` + id);
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
}