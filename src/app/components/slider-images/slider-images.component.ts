import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'slider-images',
  templateUrl: './slider-images.component.html',
  styleUrls: ['./slider-images.component.scss'],
})
export class SliderImagesComponent implements OnInit {
  public currentScroll: number = 0;
  public showNext: boolean = true; // max scroll
  public activeIndex: number = 0;
  @Input() images: string[] = [];
  @ViewChild('contentScroll') public contentScroll!: ElementRef<HTMLDivElement>;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    // const { clientWidth } = this.contentScroll.nativeElement;
    // this.showNext = this.contentSize > clientWidth;
  }

  onBack() {
    const imagesLength = this.images.length - 1;

    this.activeIndex =
      this.activeIndex == 0 ? imagesLength : this.activeIndex - 1;
  }

  onNext() {
    const imagesLength = this.images.length - 1;

    this.activeIndex =
      this.activeIndex + 1 > imagesLength ? 0 : this.activeIndex + 1;
  }
}
