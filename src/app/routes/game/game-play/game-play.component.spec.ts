import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GameGamePlayComponent } from './game-play.component';

describe('GameGamePlayComponent', () => {
  let component: GameGamePlayComponent;
  let fixture: ComponentFixture<GameGamePlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameGamePlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameGamePlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
