import { Component, OnInit, ViewChild } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Phone } from 'src/app/models/phone';

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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadInventory(this.currentPage, this.pageSize);
  }

  loadInventory(page: number, size: number): void {
    this.inventoryService.getAllPhones(page, size).subscribe(data => {
      this.phones = data.content;
      this.totalElements = data.totalElements;
      this.pageSize = data.size;
      this.currentPage = data.number;
    }, error => {
      console.error('Error fetching inventory:', error);
    });
  }

  changePage(event: PageEvent): void {
    this.loadInventory(event.pageIndex, event.pageSize);
  }
}
