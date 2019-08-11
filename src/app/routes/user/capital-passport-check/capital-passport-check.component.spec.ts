import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCapitalPassportCheckComponent } from './capital-passport-check.component';

describe('UserCapitalPassportCheckComponent', () => {
  let component: UserCapitalPassportCheckComponent;
  let fixture: ComponentFixture<UserCapitalPassportCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCapitalPassportCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCapitalPassportCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
