import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar as MatSnackBar } from '@angular/material/snack-bar';
import { InventoryService } from 'src/app/services/inventory.service';
import {
  MatPaginator as MatPaginator,
  PageEvent as PageEvent,
} from '@angular/material/paginator';
import { Phone } from 'src/app/models/phone';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Agency } from 'src/app/models/agency';
import { AuthGuardService } from 'src/app/services/authGuard.service';
import { BatchAssign } from 'src/app/models/batchAssign';
import { BatchAssignService } from 'src/app/services/batchAssign.service';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UpdatePhoneResponse } from 'src/app/models/updatePhoneResponse';
import { AgencyService } from 'src/app/services/agency.service';
import { BatchAssignCreateRequest } from 'src/app/models/batchAssignCreateRequest';

@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.css'],
})
export class AssignComponent implements OnInit {
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
  assignedTo?: string;
  batchAssigns: BatchAssign[] = [];
  displayedColumns: string[] = [
    'batchCode',
    'uploadedOn',
    'uploadedBy',
    'assignedTo',
    'totalRecords',
    'uploadedSuccess',
    'uploadedFailure',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private authService: AuthGuardService,
    private inventoryService: InventoryService,
    private fb: FormBuilder,
    private batchAssignService: BatchAssignService,
    private agencyService: AgencyService,
    private snackBar: MatSnackBar
  ) {
    this.reAssignForm = this.initReAssignFields();
  }

  ngOnInit(): void {
    this.loadBatchAssignRecords(this.currentPage, this.pageSize);
    this.loadInventory(this.currentPage, this.pageSize);
  }

  loadBatchAssignRecords(page: number, size: number): void {
    this.employeesList = this.fetchAllAgencies();
    this.batchAssignService.getAllBatchAssigns(page, size).subscribe({
      next: (data) => {
        this.batchAssigns = data.content.map((batchAssign: BatchAssign) => {
          // Check if assignedTo is an employee ID
          if (this.isNumeric(batchAssign.assignedTo)) {
            const employee = this.employeesList.find(
              (e) => e.id === Number(batchAssign.assignedTo)
            );
            if (employee) {
              return { ...batchAssign, assignedTo: employee.name };
            }
          }
          return batchAssign;
        });
        this.totalElements = data.totalElements;
      },
      error: (error) => {
        console.error('Error fetching batch assigns:', error);
      },
    });
  }

  isNumeric(value: any): boolean {
    return !isNaN(value) && !isNaN(parseFloat(value));
  }

  get isEmployee(): boolean {
    return this.hasRole('ROLE_EMPLOYEE');
  }

  get isRetailer(): boolean {
    return this.hasRole('ROLE_RETAILER')
  }

  get isDistributor(): boolean {
    return this.hasRole('ROLE_DISTRIBUTOR')
  }

