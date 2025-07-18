import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateComponent } from './update';

describe('Update', () => {
  let component: UpdateComponent;
  let fixture: ComponentFixture<UpdateComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
