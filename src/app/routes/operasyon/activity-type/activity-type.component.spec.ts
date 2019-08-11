import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OperasyonActivityTypeComponent } from './activity-type.component';

describe('OperasyonActivityTypeComponent', () => {
  let component: OperasyonActivityTypeComponent;
  let fixture: ComponentFixture<OperasyonActivityTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperasyonActivityTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperasyonActivityTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
