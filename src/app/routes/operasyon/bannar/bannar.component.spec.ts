import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OperasyonBannarComponent } from './bannar.component';

describe('OperasyonBannarComponent', () => {
  let component: OperasyonBannarComponent;
  let fixture: ComponentFixture<OperasyonBannarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperasyonBannarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperasyonBannarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
