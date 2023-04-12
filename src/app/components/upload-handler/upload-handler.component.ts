import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable, Subject, combineLatest } from 'rxjs';
import { BucketS3Service, IStreamDataFile } from 'src/app/services/bucket.s3.service';
import { ComplaintService } from 'src/app/services/complaint.service';
import { TestimonyService } from 'src/app/services/testimony.service';
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
  public isMobile: boolean = false;
  @HostBinding('class') public class: string = '';

  constructor(
    public complaintService: ComplaintService,
    public uploaderService: BucketS3Service,
    @Inject(DOCUMENT) public DOM: Document,
    public router: Router,
    public utilityService: UtilityService,
    public testuimonyServive: TestimonyService,
    public deviceDetectorService: DeviceDetectorService
  ) {
    this.url = this.DOM.location.origin + this.router.url;
    this.isMobile = this.deviceDetectorService.isMobile();
    if (this.isMobile) { this.class = 'fixmobile'; }
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

          switch (this.payload['type']) {
            case 'complaint':
              let complaintData = new FormData();
              complaintData.append('title', this.payload['title']);
              complaintData.append('description', this.payload['description']);
              complaintData.append('isAnonymous', this.payload['isAnonymous'].toString());
              complaintData.append('images', JSON.stringify(this.locations));
              this.complaintService.fileComplaint(complaintData).subscribe({
                error: (error: any) => { this.utilityService.openErrorSnackBar(this.utilityService['errorOops']); },
                next: (reply: any) => {
                  this.postURL = this.url + 'posts/' + reply['_id'];
                  this.isUploading = false;
                  this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
                  if (this.mini = false) { this.minimize(); }
                  this.output = [];
                }
              });
              break;

            case 'testimony':
              let testimonyData: any = { formData: new FormData() }
              testimonyData['formData'].append('name', this.payload['name']);
              testimonyData['formData'].append('description', this.payload['description']);
              testimonyData['formData'].append('isAnonymous', this.payload['isAnonymous'].toString());
              testimonyData['formData'].append('images', JSON.stringify(this.locations));
              if (this.payload['relationId'] != undefined) {
                testimonyData['formData'].append('type', this.payload['relationType']);
                testimonyData['formData'].append('relationId', this.payload['relationId']);
              }
              if (this.payload['team'] != undefined) { testimonyData['formData'].append('team', this.payload['team']); }
              this.testuimonyServive.createNewTestimony(testimonyData).subscribe({
                error: (error: any) => { this.utilityService.openErrorSnackBar(this.utilityService['errorOops']); },
                next: (reply: any) => {
                  this.postURL = this.url + 'posts/' + reply['testimony']['_id'];
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
