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

  closeDialog(): void {
    this.dialogRef.close(this.prepareFormValueBeforeClose());
  }

  prepareFormValueBeforeClose(): any {
    const formValue = this.editAgencyForm.value;

    if (formValue.username === this.originalUsername) {
      const resultValue = { ...formValue };
      delete resultValue.username;
      return resultValue;
    }

    return formValue;
  }
}