  get isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN')
  }

  get userRole(): string[] {
    return this.authService.getUserRoles();
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  get imeiCount(): number {
    return (
      this.reAssignForm
        .get('imeis')
        ?.value.split('\n')
        .filter((line: string) => line.trim()).length || 0
    );
  }

  initReAssignFields(): FormGroup {
    return this.fb.group({
      imeis: ['', Validators.required],
      masterAgent: [''],
      distributor: [''],
      retailer: [''],
      employee: this.fb.group({
        id: [''],
      }),
    });
  }

  resetReAssignForm(): void {
    this.reAssignForm.reset({
      imeis: '',
      masterAgent: '',
      distributor: '',
      retailer: '',
      employee: { id: '' },
    });
  }

  changePage(event: PageEvent): void {
    this.loadBatchAssignRecords(event.pageIndex, event.pageSize);
  }

  submitReAssign(): void {
    if (this.reAssignForm.valid) {
      const formValues = this.reAssignForm.value;
      const imeis = formValues.imeis
        .split('\n')
        .map((imei: string) => imei.trim())
        .filter((imei: any) => imei);
      const totalRecords = imeis.length;

      let outcomes: Observable<UpdatePhoneResponse>[] = imeis.map(
        (imei: string) => {
          const updatePayload = {
            imei,
            ...(formValues.masterAgent && {
              masterAgent: formValues.masterAgent,
            }),
            ...(formValues.distributor && {
              distributor: formValues.distributor,
            }),
            ...(formValues.retailer && {
              retailer: formValues.retailer,
            }),
            ...(formValues.employee?.id && {
              employee: { id: formValues.employee.id },
            }),
          };

          return this.inventoryService.updatePhone(imei, updatePayload).pipe(
            map(response => ({ success: true, imei })),
            catchError(() => of({ success: false, imei }))
          );
        }
      );

      forkJoin(outcomes).subscribe(results => {
        const successes = results.filter(result => result.success).length;
        const failures = totalRecords - successes;

        this.snackBar.open(
          `${successes} out of ${totalRecords} records updated successfully!`,
          'Close',
          {
            duration: 3000,
          }
        );

        if (failures > 0) {
          this.snackBar.open(
            `${failures} out of ${totalRecords} records failed to update.`,
            'Close',
            {
              duration: 3000,
            }
          );
        }

        const assignedToValues = [
          formValues.masterAgent,
          formValues.distributor,
          formValues.retailer,
          formValues.employee.id,
        ].filter(v => v);
        this.assignedTo = assignedToValues.length > 0 ? assignedToValues[0] : undefined;

        const batchOutcomes = results.map(result => result.success);

        const batchAssignCreateRequest: BatchAssignCreateRequest = {
          batchAssign: {
            assignedTo: this.assignedTo,
            totalRecords,
            uploadedSuccess: successes,
            uploadedFailure: failures,
          },
          imeis,
          outcomes: batchOutcomes,
        };

        this.batchAssignService.createBatchAssign(batchAssignCreateRequest).subscribe({
          next: (updatedBatch: any) => {
            console.log('Batch updated successfully', updatedBatch);
            this.snackBar.open('Batch assign record created successfully!', 'Close', { duration: 3000 });
            this.loadBatchAssignRecords(0, this.pageSize);
            this.employeesList = this.fetchAllAgencies();
            this.resetReAssignForm();
          },
          error: (error: any) => {
            console.error('Error updating batch', error);
            this.snackBar.open('Error creating batch assign record. Please try again.', 'Close', { duration: 3000 });
          },
        });
      });
    } else {
      this.snackBar.open('Form is not valid. Please check the inputs and try again.', 'Close', { duration: 3000 });
    }
  }


  loadInventory(page: number, size: number): void {
    this.inventoryService.getAllPhones(page, size).subscribe(
      (data) => {
        this.phones = data.content;
        this.totalElements = data.totalElements;
        this.pageSize = data.size;
        this.currentPage = data.number;

        this.fetchAllAgencies();
        this.loadDropdownData();

        this.showTable = true;
      },
      (error) => {
        console.error('Error fetching inventory:', error);
      }
    );
  }

  fetchAllAgencies(): Agency[] {
    this.agencyService.getAllAgencies(0, 100000000).subscribe(
      (response) => {
        const agencies = response.content;

        const uniqueAgencies = new Map<number, Agency>();
        agencies.forEach((agency: Agency) => {
          if (agency && !uniqueAgencies.has(agency.id!)) {
            uniqueAgencies.set(agency.id!, agency);
          }
        });

        this.employeesList = Array.from(uniqueAgencies.values());
      },
      (error) => {
        console.error('Error fetching agencies:', error);
      }
    );
    return this.employeesList;
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

  // --------------------------------------------- CSV/EXCEL ---------------------------------------------------- //

  handleFileInput(files: FileList) {
    const file = files.item(0);
    if (file) {
      this.selectedFileName = file.name;
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
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFileInput(event.dataTransfer.files);
    }
  }

  onDragLeave(event: DragEvent) {
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
      this.processData(data);
    };
    reader.readAsBinaryString(file);
  }

  parseCSVFile(file: File) {
    Papa.parse(file, {
      complete: (result: any) => {
        console.log('Parsed CSV:', result);
        this.processData(result.data);
      },
    });
  }

  processData(data: any[]) {
    const headers = data[0].map((header: string) => header.toLowerCase());
    const rows = data.slice(1);

    const phones = rows.map((row) => {
      let phone: any = {};
      row.forEach((cell: any, index: number) => {
        const header = headers[index];
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
      this.inventoryService.addPhonesBatch(this.parsedPhones).subscribe(
        (data) => {
          console.log('Phones added successfully', data);
          this.loadInventory(this.currentPage, this.pageSize);
          this.addPhoneForm.reset();
          this.clearFileInput();
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
      this.inventoryService.updatePhonesBatch(this.parsedPhones).subscribe(
        (data) => {
          console.log('Inventory (re)assigned successfully', data);
          this.loadInventory(this.currentPage, this.pageSize);
          this.addPhoneForm.reset();
          this.clearFileInput();
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

          const dataWithAge = dataToExport.map((phone) => ({
            ...phone,
            date: phone.date ? this.formatDateForExport(phone.date) : 'N/A',
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

  downloadReport(batchAssignId: number, type: 'success' | 'failure'): void {
    this.batchAssignService.getBatchAssignById(batchAssignId).subscribe({
      next: (batchAssign) => {

        console.log(`Received batch assign data for ID ${batchAssignId}:`, batchAssign);

        const filteredDetails =
          batchAssign.details?.filter((detail) =>
            type === 'success' ? detail.success : !detail.success
          ) ?? [];

          console.log(`Filtered details for '${type}' report:`, filteredDetails);

        this.generateExcelReport(
          filteredDetails,
          batchAssign.assignedTo ?? '',
          batchAssignId,
          type
        );
      },
      error: (error) => {
        console.error('Error fetching batch assign details:', error);
      },
    });
  }

  generateExcelReport(
    details: any[],
    assignedTo: string,
    batchAssignId: number,
    type: 'success' | 'failure'
  ): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Batch Assign Report');

    // Define columns
    worksheet.columns = [
      { header: 'IMEI', key: 'imei', width: 20 },
      { header: 'Assigned To', key: 'assignedTo', width: 30 },
    ];

    // Add rows with name replacement for employee ID
    details.forEach((detail) => {
      // Check if assignedTo is numeric, implying it's an ID that needs name replacement
      let assignedToName = assignedTo;
      if (this.isNumeric(assignedTo)) {
        const employee = this.employeesList.find(
          (e) => e.id === Number(assignedTo)
        );
        assignedToName = employee?.name ?? 'Unknown Employee'; // Use nullish coalescing operator
      }
      worksheet.addRow({ imei: detail.imei, assignedTo: assignedToName });
    });

    // Write to buffer and save as Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      console.log('Generating report for type:', type);
      FileSaver.saveAs(
        blob,
        `batch_assign_report_${batchAssignId}_${type}_${new Date().toISOString()}.xlsx`
      );
    });
  }
}
