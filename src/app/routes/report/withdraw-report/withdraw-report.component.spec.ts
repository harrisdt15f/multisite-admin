import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportWithdrawReportComponent } from './withdraw-report.component';

describe('ReportWithdrawReportComponent', () => {
  let component: ReportWithdrawReportComponent;
  let fixture: ComponentFixture<ReportWithdrawReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportWithdrawReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportWithdrawReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
