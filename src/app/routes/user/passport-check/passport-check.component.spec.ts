import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserPassportCheckComponent } from './passport-check.component';

describe('UserPassportCheckComponent', () => {
  let component: UserPassportCheckComponent;
  let fixture: ComponentFixture<UserPassportCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPassportCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPassportCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
