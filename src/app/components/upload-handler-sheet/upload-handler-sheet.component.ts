import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Observable, combineLatest } from 'rxjs';
import { BucketS3Service, IStreamDataFile } from 'src/app/services/bucket.s3.service';
import { ComplaintService } from 'src/app/services/complaint.service';

@Component({
  selector: '.upload-handler-sheet',
  templateUrl: './upload-handler-sheet.component.html',
  styleUrls: ['./upload-handler-sheet.component.scss']
})
export class UploadHandlerSheetComponent implements OnInit {
  public payload: any = null;

  private files: FileList | null = null;
  output: Array<IStreamDataFile> = [];
  locations: Array<string> = [];

  constructor(
    public bottomSheetRef: MatBottomSheetRef<UploadHandlerSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public sheetData: any,
    public complaintService: ComplaintService,
    public uploaderService: BucketS3Service
  ) {
    console.log(this.sheetData);
    this.payload = this.sheetData['payload'];
  }

  ngOnInit(): void {
    this.uploadFile();
  }

  uploadFile(): void {
    if (this.payload['files'] != null) {
      let filesStage$: Array<Observable<IStreamDataFile>> = this.uploaderService.stage(this.payload['files']);
      combineLatest(filesStage$).subscribe({
        error: (error: any) => { },
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
                  console.log(reply);
                }
              });
              break;
          }
        }
      });
    }
  }
}
