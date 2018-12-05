import { Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Lesson, Subject, User, Group } from '../../shared/models';
import { UserService, ScheduleService, AlertService, GroupsService, SubjectsService } from '../../shared/services';

@Component({
  selector: 'home-add',
  templateUrl: './home-add.component.html'
})
export class HomeAddComponent {
  addLessonForm: FormGroup;
  loading = false;
  submitted = false;    
  @Output() lessIns: EventEmitter<boolean> = new EventEmitter();  
  modalReference: any;  
  groups: Group[] = [];
  teachers: User[] = [];
  subjects: Subject[] = [];

  constructor(
    private formBuilder: FormBuilder, 
	private modalService: NgbModal, 
	private userService: UserService, 
	private scheduleService: ScheduleService,
	private alertService: AlertService,
	private groupsService: GroupsService,
	private subjectsService: SubjectsService
  ) {}
  
  ngOnInit() {
	this.groupsService.getAll().pipe(first()).subscribe((_groups : Group[]) => {             
	  this.groups = _groups; 			
    });  
	this.subjectsService.getAll().pipe(first()).subscribe((_subjects : Subject[]) => {             
	  this.subjects = _subjects; 			
    }); 
	this.teachers = this.userService.getTeachers();	  		
    this.addLessonForm = this.formBuilder.group({
      date: ['', Validators.required],
      subject: ['', Validators.required],
	  group: ['', Validators.required],
	  teacherId: ['', Validators.required],
    });
  }
   
  open(content) {
    this.modalReference = this.modalService.open(content, { centered: true })
  }
     
  get f() { return this.addLessonForm.controls; }

  onSubmit() {
    
    if (this.addLessonForm.invalid) {		
      return;
    }
	
    this.loading = true;		
	
	var _lesson = {       
      id: null,
      date: this.addLessonForm.value.date,
      subject: this.addLessonForm.value.subject,
      group: this.addLessonForm.value.group,  
      teacherId: this.addLessonForm.value.teacherId,
    }
	
    this.scheduleService.addLesson(_lesson)
      .pipe(first())
      .subscribe(
        data => {
		  this.lessIns.emit(true); 
		  this.addLessonForm.reset();
          this.modalReference.close();
		  this.loading = false;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;		  
		  this.modalReference.close();
        });
  }
}