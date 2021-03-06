import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent }  from './app.component';
import { routing }        from './app.routing';
import { AlertComponent } from './alert';
import { AuthGuard } from './shared/guards';
import { JwtInterceptor, ErrorInterceptor } from './shared/helpers';
import { AlertService, AuthenticationService, UserService, GroupsService, SubjectsService, ScheduleService, MarksService } from './shared/services';
import { HomeComponent } from './home';
import { HomeAddComponent } from './home';
import { HomeEditComponent } from './home';
import { UsersComponent } from './users';
import { UserEditComponent } from './users';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { MarksFormComponent, MarkAddComponent, MarkEditComponent } from './marks';
import {MatTableModule} from '@angular/material/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
	MatTableModule,
	NgbModule,
    routing
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    HomeComponent,
	HomeAddComponent,
	HomeEditComponent,
	UsersComponent,
	UserEditComponent,
    LoginComponent,
    RegisterComponent,
	MarksFormComponent,
	MarkAddComponent,
	MarkEditComponent
  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
	GroupsService,
	SubjectsService,
	ScheduleService,
	MarksService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
