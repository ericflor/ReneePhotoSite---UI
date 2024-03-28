import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';

import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
} from '@angular/core';
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
  statusList: string[] = [];
  typeList: string[] = [];
  modelList: string[] = [];
  selectedFileName: string = '';
  parsedPhones: any[] = [];
  employeesList: Agency[] = [];
  displayedColumns: string[] = [
    'imei',
    'status',
    'type',
    'model',
    'masterAgent',
    'distributor',
    'retailer',
    'employee',
    'date',
    'age',
    'delete',
  ];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  addPhoneForm!: FormGroup;
  reAssignForm!: FormGroup;
  showForm: boolean = false;
  showTable: boolean = false;
  selectedDistributor?: string;
  selectedStatus?: string;
  selectedType?: string;
  selectedModel?: string;
  selectedMasterAgent?: string;
  selectedRetailer?: string;
  selectedEmployee?: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('fileInput') fileInput!: ElementRef;

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
      retailer: [''], // Optional field
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

        this.imeiList = Array.from(
          new Set(
            phones
              .map((phone) => phone.imei)
              .filter((imei): imei is string => !!imei)
          )
        );
        this.agentList = Array.from(
          new Set(
            phones
              .map((phone) => phone.masterAgent)
              .filter((agent): agent is string => !!agent)
          )
        );
        this.distributorList = Array.from(
          new Set(
            phones
              .map((phone) => phone.distributor)
              .filter((distributor): distributor is string => !!distributor)
          )
        );
        this.retailerList = Array.from(
          new Set(
            phones
              .map((phone) => phone.retailer)
              .filter((retailer): retailer is string => !!retailer)
          )
        );
        // Populate statusList, typeList, and modelList
        this.statusList = Array.from(
          new Set(
            phones
              .map((phone) => phone.status)
              .filter((status): status is string => !!status)
          )
        );
        this.typeList = Array.from(
          new Set(
            phones
              .map((phone) => phone.type)
              .filter((type): type is string => !!type)
          )
        );
        this.modelList = Array.from(
          new Set(
            phones
              .map((phone) => phone.model)
              .filter((model): model is string => !!model)
          )
        );
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
          } else if (
            error.error &&
            error.error.error &&
            typeof error.error.error === 'string'
          ) {
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
            errorMessage =
              error.error.message ||
              'Failed to delete phone. You do not have the necessary permissions to perform this action.';
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
    if (control.length > 1) {
      // Ensure at least one input remains
      control.removeAt(control.length - 1);
    }
  }

  calculateAge(dateString: string): number {
    const today = new Date();
    const phoneDate = new Date(dateString);
    const diffTime = Math.abs(today.getTime() - phoneDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // --------------------------------------------- CSV/EXCEL ---------------------------------------------------- //

  handleFileInput(files: FileList) {
    const file = files.item(0);
    if (file) {
      this.selectedFileName = file.name; // Update the selected file name
      this.parseFile(file);
    }
  }

  clearFileInput() {
    this.selectedFileName = '';
    if (this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Add visual feedback
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFileInput(event.dataTransfer.files);
    }
    // Remove visual feedback
  }

  onDragLeave(event: DragEvent) {
    // Remove visual feedback
  }

  parseFile(file: File) {
    if (file.type.includes('excel') || file.type.includes('spreadsheetml')) {
      this.parseExcelFile(file);
    } else if (file.type === 'text/csv') {
      this.parseCSVFile(file);
    }
  }

  parseExcelFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.processData(data); // Implement this method to process your data
    };
    reader.readAsBinaryString(file);
  }

  parseCSVFile(file: File) {
    Papa.parse(file, {
      complete: (result: any) => {
        console.log('Parsed CSV:', result);
        this.processData(result.data); // Implement this method to process data
      },
    });
  }

  processData(data: any[]) {
    // Assuming the first row is headers and the rest are data rows
    const headers = data[0].map((header: string) => header.toLowerCase()); // Normalize headers to lowercase
    const rows = data.slice(1);

    const phones = rows.map((row) => {
      let phone: any = {};
      row.forEach((cell: any, index: number) => {
        const header = headers[index];
        // Use lowercase in your switch-case to match the normalized headers
        switch (header) {
          case 'imei':
            phone.imei = cell;
            break;
          case 'status':
            phone.status = cell;
            break;
          case 'device type':
            phone.type = cell;
            break;
          case 'device model':
            phone.model = cell;
            break;
          case 'master agent':
            phone.masterAgent = cell;
            break;
          case 'distributor':
            phone.distributor = cell;
            break;
          case 'retailer':
            phone.retailer = cell;
            break;
          case 'date':
            phone.date = this.formatDate(cell);
            break;
          default:
            break;
        }
      });
      return phone;
    });

    console.log('Transformed File values:', phones);

    this.parsedPhones = phones;
    console.log('Transformed Values ready for submission:', this.parsedPhones);

    this.snackBar.open('File processed. Ready to submit batch.', 'Close', {
      duration: 3000,
    });
  }

  formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    return date.toISOString();
  }

  handleFileInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFileInput(input.files);
    }
  }

  triggerUpload() {
    if (this.selectedFileName && this.parsedPhones.length > 0) {
      // Now call the addPhonesBatch method with the stored data
      this.inventoryService.addPhonesBatch(this.parsedPhones).subscribe(
        (data) => {
          console.log('Phones added successfully', data);
          this.loadInventory(this.currentPage, this.pageSize);
          this.addPhoneForm.reset();
          this.clearFileInput(); // Clear the selected file info
          this.parsedPhones = [];
          this.snackBar.open('Phones added successfully!', 'Close', {
            duration: 3000,
          });
        },
        (error) => {
          console.error('Error adding phones', error);
          this.snackBar.open(
            'Error adding phones. Please try again.',
            'Close',
            {
              duration: 3000,
            }
          );
        }
      );
    } else {
      this.snackBar.open(
        'Please select a file to upload and process it first.',
        'Close',
        {
          duration: 3000,
        }
      );
    }
  }

  triggerReAssignUpload() {
    if (this.selectedFileName && this.parsedPhones.length > 0) {
      // Now call the updatePhonesBatch method with the stored data
      this.inventoryService.updatePhonesBatch(this.parsedPhones).subscribe(
        (data) => {
          console.log('Inventory (re)assigned successfully', data);
          this.loadInventory(this.currentPage, this.pageSize);
          this.addPhoneForm.reset();
          this.clearFileInput(); // Clear the selected file info
          this.parsedPhones = [];
          this.snackBar.open('Inventory (re)assigned successfully!', 'Close', {
            duration: 3000,
          });
        },
        (error) => {
          console.error('Error (re)assigning inventory', error);
          this.snackBar.open(
            'Error (re)assigning inventory. Please try again.',
            'Close',
            {
              duration: 3000,
            }
          );
        }
      );
    } else {
      this.snackBar.open(
        'Please select a file to upload and process it first.',
        'Close',
        {
          duration: 3000,
        }
      );
    }
  }

  exportData(format: 'csv' | 'xlsx'): void {
    this.inventoryService.fetchAllInventory().subscribe(
      (response) => {
        // Filter data based on selected parameters
        const filteredData = response.content.filter((phone) => {
          return (
            (!this.selectedDistributor ||
              phone.distributor === this.selectedDistributor) &&
            (!this.selectedStatus || phone.status === this.selectedStatus) &&
            (!this.selectedType || phone.type === this.selectedType) &&
            (!this.selectedModel || phone.model === this.selectedModel) &&
            (!this.selectedMasterAgent ||
              phone.masterAgent === this.selectedMasterAgent) &&
            (!this.selectedRetailer ||
              phone.retailer === this.selectedRetailer) &&
            (!this.selectedEmployee ||
              phone.employee?.username === this.selectedEmployee)
          );
        });

        // Prepare data for export
        const dataToExport = this.formatDataForExport(filteredData);

        if (format === 'csv') {
          const csv = Papa.unparse(dataToExport);
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          FileSaver.saveAs(blob, `inventory_${new Date().toISOString()}.csv`);
          this.snackBar.open('Downloading CSV file...', 'Close', {
            duration: 3000,
          });
        } else if (format === 'xlsx') {
          const wb = new Workbook();
          const ws = wb.addWorksheet('Inventory');

          ws.columns = [
            { header: 'IMEI', key: 'imei', width: 20 },
            { header: 'Status', key: 'status', width: 10 },
            { header: 'Type', key: 'type', width: 15 },
            { header: 'Model', key: 'model', width: 15 },
            { header: 'Master Agent', key: 'masterAgent', width: 20 },
            { header: 'Distributor', key: 'distributor', width: 20 },
            { header: 'Retailer', key: 'retailer', width: 20 },
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Age (Days)', key: 'age', width: 10 },
            { header: 'Employee', key: 'employee', width: 20 },
          ];

          // Add data rows including the age for each phone
          const dataWithAge = dataToExport.map((phone) => ({
            ...phone,
            date: phone.date ? this.formatDateForExport(phone.date) : 'N/A',
            age: phone.date ? this.calculateAge(phone.date) : 'N/A', // Calculate the age here
          }));
          // Add data rows
          ws.addRows(dataWithAge);

          wb.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            FileSaver.saveAs(
              blob,
              `inventory_${new Date().toISOString()}.xlsx`
            );
            this.snackBar.open('Downloading XLSX file...', 'Close', {
              duration: 3000,
            });
          });
        }
      },
      (error) => {
        console.error('Error fetching full inventory:', error);
        this.snackBar.open(
          'Failed to export inventory. Please try again.',
          'Close',
          { duration: 3000 }
        );
      }
    );
  }

  formatDataForExport(data: Phone[]): any[] {
    return data.map((phone) => ({
      imei: phone.imei ?? '',
      status: phone.status ?? '',
      type: phone.type ?? '',
      model: phone.model ?? '',
      masterAgent: phone.masterAgent ?? '',
      distributor: phone.distributor ?? '',
      retailer: phone.retailer ?? '',
      date: phone.date ? this.formatDateForExport(phone.date) : 'N/A',
      age: phone.date ? this.calculateAge(phone.date) : 'N/A', // Use 'N/A' if date is undefined
      employee: phone.employee?.username ?? 'N/A', // Safe navigation with nullish coalescing
    }));
  }

  // Helper function to format the date for export
  formatDateForExport(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  clearFilters(): void {
    this.selectedDistributor = undefined;
    this.selectedStatus = undefined;
    this.selectedType = undefined;
    this.selectedModel = undefined;
    this.selectedMasterAgent = undefined;
    this.selectedRetailer = undefined;
    this.selectedEmployee = undefined;
  }
}

