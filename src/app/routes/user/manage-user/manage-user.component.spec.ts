import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManageUserComponent } from './manage-user.component';

describe('UserManageUserComponent', () => {
  let component: UserManageUserComponent;
  let fixture: ComponentFixture<UserManageUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserManageUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManageUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
