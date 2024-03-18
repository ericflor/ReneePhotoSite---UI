import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAgencyDialogComponent } from './edit-agency-dialog.component';

describe('EditAgencyDialogComponent', () => {
  let component: EditAgencyDialogComponent;
  let fixture: ComponentFixture<EditAgencyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAgencyDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAgencyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
