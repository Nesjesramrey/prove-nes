import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDocumentTestimonyComponent } from './add-document-testimony.component';

describe('AddDocumentTestimonyComponent', () => {
  let component: AddDocumentTestimonyComponent;
  let fixture: ComponentFixture<AddDocumentTestimonyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDocumentTestimonyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDocumentTestimonyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