// MEETING NOTES

// Inventory needs an input to load in an excel to batch upload phones to inventory -> DONE!!!!!
// Batch upload from excel for assigning inventory as well -> DONE!!!!!

// also want functionality to export excel sheet from inventory,
// or by specific parameters like everything for a specific employee, etc -> DONE!!!!!

// Inventory needs a reporting tab -> (reference their website under Inventory report, used DNAA master agent as an example)
// Used means units sold (will go through requirements for Sales flow later):
// Free is how many you have in inventory
// Removed is defective, manually took out
// clicking on one of those should generate the report of that data

// add in column or data point for age of phone while in inventory (Date now minus date created) -> DONE!!!!!

// PERMISIONS RULES: DO THIS FIRST!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -> DONE!!!!!

// 1 - ADMIN - MASTER AGENT
// 2 - Distributor
// 3 - Retailer
// 4 - Employee
// 1 transfer anywhere
// 2 transfer to 3 & 4
// 3 transfer to 4
// 4 cant use system
// NO ONE can see anything else



// SECOND MEETING NOTES:

// IMEI FOR REASSIGN NEEDS TO BE A LARGE INPUT BOX IN ORDER TO SCAN IN NUMBERS FROM PHYSCIAL PHONE BOXES (20 PHONE BOXES PER ORDER BOX)
// REFERENCE THEIR CURRENT SITE -> THERE'S A TEXT PROMPT THAT SAYS HOW MANY IMEI's ARE IN THE TEXT BOX READY TO ASSIGN
// SHOULD THROW ERROR IF THE SYTEM TRIES TO ASSIGN INVENTORY BUT THE IMEIs AREN'T IN INVENTORY
// CREATE COLUMNS THAT SHOW HOW MANY SUCCESFUL/UNSUCCESSFUL REASSIGNS HAPPENED -> REFERENCE THEIR CURRENT SITE

// BREAK APART INVENTORY COMPONENT INTO UPLOAD, REASSIGN, REPORTS -> CALL IT WAREHOUSE WITH 3 TABS FOR EACH OF THOSE

// REMOVE TYPE AND MODEL FROM EXCEL EXPORT

// UPDATE PERMISSIONS, UI COMPONENTS SHOULD ONLY BE VISIBLE AT THE LEVEL OF PERMISSIONS INCLUDING ->
// CURRENT LOGGED IN USER SHOULD ONLY SEE THEIR RECORDS FOR ORDERS, INVENTORY, AND AGENCIES
// ONLY MASTER AGENT SHOULD BE ABLE TO SEE EVERYTHING

// NEED AN AREA TO TAKE OUT INVENTORY FROM TOTAL WAREHOUSE BY BATCH -> PROBABLY SET THIS UP THE SAME AS ASSIGN WHERE THEY CAN
// SCAN BOXES INTO A LARGE TEXT INPUT AND REMOVE ALL INVENTORY BY THAT IMEI LIST

// SHOULD BE READY TO DEPLOY NEXT MEETING (TUES OR WED) AFTER SIGNING THESE LAST ITEMS OFF
