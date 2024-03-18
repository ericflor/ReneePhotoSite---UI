import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-agency-dialog',
  templateUrl: './create-agency-dialog.component.html',
  styleUrls: ['./create-agency-dialog.component.css']
})
export class CreateAgencyDialogComponent implements OnInit {
  createAgencyForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createAgencyForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required], // Consider using Validators.minLength for better security
      level: ['', Validators.required],
      role: ['', Validators.required],
      blocked: [false] // Defaults to false, change as needed
    });
  }

  ngOnInit(): void {}
}
