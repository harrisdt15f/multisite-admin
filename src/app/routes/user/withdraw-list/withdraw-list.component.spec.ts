import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserWithdrawListComponent } from './withdraw-list.component';

describe('UserWithdrawListComponent', () => {
  let component: UserWithdrawListComponent;
  let fixture: ComponentFixture<UserWithdrawListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserWithdrawListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWithdrawListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
