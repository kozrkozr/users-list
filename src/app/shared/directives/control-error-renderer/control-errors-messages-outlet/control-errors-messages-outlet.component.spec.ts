import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlErrorsMessagesOutletComponent } from './control-errors-messages-outlet.component';

describe('ControlErrorsMessagesOutletComponent', () => {
  let component: ControlErrorsMessagesOutletComponent;
  let fixture: ComponentFixture<ControlErrorsMessagesOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlErrorsMessagesOutletComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ControlErrorsMessagesOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
