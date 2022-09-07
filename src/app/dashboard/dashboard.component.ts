import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentService } from '../services/document.service';

@Component({
  selector: '.dashboard-page',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public document: any = null;
  public mailingListFormGroup!: FormGroup;

  constructor(
    public documentService: DocumentService,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    // this.documentService.fetchSingleDocumentById({ _id: '63166daaa8581d57b9394880' })
    //   .subscribe((reply: any) => {
    //     this.document = reply;
    //     console.log('document: ', this.document);
    //   });

    this.mailingListFormGroup = this.formBuilder.group({
      email: ['', [Validators.required]]
    });
  }
}
