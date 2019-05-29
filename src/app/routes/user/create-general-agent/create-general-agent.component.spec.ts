import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCreateGeneralAgentComponent } from './create-general-agent.component';

describe('UserCreateGeneralAgentComponent', () => {
  let component: UserCreateGeneralAgentComponent;
  let fixture: ComponentFixture<UserCreateGeneralAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCreateGeneralAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreateGeneralAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
