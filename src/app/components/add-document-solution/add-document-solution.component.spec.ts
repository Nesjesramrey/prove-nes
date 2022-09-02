import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDocumentSolutionComponent } from './add-document-solution.component';

describe('AddDocumentSolutionComponent', () => {
  let component: AddDocumentSolutionComponent;
  let fixture: ComponentFixture<AddDocumentSolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDocumentSolutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDocumentSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
