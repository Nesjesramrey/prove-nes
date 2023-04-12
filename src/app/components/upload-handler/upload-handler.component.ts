import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, combineLatest } from 'rxjs';
import { BucketS3Service, IStreamDataFile } from 'src/app/services/bucket.s3.service';
import { ComplaintService } from 'src/app/services/complaint.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.upload-handler',
  templateUrl: './upload-handler.component.html',
  styleUrls: ['./upload-handler.component.scss']
})
export class UploadHandlerComponent implements OnInit {
  @HostBinding('class.viewMore') viewMore: boolean = false;
  @HostBinding('class.mini') mini: boolean = false;
  @HostBinding('class.close') close: boolean = false;
  @Input() displayUploader!: Subject<boolean>;
  public payload: any = null;
  public files: FileList | null = null;
  public output: Array<IStreamDataFile> = [];
  public locations: Array<string> = [];
  public url: string = '';
  public postURL: string = '';
  public isUploading: boolean = false;

  constructor(
    public complaintService: ComplaintService,
    public uploaderService: BucketS3Service,
    @Inject(DOCUMENT) public DOM: Document,
    public router: Router,
    public utilityService: UtilityService
  ) {
    this.url = this.DOM.location.origin + this.router.url;
  }

  ngOnInit(): void {
    this.displayUploader.subscribe((payload: any) => {
      this.payload = payload;
      // console.log('payload: ', this.payload);
      this.toggleClass();
      this.uploadFile();
    });
  }

  toggleClass() {
    this.viewMore = !this.viewMore;
  }

  minimize() {
    this.mini = !this.mini;
  }

  closeUploader() {
    this.close = !this.close;
    setTimeout(() => {
      this.close = !this.close;
      this.viewMore = !this.viewMore;
    }, 100);
  }

  uploadFile(): void {
    if (this.payload['files'] != null) {
      this.isUploading = true;
      let filesStage$: Array<Observable<IStreamDataFile>> = this.uploaderService.stage(this.payload['files']);
      combineLatest(filesStage$).subscribe({
        error: (error: any) => {
          this.isUploading = false;
          this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
        },
        next: (streamProgress: any) => { this.output = streamProgress; },
        complete: () => {
          this.locations = this.output.map(item => item.location!);

          let data = new FormData();
          data.append('title', this.payload['title']);
          data.append('description', this.payload['description']);
          data.append('isAnonymous', this.payload['isAnonymous'].toString());
          data.append('images', JSON.stringify(this.locations));

          switch (this.payload['type']) {
            case 'complaint':
              this.complaintService.fileComplaint(data).subscribe({
                error: (error: any) => { },
                next: (reply: any) => {
                  this.postURL = this.url + 'posts/' + reply['_id'];
                  this.isUploading = false;
                  this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
                  if (this.mini = false) { this.minimize(); }
                  this.output = [];
                }
              });
              break;
          }
        }
      });
    }
  }
}
