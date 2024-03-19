import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import {
  MatPaginator as MatPaginator,
  PageEvent as PageEvent,
} from '@angular/material/paginator';
import { Order } from 'src/app/models/order';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditOrderFormComponent } from '../edit-order-form/edit-order-form.component';
import { AuthGuardService } from 'src/app/services/authGuard.service';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  displayedColumns: string[] = [
    'info',
    'etcName',
    'quantity',
    'status',
    'note',
    'action',
  ];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  statusOptions = ['', 'NEW', 'APPROVED', 'SHIPPED', 'DENIED'];
  filterValue = '';
  selectedStatus = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  order: any;

  constructor(
    private authService: AuthGuardService,
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadOrders(this.currentPage, this.pageSize);
  }

  // If logged in user is employee, they should only be able to see the table
  get isEmployee(): boolean {
    return this.authService.hasRole('ROLE_EMPLOYEE');
  }

  loadOrders(page: number, size: number): void {
    this.orderService.getAllOrders(page, size).subscribe(
      (data) => {
        this.orders = data.content;
        this.totalElements = data.totalElements;
        this.pageSize = data.size;
        this.currentPage = data.number;
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  changePage(event: PageEvent): void {
    this.loadOrders(event.pageIndex, event.pageSize);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue.trim().toLowerCase();
    this.loadFilteredOrders();
  }

  filterStatus(status: string) {
    this.selectedStatus = status;
    this.loadFilteredOrders();
  }

  loadFilteredOrders() {
    // Start with all orders or a fresh fetch if you decide to not always filter locally
    let currentOrders = [...this.orders];

    // Apply text filter
    if (this.filterValue) {
      currentOrders = currentOrders.filter(order =>
        Object.values(order).some(val => val.toString().toLowerCase().includes(this.filterValue))
      );
    }

    // Apply status filter
    if (this.selectedStatus) {
      currentOrders = currentOrders.filter(order => order.status === this.selectedStatus);
    }

    // Update UI with filtered orders
    this.orders = currentOrders;
    // Adjust the paginator
    this.totalElements = currentOrders.length;
  }


  clearFilters() {
    this.filterValue = '';
    this.selectedStatus = '';
    this.loadOrders(this.currentPage, this.pageSize);
  }


  createOrder(): void {
    const dialogRef = this.dialog.open(EditOrderFormComponent, {
      width: '777px',
      data: { order: {Order} }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderService.addOrder(result).subscribe({
          next: (newOrder) => {
            this.orders.unshift(newOrder);
            this.changeDetectorRefs.detectChanges();
            this.loadOrders(this.currentPage, this.pageSize);
            this.snackBar.open('Order created successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          },
          error: (error) => {
            console.error('Error creating order:', error);
            this.snackBar.open('Failed to create order', 'Close', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          }
        });
      }
    });
  }


  editOrder(order: Order): void {
    const dialogRef = this.dialog.open(EditOrderFormComponent, {
      width: '777px',
      data: { order },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog closed with result:', result);
        // Ensure that the result includes the 'id'
        if (!result.id) {
          console.error('Order ID is missing in the result.');
          return;
        }
        // Now result includes the 'id', so we can proceed to update the order
        this.updateOrderStatus(result, `Order ${result.id} updated successfully.`);
      }
    });
  }

  approveOrder(order: Order): void {
    const updatedOrder: Partial<Order> = {
      id: order.id,
      status: Order.StatusEnum.Approved,
    };
    this.updateOrderStatus(updatedOrder, 'Order approved successfully');
  }

  denyOrder(order: Order): void {
    const updatedOrder: Partial<Order> = {
      id: order.id,
      status: Order.StatusEnum.Denied,
    };
    this.updateOrderStatus(updatedOrder, 'Order denied');
  }

  private updateOrderStatus(order: Partial<Order>, message: string): void {
    // Make sure updatedOrder includes an 'id' property that is a number, not 'undefined' or a string.
    if (!order.id) {
      console.error('Order ID is undefined.');
      return;
    }
    this.orderService.updateOrder(order.id!, order).subscribe({
      next: (updatedOrder) => {
        // Update the orders array with the updated order status
        const index = this.orders.findIndex((o) => o.id === updatedOrder.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
          this.changeDetectorRefs.detectChanges();
          this.loadOrders(this.currentPage, this.pageSize);
        }
        this.snackBar.open(message, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        this.snackBar.open('Failed to update order status', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }

  updateTrackingNumber(order: Order): void {
    if (!order.trackingNumber) {
      this.snackBar.open('Please enter a tracking number.', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }

    const updatedOrder: Partial<Order> = {
      id: order.id,
      trackingNumber: order.trackingNumber,
    };

    this.orderService.updateOrder(order.id!, updatedOrder).subscribe({
      next: (updatedOrder) => {
        // Find and update the order in the local array
        const index = this.orders.findIndex((o) => o.id === updatedOrder.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
          this.changeDetectorRefs.detectChanges();
        }
        this.snackBar.open('Tracking number updated successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: (error) => {
        let errorMessage = 'Failed to update tracking number'; // Default error message
        if (error.error && typeof error.error === 'string') {
          // If the error object contains a string message, use it
          errorMessage = error.error;
        } else if (error.error && error.error.error && typeof error.error.error === 'string') {
          // For more deeply nested error messages
          errorMessage = error.error.error;
        }
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
    });
  }

}
