import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Phone } from '../../models/phone';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-phone-form',
  templateUrl: './edit-phone-form.component.html',
  styleUrls: ['./edit-phone-form.component.css'],
  providers: [DatePipe]
})
export class EditPhoneFormComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditPhoneFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { phone: Phone },
    private datePipe: DatePipe
  ) {

    const formattedDate = this.datePipe.transform(data.phone.date, 'yyyy-MM-dd');

    this.editForm = this.fb.group({
      imei: [data.phone.imei, Validators.required],
      status: [data.phone.status, Validators.required],
      type: [data.phone.type, Validators.required],
      model: [data.phone.model, Validators.required],
      masterAgent: [data.phone.masterAgent],
      distributor: [data.phone.distributor],
      retailer: [data.phone.retailer],
      // employee: [data.phone.employee?.name, Validators.required],
      date: [formattedDate, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      let formData = this.editForm.value;
      if (formData.date) {
        // Convert to UTC midnight to avoid timezone shifts
        formData.date = new Date(formData.date + 'T00:00:00Z').toISOString();
      }
      this.dialogRef.close(formData);
    }
  }

}
