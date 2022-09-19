import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
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
  public isAuthenticated: boolean = false;

  constructor(
    public documentService: DocumentService,
    public formBuilder: FormBuilder,
    public utilitySrvc: UtilityService,
    public authenticationService: AuthenticationService,
    public router: Router
  ) {
    this.isAuthenticated = this.authenticationService.isAuthenticated;
  }

  ngOnInit(): void {
    if (history.state.status != undefined) { window.location.reload(); };

    this.documentService.fetchCoverDocument()
      .subscribe((reply: any) => {
        this.document = reply;
        // console.log('document: ', this.document);
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
    if (this.isAuthenticated) {
      this.utilitySrvc.linkMe(url);
    } else {
      this.utilitySrvc.linkMe('/hub/ingresar');
    }
  }
}
