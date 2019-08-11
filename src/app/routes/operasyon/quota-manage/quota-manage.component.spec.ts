import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OperasyonQuotaManageComponent } from './quota-manage.component';

describe('OperasyonQuotaManageComponent', () => {
  let component: OperasyonQuotaManageComponent;
  let fixture: ComponentFixture<OperasyonQuotaManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperasyonQuotaManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperasyonQuotaManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
