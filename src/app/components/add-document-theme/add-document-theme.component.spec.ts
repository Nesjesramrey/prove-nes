import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDocumentThemeComponent } from './add-document-theme.component';

describe('AddDocumentThemeComponent', () => {
  let component: AddDocumentThemeComponent;
  let fixture: ComponentFixture<AddDocumentThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDocumentThemeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDocumentThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
