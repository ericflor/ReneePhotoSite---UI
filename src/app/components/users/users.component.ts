import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { LoginRequest } from '../../models/login-request.model';
import { UserRegistrationDto } from '../../models/user-registration-dto.model';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  loginForm!: FormGroup;
  registrationForm!: FormGroup;
  passwordStrength = 0;
  isPasswordValid = true;
  isLoginFormVisible = true;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    this.registrationForm = this.fb.group(
      {
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirmPassword: [''],
      },
      { validator: this.passwordMatchValidator }
    );

    this.registrationForm
      .get('password')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => this.calculatePasswordStrength(value))
      )
      .subscribe((strength) => (this.passwordStrength = strength));
  }

  // Flip between login and registration forms
  toggleForm(): void {
    this.isLoginFormVisible = !this.isLoginFormVisible;
  }

  checkPassword(): void {
    const password = this.registrationForm.get('password')?.value || '';
    this.isPasswordValid =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,}$/.test(password);
  }

  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value ===
      frm.controls['confirmPassword'].value
      ? null
      : { mismatch: true };
  }

  private calculatePasswordStrength(value: string): number {
    let strength = 0;
    if (value.match(/[A-Z]/)) strength += 1;
    if (value.match(/[a-z]/)) strength += 1;
    if (value.match(/[0-9]/)) strength += 1;
    if (value.match(/[^a-zA-Z0-9]/)) strength += 1;
    if (value.length >= 8) strength += 1;
    return strength;
  }

  getProgressBarClass(): string {
    switch (this.passwordStrength) {
      case 1:
        return 'progress-bar-very-weak';
      case 2:
        return 'progress-bar-weak';
      case 3:
        return 'progress-bar-medium';
      case 4:
        return 'progress-bar-strong';
      case 5:
        return 'progress-bar-very-strong';
      default:
        return '';
    }
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.userService.authenticateUser(this.loginForm.value as LoginRequest).subscribe(
        response => {
          console.log(response);
          localStorage.removeItem('accessToken');
          this.snackBar.open("Login Successful!", "Close", {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });

          // Store the token
          localStorage.setItem('accessToken', response.accessToken);

          // Additional logic for navigating to another page/updating the UI added here
        },
        error => {
          console.error(error);
          this.snackBar.open(error.error, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      );
    }
  }

  onRegister(): void {
    if (this.registrationForm.valid) {
      this.userService.registerUser(this.registrationForm.value as UserRegistrationDto)
        .subscribe(response => {
          this.snackBar.open('Registration successful, please login', 'Close', {
            duration: 3000,
          });
          this.toggleForm(); // Flip to login form
        }, error => {
          console.error(error);
          this.snackBar.open(error.error, 'Close', { duration: 3000 });
        });
    }
  }
}
