import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRepositoryComponent } from './home-repository.component';

describe('HomeRepositoryComponent', () => {
  let component: HomeRepositoryComponent;
  let fixture: ComponentFixture<HomeRepositoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeRepositoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
