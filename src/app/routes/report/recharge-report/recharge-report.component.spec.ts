import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportRechargeReportComponent } from './recharge-report.component';

describe('ReportRechargeReportComponent', () => {
  let component: ReportRechargeReportComponent;
  let fixture: ComponentFixture<ReportRechargeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportRechargeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportRechargeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
