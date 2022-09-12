import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DocumentService } from 'src/app/services/document.service';
import { UtilityService } from 'src/app/services/utility.service';

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
  @Input() document: any = null;
  @ViewChild('contentScroll') public contentScroll!: ElementRef<HTMLDivElement>;

  constructor(
    public documentService: DocumentService,
    public utilityService: UtilityService
  ) { }

  ngOnInit(): void { }

  onBack() {
    const imagesLength = this.images.length - 1;
    this.activeIndex = this.activeIndex == 0 ? imagesLength : this.activeIndex - 1;
  }

  onNext() {
    const imagesLength = this.images.length - 1;
    this.activeIndex = this.activeIndex + 1 > imagesLength ? 0 : this.activeIndex + 1;
  }

  killImage() {
    let url: any = this.images[this.activeIndex];
    let image: any = url.substring(url.lastIndexOf('/') + 1);

    let data: any = {
      document_id: this.document['_id'],
      images: [image]
    };

    this.documentService.killDocumentImage(data).subscribe({
      error: (error: any) => {
        console.log(error);
      },
      next: (reply: any) => {
        console.log(reply);
      },
      complete: () => { }
    });
  }
}
