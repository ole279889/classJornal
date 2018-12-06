import { Component, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Lesson, Subject, User, Group } from '../../shared/models';
import { UserService, AlertService, GroupsService } from '../../shared/services';

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html'
})
export class UserEditComponent {
  editUserForm: FormGroup;
  loading = false;
  submitted = false;    
  @Output() userUpd: EventEmitter<boolean> = new EventEmitter(); 
  @Input() user: User;  
  modalReference: any;  
  groups: Group[] = []; 
  groupIsEmpty: boolean = false;

  constructor(
    private formBuilder: FormBuilder, 
	private modalService: NgbModal, 
	private userService: UserService, 	
	private alertService: AlertService,
	private groupsService: GroupsService
  ) {}
  
  ngOnInit() {
	this.groupsService.getAll().pipe(first()).subscribe((_groups : Group[]) => {             
	  this.groups = _groups; 			
    });  
		
    this.editUserForm = this.formBuilder.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      username: [this.user.username, Validators.required],
      role: [{value: this.user.role, disabled: true}],
	  group: [this.user.group],
      password: [this.user.password, [Validators.required, Validators.minLength(6)]]
    });
  }
   
  open(content) {
    this.modalReference = this.modalService.open(content, { centered: true })
  }
     
  get f() { return this.editUserForm.controls; }

  onSubmit() {
	  
	((this.user.role === "Ученик")&&(this.editUserForm.value.group === "")) ? this.groupIsEmpty = true : this.groupIsEmpty = false;  
    
    if (this.editUserForm.invalid || this.groupIsEmpty) {		
      return;
    }
	
    this.loading = true;		
	
	var _user = {  
      id: this.user.id,
      username: this.editUserForm.value.username,
      password: this.editUserForm.value.password,
      firstName: this.editUserForm.value.firstName,
      lastName: this.editUserForm.value.lastName,
      role: this.user.role,
      group: this.editUserForm.value.group,	      
    }
	
    this.userService.update(_user)
      .pipe(first())
      .subscribe(
        data => {
		  this.userUpd.emit(true); 		  
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