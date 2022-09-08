import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTestimonyComponent } from './modal-testimony.component';

describe('ModalTestimonyComponent', () => {
  let component: ModalTestimonyComponent;
  let fixture: ComponentFixture<ModalTestimonyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTestimonyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTestimonyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
