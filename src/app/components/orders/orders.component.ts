import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  displayedColumns: string[] = [
    'id',
    'companyName',
    'nameOfRecipient',
    'phoneNumber',
    'email',
    'address',
    'city',
    'state',
    'zipCode',
    'nameETC',
    'quantity',
    'notes',
    'trackingNumber',
    'status'
  ];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders(this.currentPage, this.pageSize);
  }

  loadOrders(page: number, size: number): void {
    this.orderService.getAllOrders(page, size).subscribe(data => {
      this.orders = data.content;
      this.totalElements = data.totalElements;
      this.pageSize = data.size;
      this.currentPage = data.number;
    }, error => {
      console.error('Error fetching orders:', error);
    });
  }

  changePage(event: PageEvent): void {
    this.loadOrders(event.pageIndex, event.pageSize);
  }
}
