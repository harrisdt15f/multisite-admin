import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OperasyonPageModelComponent } from './page-model.component';

describe('OperasyonPageModelComponent', () => {
  let component: OperasyonPageModelComponent;
  let fixture: ComponentFixture<OperasyonPageModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperasyonPageModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperasyonPageModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
