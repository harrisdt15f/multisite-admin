import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCityListComponent } from './city-list.component';

describe('UserCityListComponent', () => {
  let component: UserCityListComponent;
  let fixture: ComponentFixture<UserCityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
