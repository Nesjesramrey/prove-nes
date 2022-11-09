import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthenticationService } from '../services/authentication.service';
import { DocumentService } from '../services/document.service';
import { SearchService } from '../services/search.service';
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
  public isMobile: boolean = false;
  public searchFormGroup!: FormGroup;

  constructor(
    public documentService: DocumentService,
    public formBuilder: FormBuilder,
    public utilitySrvc: UtilityService,
    public authenticationService: AuthenticationService,
    public router: Router,
    public deviceDetectorService: DeviceDetectorService,
    public searchService: SearchService
  ) {
    this.isAuthenticated = this.authenticationService.isAuthenticated;
    this.isMobile = this.deviceDetectorService.isMobile();
  }

  ngOnInit(): void {
    if (history.state.status != undefined) { window.location.reload(); };

    this.searchFormGroup = this.formBuilder.group({
      search: ['', [Validators.required]]
    });

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

  onSearch(formGroup: FormGroup) {
    let data: any = {
      filter: formGroup['value']['search'],
      document_id: this.document['_id']
    };
    this.searchService.globalSearch(data).subscribe({
      error: (error: any) => {
        this.utilitySrvc.openErrorSnackBar(this.utilitySrvc.errorOops);
      },
      next: (reply: any) => {
        this.searchService.searchSubject.next(reply);
        this.utilitySrvc.linkMe('/search');
      },
      complete: () => { }
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
