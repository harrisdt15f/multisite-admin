import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeveloperPlayLevelComponent } from './play-level.component';

describe('DeveloperPlayLevelComponent', () => {
  let component: DeveloperPlayLevelComponent;
  let fixture: ComponentFixture<DeveloperPlayLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeveloperPlayLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeveloperPlayLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
