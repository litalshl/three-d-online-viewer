import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastPatientModelComponent } from './last-patient-model.component';

describe('LastPatientModelComponent', () => {
  let component: LastPatientModelComponent;
  let fixture: ComponentFixture<LastPatientModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastPatientModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastPatientModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
