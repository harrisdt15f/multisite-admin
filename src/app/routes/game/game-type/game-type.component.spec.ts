import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GameGameTypeComponent } from './game-type.component';

describe('GameGameTypeComponent', () => {
  let component: GameGameTypeComponent;
  let fixture: ComponentFixture<GameGameTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameGameTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameGameTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
