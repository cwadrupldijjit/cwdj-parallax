import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParallaxDirective } from './cwdj-parallax.directive';

describe('ParallaxDirective', () => {
  let component: ParallaxDirective;
  let fixture: ComponentFixture<ParallaxDirective>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParallaxDirective ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParallaxDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
