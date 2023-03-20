import { LyDialog } from '@alyle/ui/dialog';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { SetAvatarDialogComponent } from 'src/app/components/set-avatar-dialog/set-avatar-dialog.component';
import { TestimonyDialogComponent } from 'src/app/components/testimony-dialog/testimony-dialog.component';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AddSolutionDialogComponent } from '../add-solution-dialog/add-solution-dialog.component';
import { AddTeamCollaboratorComponent } from '../add-team-collaborator/add-team-collaborator.component';
import { AddTopicDialogComponent } from '../add-topic-dialog/add-topic-dialog.component';

@Component({
  selector: '.single-team',
  templateUrl: './single-team.component.html',
  styleUrls: ['./single-team.component.scss']
})
export class SingleTeamComponent implements OnInit {
  public teamID: string = '';
  public team: any = null;
  public isDataAvailable: boolean = false;
  public user: any = null;
  public searchUserFG!: FormGroup;
  public teamUsers!: FormArray;
  public submitted: boolean = false;
  public topic: any = null;
  public solutions: any = null;
  public collaborators: any[] = [];
  public isUploading: boolean = false;
  public isLeader: boolean = false;
  // public pdf: string = 'https://static-assets-pando.s3.amazonaws.com/images/2267f4b1-c8be-49e2-8fb1-d1c1eb73c3c0.pdf';
  public pdf: string = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  constructor(
    public activatedRoute: ActivatedRoute,
    public teamService: TeamService,
    public userService: UserService,
    public utilityService: UtilityService,
    public formBuilder: FormBuilder,
    public lyDialog: LyDialog,
    public dialog: MatDialog
  ) {
    this.teamID = this.activatedRoute['snapshot']['params']['teamID'];
    // console.log(this.teamID);
  }

  ngOnInit(): void {
    let team: Observable<any> = this.teamService.fetchTeamById({ teamID: this.teamID });
    let user: Observable<any> = this.userService.fetchFireUser();
    forkJoin([team, user]).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        // console.log(reply);
        this.team = reply[0];
        // console.log('team: ', this.team);
        this.collaborators = this.team['collaborators'];
        // console.log('collaborators: ', this.collaborators);
        this.topic = this.team['topic'];
        // console.log('topic: ', this.topic);
        this.solutions = this.team['topic']['solutions'];
        // console.log(this.solutions);
        this.user = reply[1];
        // console.log('user: ', this.user);
      },
      complete: () => {
        this.searchUserFG = this.formBuilder.group({
          searchemail: ['', [Validators.required, Validators.pattern(this.utilityService.emailPattern), this.utilityService.emailDomainValidator]],
          collaborators: this.formBuilder.array([])
        });
        this.teamUsers = this.searchUserFG.get('collaborators') as FormArray;

        let teamLeader: any = this.user['teams'].filter((x: any) => { return x['createdBy']['_id'] == this.user['_id']; });
        if (teamLeader.length != 0) { this.isLeader = true; }
        // console.log(this.isLeader);

        this.isDataAvailable = true;
      }
    });
  }

  get teamUsersForm() {
    return this.searchUserFG.get('collaborators') as FormArray;
  }

  createUserField(user: any): FormGroup {
    return this.formBuilder.group({
      email: [user['email'], [Validators.required]]
    });
  }

  addCollaboratorField() {
    this.teamUsers.push(this.createUserField(null));
  }

  removeUserField(index: any) {
    this.teamUsers.removeAt(index);
  }

  onSearchUser() {
    this.submitted = true;
    let email: string = this.searchUserFG.controls['searchemail']['value'];
    let data: any = { email: email };

    this.userService.searchUserByEmail(data).subscribe({
      error: (error: any) => {
        this.submitted = false;
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        this.submitted = false;
        let user: any;

        // user don't exists
        if (reply.length == 0) {
          user = { email: email }
          this.teamUsers.push(this.createUserField(user));
          this.searchUserFG.controls['searchemail'].setValue('');
          return;
        }

        // user available
        if (reply[0]['_id'] == this.user['_id']) {
          this.utilityService.openErrorSnackBar('Ya eres líder de equipo.');
          this.searchUserFG.controls['searchemail'].setValue('');
          return;
        }

        user = reply[0];
        this.teamUsers.push(this.createUserField(user));
        this.searchUserFG.controls['searchemail'].setValue('');
      },
      complete: () => { this.submitted = false; }
    });
  }

  coverFileSelected(event: any) {
    this.isUploading = true;
    let file: any = event['target']['files'][0];
    let data: any = {
      teamID: this.team['_id'],
      formData: new FormData()
    }
    data['formData'].append('file', file);
    this.teamService.uploadCoverImage(data).subscribe({
      error: (error: any) => {
        this.isUploading = false;
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
        this.team['coverImage'] = reply['coverImage'];
      },
      complete: () => { this.isUploading = false; }
    });
  }

  openCropperDialog(event: Event) {
    const dialogRef = this.lyDialog.open<SetAvatarDialogComponent, Event>(
      SetAvatarDialogComponent, {
      width: '420px',
      data: event,
      disableClose: true,
    });

    dialogRef.afterClosed.subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  addCollaborators() {
    this.submitted = true;
    let data: any = {
      teamID: this.team['_id'],
      collaborators: this.teamUsers['value']
    };

    this.teamService.assignTeamCollaborators(data).subscribe({
      error: (error: any) => {
        this.submitted = false;
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        // console.log(reply);
        let obj: any = null;
        reply['added'].filter((x: any) => {
          obj = { user: x, _id: '' };
          this.team['collaborators'].push(obj);
        });
        // this.team['collaborators'] = reply['added'];
        // console.log('team: ', this.team);
      },
      complete: () => { this.submitted = false; }
    });
  }

  popAddTeamCollaborator() {
    const dialogRef = this.dialog.open<any>(AddTeamCollaboratorComponent, {
      data: {
        user: this.user,
        team: this.team
      },
      disableClose: true,
      panelClass: 'posts-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        let obj: any = null;
        reply['added'].filter((x: any) => {
          obj = { user: x, _id: '' };
          this.team['collaborators'].push(obj);
        });
      }
    });
  }

  killTeamUser(collaborator: any) {
    let data: any = {
      teamID: this.team['_id'],
      collaboratorsToRemove: [{ email: collaborator['user']['email'] }]
    };
    this.teamService.killTeamCollaborator(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        this.team['collaborators'] = this.team['collaborators'].filter((x: any) => {
          return x['user']['_id'] != collaborator['user']['_id']
        });
      },
      complete: () => {
        this.utilityService.openSuccessSnackBar(this.utilityService['editedSuccess']);
      }
    });
  }

  popEditTopicDialog() {
    const dialogRef = this.dialog.open<any>(AddTopicDialogComponent, {
      data: {
        user: this.user,
        topic: this.team['topic']
      },
      disableClose: true,
      panelClass: 'posts-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.team['topic']['title'] = reply['title'];
        this.team['topic']['description'] = reply['description'];
      }
    });
  }

  popEditSolutionDialog() {
    const dialogRef = this.dialog.open<any>(AddSolutionDialogComponent, {
      data: {
        user: this.user,
        topic: this.team['topic']
      },
      disableClose: true,
      panelClass: 'posts-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.team['topic']['solutions'][0] = reply;
      }
    });
  }

  popTestimonialsDialog() {
    const dialogRef = this.dialog.open<any>(TestimonyDialogComponent, {
      width: '100%',
      data: {
        user: this.user,
        topic: this.team['topic']
      },
      disableClose: true,
      panelClass: 'side-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }
}
