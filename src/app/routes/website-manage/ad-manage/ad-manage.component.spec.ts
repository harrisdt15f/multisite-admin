import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WebsiteManageAdManageComponent } from './ad-manage.component';

describe('WebsiteManageAdManageComponent', () => {
  let component: WebsiteManageAdManageComponent;
  let fixture: ComponentFixture<WebsiteManageAdManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsiteManageAdManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteManageAdManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
