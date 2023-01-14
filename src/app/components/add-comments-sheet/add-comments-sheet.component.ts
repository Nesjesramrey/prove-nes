import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { DocumentService } from 'src/app/services/document.service';

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
  public isAnonymous: boolean = false;
  public acl: any = null;

  constructor(
    public bottomSheetRef: MatBottomSheetRef<AddCommentsSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public sheetData: any,
    public formBuilder: FormBuilder,
    public documentService: DocumentService
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
        this.solution = this.sheetData['solution'];
        this.locationID = this.sheetData['solution']['_id'];
        break;
    };
  }

  onCreateComment(form: FormGroup) { }

  killSheet() {
    this.bottomSheetRef.dismiss();
  }
}
