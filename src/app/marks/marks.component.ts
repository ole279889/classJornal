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
  marks: Mark[];
 
  displayedColumns: string[] = ['student', 'mark', 'drop'];
    
  constructor(private userService: UserService, private scheduleService: ScheduleService, private marksService: MarksService, private router: Router, private route: ActivatedRoute) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.loadMarks();
	//this.marks = this.marksService.getByID(Number(this.route.snapshot.params.id));
  }
  
  private loadMarks() {		
    this.marksService.getByID(Number(this.route.snapshot.params.id)).pipe(first()).subscribe((_marks : Mark[]) => {             
	  this.marks = _marks; 	  			
    });
  }
  
  private getLessonInfo(id: number) {    
	return 1;
  }
  
  private getFIO(id: number) {		
    return this.userService.getFIO(id);
  }
  
  isAdmin() {
	return this.userService.isAdmin();
  }
    
}