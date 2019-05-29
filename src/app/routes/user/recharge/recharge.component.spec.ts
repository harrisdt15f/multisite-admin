import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserRechargeComponent } from './recharge.component';

describe('UserRechargeComponent', () => {
  let component: UserRechargeComponent;
  let fixture: ComponentFixture<UserRechargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRechargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
