import { Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Lesson } from '../../shared/models';
import { User } from '../../shared/models';
import { Mark } from '../../shared/models';
import { UserService, MarksService, AlertService } from '../../shared/services';

@Component({
  selector: 'mark-edit',
  templateUrl: './mark-edit.component.html'
})
export class MarkEditComponent {
  editMarkForm: FormGroup;
  loading = false;
  submitted = false;  
  @Input() mark: Mark;
  @Output() markIns: EventEmitter<boolean> = new EventEmitter();  
  modalReference: any;
  users: User[];

  constructor(
    private formBuilder: FormBuilder, 
	private modalService: NgbModal, 
	private userService: UserService, 
	private markService: MarksService,
	private alertService: AlertService
  ) {}
  
  ngOnInit() {
	this.users = this.userService.users;  		
    this.editMarkForm = this.formBuilder.group({      
      mark: [this.mark.mark, Validators.required],
    });
  }
   
  open(content) {
    this.modalReference = this.modalService.open(content, { centered: true })
  }
     
  get f() { return this.editMarkForm.controls; }

  onSubmit() {
    
    if (this.editMarkForm.invalid) {		
      return;
    }
	
    this.loading = true;		
	
	var _mark = {       
      id: this.mark.id,
      lessonId: this.mark.lessonId,
      teacherId: this.mark.teacherId,
      studentId: this.mark.studentId,  
      mark: this.editMarkForm.value.mark,
    }
	
    this.markService.update(_mark)
      .pipe(first())
      .subscribe(
        data => {
		  this.markIns.emit(true); 
		  this.editMarkForm.reset();
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