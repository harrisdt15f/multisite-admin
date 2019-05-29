import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAccountTypeComponent } from './account-type.component';

describe('UserAccountTypeComponent', () => {
  let component: UserAccountTypeComponent;
  let fixture: ComponentFixture<UserAccountTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccountTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
