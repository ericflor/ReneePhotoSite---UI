import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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
  showForm: boolean = false;
  showTable: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private inventoryService: InventoryService, private fb: FormBuilder) {
    this.addPhoneForm = this.fb.group({
      phones: this.fb.array([this.initPhoneFields()])
    });
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

  submitPhones(): void {
    if (this.addPhoneForm.valid) {
      const phones = this.addPhoneForm.value.phones;
      this.inventoryService.addPhonesBatch(phones).subscribe(data => {
        console.log('Phones added successfully', data);
        this.loadInventory(this.currentPage, this.pageSize);
        this.addPhoneForm.reset();
        window.alert('Phones added successfully!');
      }, error => {
        console.error('Error adding phones', error);
        window.alert('Error adding phones. Please try again.');
      });
    }
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
}
