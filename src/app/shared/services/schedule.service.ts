import { Injectable } from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {HttpClient, HttpEvent, HttpRequest, HttpXhrBackend} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';

import { Lesson } from '../models';

@Injectable()
export class ScheduleService {
			
  constructor(private http: HttpClient) { }

  getAll() {	
    return this.http.get('http://localhost:3000/schedule', {responseType: 'json'});
  }

  getByID(id: number) {
    return this.http.get(`http://localhost:3000/lesson/` + id);
  }

  addLesson(lesson: Lesson) {		
        return this.http.post(`http://localhost:3000/addLesson`, lesson);
  }

  update(lesson: Lesson) {
        return this.http.put(`http://localhost:3000/schedule/` + lesson.id, lesson);
  }

  delete(id: number) {
    return this.http.delete('http://localhost:3000/deleteLesson/' + id);
  }
  
  isMyLesson(id: number) {
	var user = JSON.parse(localStorage.getItem('currentUser'));  
	if (user.role === "admin") {
		return true;
	}  
	if (user.id === id) {
		return true;
	}
	return false;
  }
}