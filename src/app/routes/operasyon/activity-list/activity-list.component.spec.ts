import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OperasyonActivityListComponent } from './activity-list.component';

describe('OperasyonActivityListComponent', () => {
  let component: OperasyonActivityListComponent;
  let fixture: ComponentFixture<OperasyonActivityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperasyonActivityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperasyonActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
