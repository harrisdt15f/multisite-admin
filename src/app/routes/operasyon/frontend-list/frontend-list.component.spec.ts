import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OperasyonFrontendListComponent } from './frontend-list.component';

describe('OperasyonFrontendListComponent', () => {
  let component: OperasyonFrontendListComponent;
  let fixture: ComponentFixture<OperasyonFrontendListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperasyonFrontendListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperasyonFrontendListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
