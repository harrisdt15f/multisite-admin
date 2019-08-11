import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GameLotteryIssueComponent } from './lottery-issue.component';

describe('GameLotteryIssueComponent', () => {
  let component: GameLotteryIssueComponent;
  let fixture: ComponentFixture<GameLotteryIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameLotteryIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameLotteryIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
