import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeveloperBettingMenuComponent } from './betting-menu.component';

describe('DeveloperBettingMenuComponent', () => {
  let component: DeveloperBettingMenuComponent;
  let fixture: ComponentFixture<DeveloperBettingMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeveloperBettingMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeveloperBettingMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
