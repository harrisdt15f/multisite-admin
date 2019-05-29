import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OperasyonAnnouncementManageComponent } from './announcement-manage.component';

describe('OperasyonAnnouncementManageComponent', () => {
  let component: OperasyonAnnouncementManageComponent;
  let fixture: ComponentFixture<OperasyonAnnouncementManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperasyonAnnouncementManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperasyonAnnouncementManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
