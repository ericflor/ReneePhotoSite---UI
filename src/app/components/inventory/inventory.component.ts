import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar as MatSnackBar } from '@angular/material/snack-bar';
import { InventoryService } from 'src/app/services/inventory.service';
import { AgencyService } from 'src/app/services/agency.service';
import {
  MatPaginator as MatPaginator,
  PageEvent as PageEvent,
} from '@angular/material/paginator';
import { Phone } from 'src/app/models/phone';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Agency } from 'src/app/models/agency';
import { AuthGuardService } from 'src/app/services/authGuard.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit {
  phones: Phone[] = [];
  imeiList: string[] = [];
  agentList: string[] = [];
  distributorList: string[] = [];
  retailerList: string[] = [];
  // employeeNamesList: string[] = [];
  employeesList: Agency[] = [];
  displayedColumns: string[] = [
    'imei',
    'status',
    'type',
    'model',
    'masterAgent',
    'distributor',
    'retailer',
    'date',
    'employee',
    'delete',
  ];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  addPhoneForm!: FormGroup;
  reAssignForm!: FormGroup;
  showForm: boolean = false;
  showTable: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private authService: AuthGuardService,
    private inventoryService: InventoryService,
    private agencyService: AgencyService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.addPhoneForm = this.fb.group({
      phones: this.fb.array([this.initPhoneFields()]),
    });

    this.reAssignForm = this.initReAssignFields();
  }

  ngOnInit(): void {
    this.loadInventory(this.currentPage, this.pageSize);
  }

  // If logged in user is employee, they should only be able to see the table
  get isEmployee(): boolean {
    return this.authService.hasRole('ROLE_EMPLOYEE');
  }

  initPhoneFields(): FormGroup {
    return this.fb.group({
      imei: ['', Validators.required],
      type: ['', Validators.required],
      model: ['', Validators.required],
      masterAgent: [''], // Optional field
      distributor: [''], // Optional field
      retailer: [''] // Optional field
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

  resetReAssignForm(): void {
    // Resets the form fields to empty values or initial state
    this.reAssignForm.reset({
      imei: '', // Resetting to empty or initial value
      masterAgent: '',
      distributor: '',
      retailer: '',
      employee: { id: '' },
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
    this.inventoryService.getAllPhones(page, size).subscribe(
      (data) => {
        this.phones = data.content;
        this.totalElements = data.totalElements;
        this.pageSize = data.size;
        this.currentPage = data.number;

        // Now fetch all agencies and other mat select dropdown data
        // Populate IMEI, Master Agent, Distributor, Retailer & Employee lists for dropdowns, filtering out undefined values
        this.fetchAllAgencies();
        this.loadDropdownData();

        this.showTable = true;
      },
      (error) => {
        console.error('Error fetching inventory:', error);
      }
    );
  }

  loadDropdownData(): void {
    this.inventoryService.fetchAllForDropdowns().subscribe(
      (data) => {
        const phones: Phone[] = data.content;

        this.imeiList = Array.from(new Set(phones.map(phone => phone.imei).filter((imei): imei is string => !!imei)));
        this.agentList = Array.from(new Set(phones.map(phone => phone.masterAgent).filter((agent): agent is string => !!agent)));
        this.distributorList = Array.from(new Set(phones.map(phone => phone.distributor).filter((distributor): distributor is string => !!distributor)));
        this.retailerList = Array.from(new Set(phones.map(phone => phone.retailer).filter((retailer): retailer is string => !!retailer)));
      },
      (error) => {
        console.error('Error fetching phones for dropdowns:', error);
      }
    );
  }

  fetchAllAgencies(): void {
    this.agencyService.getAllAgencies(0, 100000000).subscribe(
      (response) => {
        const agencies = response.content;

        // Map over agencies to create a unique list based on ID
        const uniqueAgencies = new Map<number, Agency>();
        agencies.forEach((agency: Agency) => {
          if (agency && !uniqueAgencies.has(agency.id!)) {
            uniqueAgencies.set(agency.id!, agency);
          }
        });

        this.employeesList = Array.from(uniqueAgencies.values());
        console.log('AGENCIES LIST:', this.employeesList);
      },
      (error) => {
        console.error('Error fetching agencies:', error);
      }
    );
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
      this.inventoryService.addPhonesBatch(phones).subscribe(
        (data) => {
          console.log('Phones added successfully', data);
          this.loadInventory(this.currentPage, this.pageSize);
          this.addPhoneForm.reset();
          this.snackBar.open('Phones added successfully!', 'Close', {
            duration: 3000,
          });
        },
        (error) => {
          console.error('Error adding phones', error);
          this.snackBar.open(
            'Error adding phones. Please try again.',
            'Close',
            { duration: 3000 }
          );
        }
      );
    }
  }

  submitReAssign(): void {
    if (this.reAssignForm.valid) {
      const formValues = this.reAssignForm.value;

      // Prepare the request payload
      const payload: any = {
        imei: formValues.imei,
        ...(formValues.employee.id && { employee: formValues.employee }),
      };

      // Conditionally add fields if they have values
      if (formValues.masterAgent) {
        payload.masterAgent = formValues.masterAgent;
      }
      if (formValues.distributor) {
        payload.distributor = formValues.distributor;
      }
      if (formValues.retailer) {
        payload.retailer = formValues.retailer;
      }

      this.inventoryService.updatePhone(payload.imei, payload).subscribe({
        next: (response) => {
          console.log('Update successful', response);
          this.snackBar.open('Update successful', 'Close', {
            duration: 3000,
          });
          this.loadInventory(this.currentPage, this.pageSize); // Refresh your table data if needed
          this.reAssignForm.reset();
        },
        error: (error) => {
          console.error('Update failed', error);
          let errorMessage = 'Update failed. Please try again.'; // Default error message
          if (error.error && typeof error.error === 'string') {
            // If the error object contains a string message, use it
            errorMessage = error.error;
          } else if (error.error && error.error.error && typeof error.error.error === 'string') {
            // For more deeply nested error messages
            errorMessage = error.error.error;
          }
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000,
          });
        },
      });
    }
  }

  deletePhone(imei: string): void {
    if (confirm('Are you sure you want to delete this phone?')) {
      this.inventoryService.deletePhone(imei).subscribe({
        next: () => {
          this.snackBar.open('Phone deleted successfully', 'Close', {
            duration: 3000,
          });
          this.loadInventory(this.currentPage, this.pageSize); // Refresh the list
        },
        error: (error) => {
          console.error('There was an error!', error);
          let errorMessage = 'Failed to delete phone. Please try again later.';
          if (error.error) {
            errorMessage = error.error.message || 'Failed to delete phone. You do not have the necessary permissions to perform this action.';
          }
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000,
          });
        },
      });
    }
  }


  removeLastPhoneInput(): void {
    const control = <FormArray>this.addPhoneForm.get('phones');
    if (control.length > 1) { // Ensure at least one input remains
      control.removeAt(control.length - 1);
    }
  }
}



// MEETING NOTES


// Inventory needs an input to load in an excel to batch upload phones to inventory
// Batch upload from excel for assigning inventory as well
// also want functionality to export excel sheet from inventory, or by specific parameters like everything for a specific employee, etc

// Inventory needs a reporting tab -> (reference their website under Inventory report, used DNAA master agent as an example)
// Used means units sold (will go through requirements for Sales flow later)
// Free is how many you have in inventory
// Removed is defective, manually took out
// clicking on one of those should generate the report of that data


// add in column or data point for age of phone while in inventory (Date now - date created)


// PERMISIONS RULES: DO THIS FIRST!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// 1 - ADMIN - MASTER AGENT
// 2 - Distributor
// 3 - Retailer
// 4 - Employee
// 1 transfer anywhere
// 2 transfer to 3 & 4
// 3 transfer to 4
// 4 cant use system
// NO ONE can see anything else
