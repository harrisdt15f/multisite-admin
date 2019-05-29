import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeveloperDeveloperMenuComponent } from './developer-menu.component';

describe('DeveloperDeveloperMenuComponent', () => {
  let component: DeveloperDeveloperMenuComponent;
  let fixture: ComponentFixture<DeveloperDeveloperMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeveloperDeveloperMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeveloperDeveloperMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
