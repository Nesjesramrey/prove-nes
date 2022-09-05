import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'carousel-component',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
  public currentScroll: number = 0;
  public showNext: boolean = false; // max scroll
  @Input() contentSize: number = 150;
  @ViewChild('contentScroll') public contentScroll!: ElementRef<HTMLDivElement>;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const { clientWidth } = this.contentScroll.nativeElement;

    this.showNext = this.contentSize > clientWidth;
  }

  onElementScroll() {
    const { clientWidth, scrollLeft } = this.contentScroll.nativeElement;

    this.currentScroll = scrollLeft;

    this.showNext = this.contentSize - clientWidth >= scrollLeft;
  }

  onBack() {
    const { scrollLeft } = this.contentScroll.nativeElement;

    this.contentScroll.nativeElement.scrollLeft =
      scrollLeft > 100 ? scrollLeft - 100 : 0;
  }

  onNext() {
    const { clientWidth, scrollLeft } = this.contentScroll.nativeElement;

    const max = this.contentSize - clientWidth;

    this.contentScroll.nativeElement.scrollLeft =
      max == scrollLeft ? max : scrollLeft + 100;

  }
}
