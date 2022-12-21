import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '.testimonial-image-slider',
  templateUrl: './testimonial-image-slider.component.html',
  styleUrls: ['./testimonial-image-slider.component.scss']
})
export class TestimonialImageSliderComponent implements OnInit {
  @Input('images') images: string[] = [];
  public activeIndex: number = 0;

  constructor() { }

  ngOnInit(): void { }

  previousImage() {
    const imagesLength = this.images.length - 1;
    this.activeIndex = this.activeIndex == 0 ? imagesLength : this.activeIndex - 1;
  }

  nextImage() {
    const imagesLength = this.images.length - 1;
    this.activeIndex = this.activeIndex + 1 > imagesLength ? 0 : this.activeIndex + 1;
  }
}
