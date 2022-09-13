import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVotesComponent } from './modal-votes.component';

describe('ModalVotesComponent', () => {
  let component: ModalVotesComponent;
  let fixture: ComponentFixture<ModalVotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalVotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalVotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
