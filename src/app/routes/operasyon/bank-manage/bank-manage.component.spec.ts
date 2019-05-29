import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OperasyonBankManageComponent } from './bank-manage.component';

describe('OperasyonBankManageComponent', () => {
  let component: OperasyonBankManageComponent;
  let fixture: ComponentFixture<OperasyonBankManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperasyonBankManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperasyonBankManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
