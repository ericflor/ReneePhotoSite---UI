import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhoneFormComponent } from './edit-phone-form.component';

describe('EditPhoneFormComponent', () => {
  let component: EditPhoneFormComponent;
  let fixture: ComponentFixture<EditPhoneFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPhoneFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPhoneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
