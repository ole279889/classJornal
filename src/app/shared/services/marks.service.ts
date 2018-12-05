import { Injectable } from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpEvent, HttpRequest, HttpXhrBackend} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';

import { Mark } from '../models';
import { User } from '../models';

@Injectable()
export class MarksService {
  classMarks: Mark[];			
  constructor(private http: HttpClient) { }

  getAll() {	
    return this.http.get('http://localhost:3000/listMarks', {responseType: 'json'});
  }

  getByID(id: number) {
    return this.http.get(`http://localhost:3000/marksByLessonID/` + id);
  }
    
  addMark(mark: Mark) {		
    return this.http.post(`http://localhost:3000/addMark`, mark);
  }

  update(mark: Mark) {
        return this.http.put(`http://localhost:3000/marks/` + mark.id, mark);
  }

  delete(id: number) {
    return this.http.delete('http://localhost:3000/deleteMark/' + id);
  }
}