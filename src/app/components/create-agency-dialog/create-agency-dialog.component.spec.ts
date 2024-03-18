import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAgencyDialogComponent } from './create-agency-dialog.component';

describe('CreateAgencyDialogComponent', () => {
  let component: CreateAgencyDialogComponent;
  let fixture: ComponentFixture<CreateAgencyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAgencyDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAgencyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
