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
      password: ['', Validators.required],
      level: ['', Validators.required],
      role: ['', Validators.required],
      blocked: [false]
    });
  }

  ngOnInit(): void {}
}
