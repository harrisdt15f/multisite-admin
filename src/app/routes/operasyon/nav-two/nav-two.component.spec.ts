import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OperasyonNavTwoComponent } from './nav-two.component';

describe('OperasyonNavTwoComponent', () => {
  let component: OperasyonNavTwoComponent;
  let fixture: ComponentFixture<OperasyonNavTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperasyonNavTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperasyonNavTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
