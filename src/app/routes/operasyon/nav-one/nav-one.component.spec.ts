import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OperasyonNavOneComponent } from './nav-one.component';

describe('OperasyonNavOneComponent', () => {
  let component: OperasyonNavOneComponent;
  let fixture: ComponentFixture<OperasyonNavOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperasyonNavOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperasyonNavOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
