import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarsRowComponent } from './avatars-row.component';

describe('AvatarsRowComponent', () => {
  let component: AvatarsRowComponent;
  let fixture: ComponentFixture<AvatarsRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvatarsRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarsRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
