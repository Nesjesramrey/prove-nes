import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { forkJoin, Observable } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AddSolutionDialogComponent } from '../add-solution-dialog/add-solution-dialog.component';
import { AddTopicDialogComponent } from '../add-topic-dialog/add-topic-dialog.component';

@Component({
  selector: '.create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss']
})
export class CreateTeamComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public user: any = null;
  public userAvailable: boolean = false;
  public registerTeamFG!: FormGroup;
  public searchUserFG!: FormGroup;
  public teamUsers!: FormArray;
  public submitted: boolean = false;
  public userTypes: any = [];
  public document: any = null;
  public layouts: any = null;
  public sublayouts: any = null;
  public topics: any = null;
  public coverage: any = null;
  @ViewChild('stepper') public stepper!: MatStepper;
  public selectedIndex: number = 0;
  public association: any = null;

  constructor(
    public userService: UserService,
    public formBuilder: FormBuilder,
    public utilityService: UtilityService,
    public documentService: DocumentService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    let user: Observable<any> = this.userService.fetchFireUser();
    let document: Observable<any> = this.documentService.fetchCoverDocument();
    let associations: Observable<any> = this.utilityService.fetchAssociationTypology();

    forkJoin([user, document, associations]).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        // console.log(reply);
        this.user = reply[0];
        // console.log('user: ', this.user);

        this.document = reply[1];
        // console.log('document: ', this.document);
        this.layouts = this.document['layouts'];
        // console.log('layouts: ', this.layouts);
        this.coverage = this.document['coverage'];
        // console.log('cobertura: ', this.coverage);

        let association: any = reply[2].filter((x: any) => { return x['value'] == 'college-marathon'; });
        this.association = association[0];
        // console.log('association: ', this.association);
      },
      complete: () => {
        this.registerTeamFG = this.formBuilder.group({
          name: ['Team One', [Validators.required]],
          owner: ['', [Validators.required]]
        });

        this.searchUserFG = this.formBuilder.group({
          email: ['', [Validators.required, Validators.pattern(this.utilityService.emailPattern), this.utilityService.emailDomainValidator]],
          collaborators: this.formBuilder.array([])
        });

        if (this.user['status']) {
          this.userAvailable = false;
        } else {
          this.userAvailable = true;
          this.registerTeamFG.patchValue({ owner: this.user['firstname'] + ' ' + this.user['lastname'] });
          this.registerTeamFG['controls']['owner'].disable();
        }

        if (!this.userAvailable) { this.registerTeamFG.disable(); }
        this.teamUsers = this.searchUserFG.get('collaborators') as FormArray;
        this.teamUsers.push(this.createUserField({ email: 'housero@outlook.es' }));
        this.teamUsers.push(this.createUserField({ email: 'nenkyyy@outlook.es' }));
        this.teamUsers.push(this.createUserField({ email: 'nenkyyy@live.com' }));
        this.teamUsers.push(this.createUserField({ email: 'nenkyyy@icloud.com' }));

        this.isDataAvailable = true;
      }
    });
  }

  get teamUsersForm() {
    return this.searchUserFG.get('collaborators') as FormArray;
  }

  createUserField(user: any): FormGroup {
    return this.formBuilder.group({
      userEmail: [user['email'], [Validators.required]]
    });
  }

  addCollaboratorField() {
    this.teamUsers.push(this.createUserField(null));
  }

  removeUserField(index: any) {
    this.teamUsers.removeAt(index);
  }

  onSearchUser(formGroup: FormGroup) {
    this.submitted = true;
    let data: any = {
      email: formGroup['value']['email']
    }
    this.userService.searchUserByEmail(data).subscribe({
      error: (error: any) => {
        this.submitted = false;
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        this.submitted = false;
        let user: any;

        if (reply.length == 0) {
          user = { email: formGroup['value']['email'] }
          this.teamUsers.push(this.createUserField(user));
          this.searchUserFG.controls['email'].setValue('');
          return;
        }

        if (reply[0]['_id'] == this.user['_id']) {
          this.utilityService.openErrorSnackBar('Ya eres líder de equipo.');
          this.searchUserFG.reset();
          return;
        }

        user = reply[0];
        this.teamUsers.push(this.createUserField(user));
        this.searchUserFG.controls['email'].setValue('');
      },
      complete: () => {
        this.submitted = false;
      }
    });
  }

  onLayoutSelected(event: any) {
    let layout: any = this.layouts.filter((x: any) => { return x['_id'] == event['value']; });
    this.sublayouts = layout[0]['subLayouts'];
  }

  onSubLayoutSelected(event: any) {
    let layout: any = this.sublayouts.filter((x: any) => { return x['_id'] == event['value']; });
    this.topics = layout[0]['topics'];
    console.log(this.topics);
  }

  popAddTopicDialog() {
    const dialogRef = this.dialog.open<any>(AddTopicDialogComponent, {
      data: {},
      disableClose: true,
      panelClass: 'posts-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  popAddSolutionDialog() {
    const dialogRef = this.dialog.open<any>(AddSolutionDialogComponent, {
      data: {},
      disableClose: true,
      panelClass: 'posts-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  onFileSelected(event: any) {
    this.validateSize(event.target);
  }

  validateSize(input: any) {
    const fileSize = input.files[0].size / 1024 / 1024;
    if (fileSize > 3) {
      this.utilityService.openErrorSnackBar('Solo archivos de hasta 3 MB.');
    } else {
      // this.commentFormGroup.patchValue({ file: input.files[0] });
      // this.commentFormGroup.updateValueAndValidity();
    }
  }
}
