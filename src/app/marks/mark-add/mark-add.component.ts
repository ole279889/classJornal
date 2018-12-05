import { Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Lesson } from '../../shared/models';
import { User } from '../../shared/models';
import { UserService, MarksService, AlertService } from '../../shared/services';

@Component({
  selector: 'mark-add',
  templateUrl: './mark-add.component.html'
})
export class MarkAddComponent {
  addMarkForm: FormGroup;
  loading = false;
  submitted = false;  
  @Input() students: User[] = [];
  @Output() markIns: EventEmitter<boolean> = new EventEmitter();
  @Input() lessonInfo: Lesson;
  modalReference: any;  

  constructor(
    private formBuilder: FormBuilder, 
	private modalService: NgbModal,	 
	private markService: MarksService,
	private alertService: AlertService
  ) {}
  
  ngOnInit() {	  		
    this.addMarkForm = this.formBuilder.group({
      studentId: ['', Validators.required],
      mark: ['', Validators.required],
    });
  }
   
  open(content) {
    this.modalReference = this.modalService.open(content, { centered: true })
  }
     
  get f() { return this.addMarkForm.controls; }

  onSubmit() {
    
    if (this.addMarkForm.invalid) {		
      return;
    }
	
    this.loading = true;		
	
	var _mark = {       
      id: null,
      lessonId: this.lessonInfo.id,
      teacherId: this.lessonInfo.teacherId,
      studentId: this.addMarkForm.value.studentId,  
      mark: this.addMarkForm.value.mark,
    }
	
    this.markService.addMark(_mark)
      .pipe(first())
      .subscribe(
        data => {
		  this.markIns.emit(true); 
		  this.addMarkForm.reset();
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