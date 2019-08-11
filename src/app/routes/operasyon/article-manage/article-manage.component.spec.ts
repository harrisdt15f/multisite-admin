import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OperasyonArticleManageComponent } from './article-manage.component';

describe('OperasyonArticleManageComponent', () => {
  let component: OperasyonArticleManageComponent;
  let fixture: ComponentFixture<OperasyonArticleManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperasyonArticleManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperasyonArticleManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
