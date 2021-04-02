import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArondorArenderViewerComponent } from './arondor-arender-viewer.component';

describe('ArondorArenderViewerComponent', () => {
  let component: ArondorArenderViewerComponent;
  let fixture: ComponentFixture<ArondorArenderViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArondorArenderViewerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArondorArenderViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
