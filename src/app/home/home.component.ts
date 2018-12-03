import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../shared/models';
import { Lesson } from '../shared/models';
import { UserService, ScheduleService } from '../shared/services';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  styleUrls: ['home.component.css'],
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {
  currentUser: User;
  users: User[] = [];
  schedule: Lesson[] = []

  displayedColumns: string[] = ['date', 'subject', 'group', 'teacher', 'marks', 'drop'];
    
  constructor(private userService: UserService, private scheduleService: ScheduleService, private router: Router, private route: ActivatedRoute) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadSchedule();
  }

  deleteLesson(id: number) {
    /*this.scheduleService.delete(id).pipe(first()).subscribe(() => { 
        this.loadSchedule() 
    });*/
  }
  
  gotoMarks(id: number) {
	this.router.navigate(['/marks/' + id]);  
    /*this.scheduleService.delete(id).pipe(first()).subscribe(() => { 
        this.loadSchedule() 
    });*/
  }
  
  isAdmin() {
	return this.userService.isAdmin();
  }
  
  isMyLesson(id: number) {
	return this.scheduleService.isMyLesson(id);
  }
  
  private getFIO(id: number) {		
    return this.userService.getFIO(id);
  }
  
  private loadSchedule() {		
    this.scheduleService.getAll().pipe(first()).subscribe((_schedule : Lesson[]) => {             
	  this.schedule = _schedule; 
    });
  }
}