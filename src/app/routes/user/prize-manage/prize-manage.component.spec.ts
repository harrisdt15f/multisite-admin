import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserPrizeManageComponent } from './prize-manage.component';

describe('UserPrizeManageComponent', () => {
  let component: UserPrizeManageComponent;
  let fixture: ComponentFixture<UserPrizeManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPrizeManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPrizeManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
