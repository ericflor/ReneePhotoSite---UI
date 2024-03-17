import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { MatPaginator as MatPaginator, PageEvent as PageEvent } from '@angular/material/paginator';
import { Order } from 'src/app/models/order';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  order: any;

  constructor(private orderService: OrderService,
    private snackBar: MatSnackBar,
    private changeDetectorRefs: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadOrders(this.currentPage, this.pageSize);
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

  editOrder(order: Order): void {
    console.log("EDIT ORDER");
  }

  approveOrder(order: Order): void {
    const updatedOrder: Partial<Order> = {
      id: order.id,
      status: Order.StatusEnum.Approved
    };
    this.updateOrderStatus(updatedOrder, 'Order approved successfully');
  }

  denyOrder(order: Order): void {
    const updatedOrder: Partial<Order> = {
      id: order.id,
      status: Order.StatusEnum.Denied
    };
    this.updateOrderStatus(updatedOrder, 'Order denied');
  }

  private updateOrderStatus(order: Partial<Order>, message: string): void {
    this.orderService.updateOrder(order.id!, order).subscribe({
      next: (updatedOrder) => {
        // Update the orders array with the updated order status
        const index = this.orders.findIndex(o => o.id === updatedOrder.id);
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
      }
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
      trackingNumber: order.trackingNumber
    };

    // Assume updateOrder is a method in OrderService that makes a PATCH request to update the order
    this.orderService.updateOrder(order.id!, updatedOrder).subscribe({
      next: (updatedOrder) => {
        // Find and update the order in the local array
        const index = this.orders.findIndex(o => o.id === updatedOrder.id);
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
      error: () => {
        this.snackBar.open('Failed to update tracking number', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    });
  }

}
