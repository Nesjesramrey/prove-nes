import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPermissionComponent } from './modal-permission.component';

describe('ModalPermissionComponent', () => {
  let component: ModalPermissionComponent;
  let fixture: ComponentFixture<ModalPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
