import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-agency-dialog',
  templateUrl: './edit-agency-dialog.component.html',
  styleUrls: ['./edit-agency-dialog.component.css'],
})
export class EditAgencyDialogComponent implements OnInit {
  editAgencyForm!: FormGroup;
  originalUsername!: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditAgencyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.originalUsername = this.data.agency.username;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.editAgencyForm = this.fb.group({
      name: [this.data.agency.name, Validators.required],
      email: [this.data.agency.email, [Validators.required, Validators.email]],
      username: [this.data.agency.username, Validators.required],
      level: [this.data.agency.level, Validators.required],
      role: [this.data.agency.role, Validators.required],
      blocked: [this.data.agency.blocked],
    });
  }

  // Add this method
  closeDialog(): void {
    this.dialogRef.close(this.prepareFormValueBeforeClose());
  }

  // Method to prepare the form value before closing the dialog
  prepareFormValueBeforeClose(): any {
    const formValue = this.editAgencyForm.value;

    // Check if username has been changed
    if (formValue.username === this.originalUsername) {
      // Clone formValue to not mutate the original object
      const resultValue = { ...formValue };
      delete resultValue.username; // Remove username from the payload if not changed
      return resultValue;
    }

    return formValue;
  }
}
