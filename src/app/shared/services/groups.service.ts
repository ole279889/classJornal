import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpEvent, HttpRequest, HttpXhrBackend} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable()
export class GroupsService {
			
  constructor(private http: HttpClient) { }

  getAll() {	
    return this.http.get('http://localhost:3000/groups', {responseType: 'json'});
  }
}