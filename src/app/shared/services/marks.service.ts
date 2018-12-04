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
  
  getClassMarks(id: number, group: User[]) {    
    console.log(group);  
	var marks: Mark[] = [];
	this.getByID(id).subscribe((_marks : Mark[]) => {             
	  marks = _marks; 	  			
    });	 
    return marks;	
  }
    /*register(lesson: Lesson) {		
        return this.http.post(`http://localhost:3000/addLesson`, lesson);
    }*/

    /*update(user: User) {
        return this.http.put(`/users/` + user.id, user);
    }*/

    /*delete(id: number) {
        return this.http.delete('http://localhost:3000/deleteLesson/' + id);
    }*/
}