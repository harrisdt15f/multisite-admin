import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportAccountReportComponent } from './account-report.component';

describe('ReportAccountReportComponent', () => {
  let component: ReportAccountReportComponent;
  let fixture: ComponentFixture<ReportAccountReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportAccountReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAccountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
