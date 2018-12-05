import { Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Lesson, Subject, User, Group } from '../../shared/models';
import { UserService, ScheduleService, AlertService, GroupsService, SubjectsService } from '../../shared/services';

@Component({
  selector: 'home-edit',
  templateUrl: './home-edit.component.html'
})
export class HomeEditComponent {
  editLessonForm: FormGroup;
  loading = false;
  submitted = false;    
  @Output() lessIns: EventEmitter<boolean> = new EventEmitter(); 
  @Input() lesson: Lesson;  
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
	
    this.editLessonForm = this.formBuilder.group({
      date: [this.lesson.date, Validators.required],
      subject: [this.lesson.subject, Validators.required],
	  group: [this.lesson.group, Validators.required],
	  teacherId: [{value: this.lesson.teacherId, disabled: !(this.userService.isAdmin())}, Validators.required],
    });
  }
   
  open(content) {
    this.modalReference = this.modalService.open(content, { centered: true })
  }
     
  get f() { return this.editLessonForm.controls; }

  onSubmit() {
    
    if (this.editLessonForm.invalid) {		
      return;
    }
	
    this.loading = true;		
	
	var _lesson = {       
      id: this.lesson.id,
      date: this.editLessonForm.value.date,
      subject: this.editLessonForm.value.subject,
      group: this.editLessonForm.value.group,  
      teacherId: this.userService.isAdmin() ? this.editLessonForm.value.teacherId : this.lesson.teacherId,
    }
	
    this.scheduleService.update(_lesson)
      .pipe(first())
      .subscribe(
        data => {
		  this.lessIns.emit(true); 		  
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