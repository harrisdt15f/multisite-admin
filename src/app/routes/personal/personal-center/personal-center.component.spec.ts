import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalPersonalCenterComponent } from './personal-center.component';

describe('PersonalPersonalCenterComponent', () => {
  let component: PersonalPersonalCenterComponent;
  let fixture: ComponentFixture<PersonalPersonalCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalPersonalCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalPersonalCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
