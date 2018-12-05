import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../shared/models';
import { Lesson } from '../shared/models';
import { Mark } from '../shared/models';
import {ActivatedRoute, Router} from '@angular/router';

import { UserService, ScheduleService, MarksService } from '../shared/services';

@Component({
  styleUrls: ['marks.component.css'],
  templateUrl: 'marks.component.html'
})
export class MarksComponent implements OnInit {
  currentUser: User;
  lessonInfo: Lesson = new Lesson;
  students: User[] = [];
  marks: Mark[];
  displayedColumns: string[];
   
  //displayedColumns: string[] = ['student', 'mark', 'edit', 'drop'];
    
  constructor(private userService: UserService, private scheduleService: ScheduleService, private marksService: MarksService, private router: Router, private route: ActivatedRoute) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
	this.getLessonInfo(); 
    this.loadMarks();	
	if (this.userService.isStudent() === true) {
      this.displayedColumns = ['student', 'mark'];
    } else {
	  this.displayedColumns = ['student', 'mark', 'edit', 'drop'];
    }
  }
  
  private loadMarks() {		
    this.marksService.getByID(Number(this.route.snapshot.params.id)).pipe(first()).subscribe((_marks : Mark[]) => {             
	  this.marks = _marks; 	  			
    });
  }
  
  private getLessonInfo() {    
	this.scheduleService.getByID(Number(this.route.snapshot.params.id)).pipe(first()).subscribe((_lesson : Lesson) => {             
	  this.lessonInfo = _lesson;   	
      this.students = this.userService.usersByGroup(this.lessonInfo.group);  	  
    });	
  }
  
  deleteMark(id: number) {
    this.marksService.delete(id).pipe(first()).subscribe((_marks : Mark[]) => { 
      this.loadMarks();	  
    });
  }
  
  private getFIO(id: number) {		
    return this.userService.getFIO(id);
  }
  
  isAdmin() {
	return this.userService.isAdmin();
  }
  
  markIns() {
	this.loadMarks();
  }
    
}