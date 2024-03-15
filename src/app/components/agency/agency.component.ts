import { Component, OnInit, ViewChild } from '@angular/core';
import { AgencyService } from 'src/app/services/agency.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.css']
})
export class AgencyComponent implements OnInit {
  agencies: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'username', 'level', 'role', 'blocked'];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private agencyService: AgencyService) {}

  ngOnInit(): void {
    this.loadAgencies(this.currentPage, this.pageSize);
  }

  loadAgencies(page: number, size: number): void {
    this.agencyService.getAllAgencies(page, size).subscribe(data => {
      this.agencies = data.content;
      this.totalElements = data.totalElements;
      this.pageSize = data.size;
      this.currentPage = data.number;
    });
  }

  changePage(event: PageEvent): void {
    this.loadAgencies(event.pageIndex, event.pageSize);
  }
}
