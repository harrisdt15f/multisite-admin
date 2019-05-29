import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LogOperationLogComponent } from './operation-log.component';

describe('LogOperationLogComponent', () => {
  let component: LogOperationLogComponent;
  let fixture: ComponentFixture<LogOperationLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogOperationLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogOperationLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
