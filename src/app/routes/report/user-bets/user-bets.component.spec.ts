import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportUserBetsComponent } from './user-bets.component';

describe('ReportUserBetsComponent', () => {
  let component: ReportUserBetsComponent;
  let fixture: ComponentFixture<ReportUserBetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportUserBetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportUserBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
