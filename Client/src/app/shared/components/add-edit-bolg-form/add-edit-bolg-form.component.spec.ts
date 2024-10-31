import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBolgFormComponent } from './add-edit-bolg-form.component';

describe('AddEditBolgFormComponent', () => {
  let component: AddEditBolgFormComponent;
  let fixture: ComponentFixture<AddEditBolgFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditBolgFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditBolgFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
