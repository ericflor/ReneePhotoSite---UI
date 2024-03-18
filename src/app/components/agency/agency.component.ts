import { Component, OnInit, ViewChild } from '@angular/core';
import { AgencyService } from 'src/app/services/agency.service';
import { MatDialog } from '@angular/material/dialog';
import {
  MatPaginator as MatPaginator,
  PageEvent as PageEvent,
} from '@angular/material/paginator';
import { CreateAgencyDialogComponent } from '../create-agency-dialog/create-agency-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditAgencyDialogComponent } from '../edit-agency-dialog/edit-agency-dialog.component';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.css'],
})
export class AgencyComponent implements OnInit {
  agencies: any[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'username',
    'level',
    'role',
    'blocked',
    'action',
  ];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private agencyService: AgencyService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAgencies(this.currentPage, this.pageSize);
  }

  createAgency(): void {
    const dialogRef = this.dialog.open(CreateAgencyDialogComponent, {
      width: '777px',
      // Add any data or configuration needed
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.agencyService.createAgency(result).subscribe({
          next: (newAgency) => {
            // Assuming your API responds with the newly created agency
            this.loadAgencies(this.currentPage, this.pageSize); // Refresh list
            this.snackBar.open('Agency created successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          },
          error: (error) => {
            console.error('Error creating agency:', error);
            this.snackBar.open('Failed to create agency', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          },
        });
      }
    });
  }

  editAgency(agency: any): void {
    const dialogRef = this.dialog.open(EditAgencyDialogComponent, {
      width: '777px',
      data: { agency }, // Passing the current agency data to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.agencyService.updateAgency(agency.id, result).subscribe({
          next: () => {
            this.loadAgencies(this.currentPage, this.pageSize); // Refresh list
            this.snackBar.open('Agency updated successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          },
          error: (errorResponse) => {
            // Assuming the backend sends a specific error structure. Adjust according to your actual API response.
            let errorMessage = 'Failed to update agency';
            if (
              errorResponse.error &&
              typeof errorResponse.error === 'string'
            ) {
              errorMessage = errorResponse.error;
            } else if (errorResponse.error && errorResponse.error.message) {
              errorMessage = errorResponse.error.message;
            }

            this.snackBar.open(errorMessage, 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          },
        });
      }
    });
  }

  blockAgency(id: number): void {
    // Confirm before blocking
    const confirmation = confirm('Are you sure you want to block this agency?');
    if (confirmation) {
      this.agencyService.updateAgency(id, { blocked: true }).subscribe({
        next: () => {
          this.snackBar.open('Agency blocked successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.loadAgencies(this.currentPage, this.pageSize); // Refresh the list to reflect the blocked status
        },
        error: () => {
          this.snackBar.open('Failed to block the agency', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
      });
    }
  }

  unblockAgency(id: number): void {
    const confirmation = confirm('Are you sure you want to unblock this agency?');
    if (confirmation) {
      this.agencyService.updateAgency(id, { blocked: false }).subscribe({
        next: () => {
          this.snackBar.open('Agency unblocked successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.loadAgencies(this.currentPage, this.pageSize); // Refresh the list to reflect the unblocked status
        },
        error: () => {
          this.snackBar.open('Failed to unblock the agency', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      });
    }
  }


  loadAgencies(page: number, size: number): void {
    this.agencyService.getAllAgencies(page, size).subscribe((data) => {
      this.agencies = data.content;
      this.totalElements = data.totalElements;
      this.pageSize = data.size;
      this.currentPage = data.number;
    });
  }

  changePage(event: PageEvent): void {
    this.loadAgencies(event.pageIndex, event.pageSize);
  }

  deleteAgency(id: number): void {
    const confirmation = confirm(
      'Are you sure you want to delete this agency?'
    );
    if (confirmation) {
      this.agencyService.deleteAgency(id).subscribe({
        next: () => {
          this.snackBar.open('Agency deleted successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.loadAgencies(this.currentPage, this.pageSize); // Refresh the list after deletion
        },
        error: () => {
          this.snackBar.open('Failed to delete the agency', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
      });
    }
  }
}
