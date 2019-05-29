import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserRechargeCheckComponent } from './recharge-check.component';

describe('UserRechargeCheckComponent', () => {
  let component: UserRechargeCheckComponent;
  let fixture: ComponentFixture<UserRechargeCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRechargeCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRechargeCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
