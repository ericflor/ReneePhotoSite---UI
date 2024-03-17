import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InventoryService } from 'src/app/services/inventory.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Phone } from 'src/app/models/phone';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})

export class InventoryComponent implements OnInit {
  phones: Phone[] = [];
  displayedColumns: string[] = ['imei', 'status', 'type', 'model', 'masterAgent', 'distributor', 'retailer', 'date', 'employee'];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  addPhoneForm!: FormGroup;
  reAssignForm!: FormGroup;
  showForm: boolean = false;
  showTable: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private inventoryService: InventoryService, private fb: FormBuilder,
    private snackBar: MatSnackBar) {

    this.addPhoneForm = this.fb.group({
      phones: this.fb.array([this.initPhoneFields()])
    });

    this.reAssignForm = this.initReAssignFields();
  }

  ngOnInit(): void {
    this.loadInventory(this.currentPage, this.pageSize);
  }

  initPhoneFields(): FormGroup {
    return this.fb.group({
      imei: ['', Validators.required],
      type: ['', Validators.required],
      model: ['', Validators.required]
    });
  }

  initReAssignFields(): FormGroup {
    return this.fb.group({
      imei: ['', Validators.required], // Added IMEI field
      masterAgent: [''],
      distributor: [''],
      retailer: [''],
      employee: this.fb.group({
        id: [''],
      }),
    });
  }

  addNewPhoneInput(): void {
    const control = <FormArray>this.addPhoneForm.get('phones');
    control.push(this.initPhoneFields());
  }

  removePhoneInput(index: number): void {
    const control = <FormArray>this.addPhoneForm.get('phones');
    control.removeAt(index);
  }

  get phonesFormArray(): FormArray {
    return this.addPhoneForm.get('phones') as FormArray;
  }

  loadInventory(page: number, size: number): void {
    this.inventoryService.getAllPhones(page, size).subscribe(data => {
      this.phones = data.content;
      this.totalElements = data.totalElements;
      this.pageSize = data.size;
      this.currentPage = data.number;

      this.showTable = true;

    }, error => {
      console.error('Error fetching inventory:', error);
    });
  }

  changePage(event: PageEvent): void {
    this.loadInventory(event.pageIndex, event.pageSize);
  }

  resetForm(): void {
    // Resets the form to its initial state, optionally clearing the form array
    while ((this.addPhoneForm.get('phones') as FormArray).length !== 0) {
      (this.addPhoneForm.get('phones') as FormArray).removeAt(0);
    }
    (this.addPhoneForm.get('phones') as FormArray).push(this.initPhoneFields());
  }

  submitPhones(): void {
    if (this.addPhoneForm.valid) {
      const phones = this.addPhoneForm.value.phones;
      this.inventoryService.addPhonesBatch(phones).subscribe(data => {
        console.log('Phones added successfully', data);
        this.loadInventory(this.currentPage, this.pageSize);
        this.addPhoneForm.reset();
        this.snackBar.open('Phones added successfully!', 'Close', { duration: 3000 });
      }, error => {
        console.error('Error adding phones', error);
        this.snackBar.open('Error adding phones. Please try again.', 'Close', { duration: 3000 });
      });
    }
  }

  submitReAssign(): void {
    if (this.reAssignForm.valid) {
      const updatedValues = this.reAssignForm.value;

      this.inventoryService.updatePhone(updatedValues.imei, updatedValues).subscribe({
        next: (response) => {
          console.log('Update successful', response);
          this.snackBar.open('Update successful', 'Close', { duration: 3000 });
          this.loadInventory(this.currentPage, this.pageSize); // Refresh your table data if needed
          this.reAssignForm.reset();
        },
        error: (error) => {
          console.error('Update failed', error);
          this.snackBar.open('Update failed. Please try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
