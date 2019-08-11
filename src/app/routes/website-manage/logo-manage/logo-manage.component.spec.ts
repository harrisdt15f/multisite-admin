import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WebsiteManageLogoManageComponent } from './logo-manage.component';

describe('WebsiteManageLogoManageComponent', () => {
  let component: WebsiteManageLogoManageComponent;
  let fixture: ComponentFixture<WebsiteManageLogoManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebsiteManageLogoManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteManageLogoManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
