import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OperasyonOperasyonSettingComponent } from './operasyon-setting.component';

describe('OperasyonOperasyonSettingComponent', () => {
  let component: OperasyonOperasyonSettingComponent;
  let fixture: ComponentFixture<OperasyonOperasyonSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperasyonOperasyonSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperasyonOperasyonSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
