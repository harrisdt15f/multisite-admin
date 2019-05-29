import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OperasyonCategoryManageComponent } from './category-manage.component';

describe('OperasyonCategoryManageComponent', () => {
  let component: OperasyonCategoryManageComponent;
  let fixture: ComponentFixture<OperasyonCategoryManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperasyonCategoryManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperasyonCategoryManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
