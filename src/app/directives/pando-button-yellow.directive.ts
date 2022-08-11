import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: "[pandoButtonYellow]"
})
export class RedColorDirective {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    renderer.setStyle(el.nativeElement, 'background', '#ff0000');
  }
}
