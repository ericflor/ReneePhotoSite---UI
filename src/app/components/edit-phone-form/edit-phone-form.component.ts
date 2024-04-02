import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Phone } from '../../models/phone';

@Component({
  selector: 'app-edit-phone-form',
  templateUrl: './edit-phone-form.component.html',
  styleUrls: ['./edit-phone-form.component.css']
})
export class EditPhoneFormComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditPhoneFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { phone: Phone }
  ) {
    this.editForm = this.fb.group({
      imei: [data.phone.imei, Validators.required],
      status: [data.phone.status, Validators.required],
      type: [data.phone.type, Validators.required],
      model: [data.phone.model, Validators.required],
      masterAgent: [data.phone.masterAgent],
      distributor: [data.phone.distributor],
      retailer: [data.phone.retailer],
      // employee: [data.phone.employee?.name, Validators.required],
      date: [data.phone.date, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      this.dialogRef.close(this.editForm.value);
    }
  }
}
