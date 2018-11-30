import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../shared/models';
import { Lesson } from '../shared/models';
import { UserService, ScheduleService } from '../shared/services';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent implements OnInit {
  currentUser: User;
  users: User[] = [];
  schedule: Lesson[] = []

  constructor(private userService: UserService, private scheduleService: ScheduleService) {
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
  
  private getFIO(id: number) {		
    return id;//this.userService.getFIO(id);
  }
  
  private loadSchedule() {		
    this.scheduleService.getAll().pipe(first()).subscribe((_schedule : Lesson[]) => {             
	  this.schedule = _schedule; 
    });
  }
}