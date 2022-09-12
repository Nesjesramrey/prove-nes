import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentService } from '../services/document.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: '.dashboard-page',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public document: any = null;
  public mailingListFormGroup!: FormGroup;
  public submitted: boolean = false;

  constructor(
    public documentService: DocumentService,
    public formBuilder: FormBuilder,
    public utilitySrvc: UtilityService
  ) { }

  ngOnInit(): void {
    this.documentService.fetchCoverDocument()
      .subscribe((reply: any) => {
        this.document = reply;
        console.log('document: ', this.document);
        this.isDataAvailable = true;
      });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);

    this.mailingListFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.utilitySrvc.emailPattern), this.utilitySrvc.emailDomainValidator]]
    });
  }

  onSubscribe(formGroup: FormGroup) {
    this.submitted = true;
    let data: any = {
      email: formGroup['value']['email']
    };
    // console.log(data);
  }

  linkMe(url: string) {
    this.utilitySrvc.linkMe(url);
  }
}
