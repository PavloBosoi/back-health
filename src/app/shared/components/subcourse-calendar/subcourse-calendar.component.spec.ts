import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcourseCalendarComponent } from './subcourse-calendar.component';

describe('SubcourseCalendarComponent', () => {
  let component: SubcourseCalendarComponent;
  let fixture: ComponentFixture<SubcourseCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcourseCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcourseCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
