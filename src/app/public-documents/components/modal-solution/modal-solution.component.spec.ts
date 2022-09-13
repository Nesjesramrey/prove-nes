import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSolutionComponent } from './modal-solution.component';

describe('ModalSolutionComponent', () => {
  let component: ModalSolutionComponent;
  let fixture: ComponentFixture<ModalSolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSolutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
