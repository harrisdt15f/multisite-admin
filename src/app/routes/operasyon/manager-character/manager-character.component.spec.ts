import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagerManagerCharacterComponent } from './manager-character.component';

describe('ManagerManagerCharacterComponent', () => {
  let component: ManagerManagerCharacterComponent;
  let fixture: ComponentFixture<ManagerManagerCharacterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerManagerCharacterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerManagerCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
