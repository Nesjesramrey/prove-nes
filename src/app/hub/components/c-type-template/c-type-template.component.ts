import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDocumentLayoutComponent } from 'src/app/components/add-document-layout/add-document-layout.component';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.c-type-template',
  templateUrl: './c-type-template.component.html',
  styleUrls: ['./c-type-template.component.scss']
})
export class CTypeTemplateComponent implements OnInit {
  @Input('user') public user: any = null;
  @Input('documents') public documents: any = [];
  public isDataAvailable: boolean = false;
  public documentSelectId: string = '';

  constructor(
    public dialog: MatDialog,
    public utilityService: UtilityService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isDataAvailable = true;
    });
  }

  selectDocument(document: any) {
    this.documentSelectId = document._id;
  }

  linkMe(url: string) {
    this.utilityService.linkMe(url);
  }

  viewDocument(document: any) {
    console.log(document);
  }
}
