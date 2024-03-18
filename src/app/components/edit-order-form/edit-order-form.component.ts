// edit-order-form.component.ts
import {Component, Inject} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Order} from '../../models/order';

@Component({
  selector: 'app-edit-order-form',
  templateUrl: './edit-order-form.component.html',
  styleUrls: ['./edit-order-form.component.css']
})


export class EditOrderFormComponent {
  editForm: FormGroup;
  statusOptions: string[] = ['NEW', 'APPROVED', 'SHIPPED', 'DENIED'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditOrderFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {order: Order}
  ) {
    this.editForm = this.fb.group({
      id: [data.order.id],
      companyName: [data.order.companyName, Validators.required],
      nameOfRecipient: [data.order.nameOfRecipient, Validators.required],
      phoneNumber: [data.order.phoneNumber, Validators.required],
      email: [data.order.email, Validators.required],
      address: [data.order.address, Validators.required],
      city: [data.order.city, Validators.required],
      state: [data.order.state, Validators.required],
      zipCode: [data.order.zipCode, Validators.required],
      nameETC: [data.order.nameETC, Validators.required],
      quantity: [data.order.quantity, Validators.required],
      notes: [data.order.notes],
      trackingNumber: [data.order.trackingNumber],
      status: [data.order.status, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      this.dialogRef.close(this.editForm.value);
    }
  }
}
