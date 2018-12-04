import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Group } from '../shared/models';

import { AlertService, UserService, GroupsService } from '../shared/services';

@Component({templateUrl: 'register.component.html'})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  groups: Group[] = [];
  groupIsEmpty: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
	private groupsService: GroupsService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.groupsService.getAll().pipe(first()).subscribe((_groups : Group[]) => {             
	  this.groups = _groups; 			
    });
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      role: ['', Validators.required],
	  group: [''],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
	((this.registerForm.value.role === "Ученик")&&(this.registerForm.value.group === "")) ? this.groupIsEmpty = true : this.groupIsEmpty = false;
      
    if ((this.registerForm.invalid)||this.groupIsEmpty) {		
      return;
    }
	
    this.loading = true;		
      this.userService.register(this.registerForm.value)
        .pipe(first())
        .subscribe(
          data => {
            this.alertService.success('Registration successful', true);
            this.router.navigate(['/login']);
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
  }
}
