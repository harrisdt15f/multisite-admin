import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeveloperDragComponent } from './drag.component';

describe('DeveloperDragComponent', () => {
  let component: DeveloperDragComponent;
  let fixture: ComponentFixture<DeveloperDragComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeveloperDragComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeveloperDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
