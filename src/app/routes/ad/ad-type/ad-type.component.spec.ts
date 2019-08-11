import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdAdTypeComponent } from './ad-type.component';

describe('AdAdTypeComponent', () => {
  let component: AdAdTypeComponent;
  let fixture: ComponentFixture<AdAdTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdAdTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdAdTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
