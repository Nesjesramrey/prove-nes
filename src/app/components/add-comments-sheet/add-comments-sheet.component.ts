import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { CommentService } from 'src/app/services/comment.service';
import { DocumentService } from 'src/app/services/document.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.add-comments-sheet',
  templateUrl: './add-comments-sheet.component.html',
  styleUrls: ['./add-comments-sheet.component.scss']
})
export class AddCommentsSheetComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public commentFormGroup!: FormGroup;
  public submitted: boolean = false;
  public documentLocation: any = null;
  public locationID: any = null;
  public documentID: any = null;
  public document: any = null;
  public layout: any = null;
  public topic: any = null;
  public solution: any = null;
  public coverage: any = null;
  public coverageSelected: string = '';
  public isAnonymous: boolean = false;
  public acl: any = null;
  public fileNames: any = [];

  constructor(
    public bottomSheetRef: MatBottomSheetRef<AddCommentsSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public sheetData: any,
    public formBuilder: FormBuilder,
    public documentService: DocumentService,
    public utilityService: UtilityService,
    public commentService: CommentService,
    public router: Router
  ) {
    // console.log(this.sheetData);
    this.document = this.sheetData['document'];
    this.coverage = this.document['coverage'];
    this.documentLocation = this.sheetData['location'];
  }

  ngOnInit(): void {
    this.documentService.fetchAccessControlList({ document_id: this.document['_id'] }).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        this.acl = reply;
      },
      complete: () => { }
    });


    this.commentFormGroup = this.formBuilder.group({
      coverage: ['', [Validators.required]],
      message: ['', [Validators.required]],
      file: ['', []]
    });

    switch (this.sheetData['location']) {
      case 'document':
        this.locationID = this.sheetData['document']['_id'];
        break;

      case 'layout':
        this.documentID = this.document['_id'];
        this.layout = this.sheetData['layout'];
        this.locationID = this.sheetData['layout']['_id'];
        break;

      case 'subLayout':
        this.documentID = this.document['_id'];
        this.layout = this.sheetData['layout'];
        this.locationID = this.sheetData['layout']['_id'];
        break;

      case 'topic':
        this.documentID = this.document['_id'];
        this.topic = this.sheetData['topic'];
        this.locationID = this.sheetData['topic']['_id'];
        break;

      case 'solution':
        this.documentID = this.document['_id'];
        this.solution = this.sheetData['solution'];
        this.locationID = this.sheetData['solution']['_id'];
        break;
    };
  }

  onCoverageSelected(event: any) {
    this.coverageSelected = event['value'];
  }

  onFileSelected(event: any) {
    this.validateSize(event.target);
    Array.from(event.target.files).forEach((file: any) => { this.fileNames.push(file['name']); });
  }

  validateSize(input: any) {
    const fileSize = input.files[0].size / 1024 / 1024;
    if (fileSize > 3) {
      this.utilityService.openErrorSnackBar('Solo archivos de hasta 3 MB.');
    } else {
      this.commentFormGroup.patchValue({ file: input.files });
      this.commentFormGroup.updateValueAndValidity();
    }
  }

  onCreateComment(form: FormGroup) {
    this.submitted = true;
    let url = this.router['url'];
    url = url.replace('/documentos-publicos/', '/documentos/');
    url = url.replace('/tema/', '/temas/');

    let data: any = {
      location: this.documentLocation,
      document_id: this.documentID,
      location_id: this.locationID,
      formData: new FormData(),
    };

    data['formData'].append('file', this.commentFormGroup.controls['file']['value']);
    data['formData'].append('message', form['value']['message']);
    data['formData'].append('coverage', JSON.stringify([form['value']['coverage']]));
    data['formData'].append('isAnonymous', this.isAnonymous);
    data['formData'].append('redirectURL', url);

    switch (this.documentLocation) {
      case 'document':
        this.commentService.createNewDocumentComment(data).subscribe({
          error: (error: any) => {
            this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
            this.killSheet();
          },
          next: (reply: any) => { this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess); },
          complete: () => { this.killSheet(); }
        });
        break;

      case 'layout':
        this.commentService.createNewLayoutComment(data).subscribe({
          error: (error: any) => {
            this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
            this.killSheet();
          },
          next: (reply: any) => { this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess); },
          complete: () => { this.killSheet(); }
        });
        break;

      case 'subLayout':
        this.commentService.createNewSubLayoutComment(data).subscribe({
          error: (error: any) => {
            this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
            this.killSheet();
          },
          next: (reply: any) => { this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess); },
          complete: () => { this.killSheet(); }
        });
        break;

      case 'topic':
        this.commentService.createNewTopicComment(data).subscribe({
          error: (error: any) => {
            this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
            this.killSheet();
          },
          next: (reply: any) => { this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess); },
          complete: () => { this.killSheet(); }
        });
        break;

      case 'solution':
        this.commentService.createNewSolutionComment(data).subscribe({
          error: (error: any) => {
            this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
            this.killSheet();
          },
          next: (reply: any) => { this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess); },
          complete: () => { this.killSheet(); }
        })
        break;
    }
  }

  killSheet() {
    this.bottomSheetRef.dismiss();
  }
}
