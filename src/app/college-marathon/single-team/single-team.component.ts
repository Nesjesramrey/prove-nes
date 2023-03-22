import { LyDialog } from '@alyle/ui/dialog';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AddCommentsComponent } from 'src/app/components/add-comments/add-comments.component';
import { SetAvatarDialogComponent } from 'src/app/components/set-avatar-dialog/set-avatar-dialog.component';
import { TestimonyDialogComponent } from 'src/app/components/testimony-dialog/testimony-dialog.component';
import { ModalVotesComponent } from 'src/app/public-documents/components/modal-votes/modal-votes.component';
import { DocumentService } from 'src/app/services/document.service';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AddSolutionDialogComponent } from '../add-solution-dialog/add-solution-dialog.component';
import { AddTeamCollaboratorComponent } from '../add-team-collaborator/add-team-collaborator.component';
import { AddTopicDialogComponent } from '../add-topic-dialog/add-topic-dialog.component';
import { TeamVoteDialogComponent } from '../team-vote-dialog/team-vote-dialog.component';

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
  public solution: any = null;
  public collaborators: any[] = [];
  public isUploading: boolean = false;
  public isLeader: boolean = false;
  public document: any = null;
  public uploadProposalFG!: FormGroup;
  public teamScore: number = 0;

  constructor(
    public activatedRoute: ActivatedRoute,
    public teamService: TeamService,
    public userService: UserService,
    public utilityService: UtilityService,
    public formBuilder: FormBuilder,
    public lyDialog: LyDialog,
    public dialog: MatDialog,
    public documentService: DocumentService
  ) {
    this.teamID = this.activatedRoute['snapshot']['params']['teamID'];
    // console.log(this.teamID);
  }

  ngOnInit(): void {
    let team: Observable<any> = this.teamService.fetchTeamById({ teamID: this.teamID });
    let user: Observable<any> = this.userService.fetchFireUser();
    let document: Observable<any> = this.documentService.fetchCoverDocument();
    forkJoin([team, user, document]).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        // console.log(reply);
        this.team = reply[0];
        // console.log('team: ', this.team);
        this.setTeamScore();

        this.collaborators = this.team['collaborators'];
        // console.log('collaborators: ', this.collaborators);

        this.topic = this.team['topic'];
        // console.log('topic: ', this.topic);

        let solutions: any = [];
        this.topic['solutions'].filter((x: any) => {
          if (x['team'] != null) { solutions.push(x); }
        });
        this.solution = solutions.filter((x: any) => { return x['team'] == this.team['_id']; });
        this.solution = this.solution[0];
        // console.log(this.solution);

        this.solutions = this.team['topic']['solutions'];
        // console.log(this.solutions);

        this.user = reply[1];
        // console.log('user: ', this.user);

        this.document = reply[2];
        // console.log('document: ', this.document);
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

        this.uploadProposalFG = this.formBuilder.group({
          file: ['', Validators.required]
        });

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

  setTeamScore() {
    let points: any = [];
    for (var key of Object.keys(this.team['metadata']['score'])) {
      points.push(this.team['metadata']['score'][key]['point']);
    }
    this.teamScore = points.reduce((a: any, b: any) => a + b, 0);
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
        solution: this.solution
      },
      disableClose: true,
      panelClass: 'posts-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) {
        this.team['solution'] = reply;
      }
    });
  }

  popTestimonialsDialog() {
    const dialogRef = this.dialog.open<any>(TestimonyDialogComponent, {
      width: '100%',
      data: {
        user: this.user,
        solution: this.solution,
        team: this.team
      },
      disableClose: true,
      panelClass: 'side-dialog'
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  openModalVote(type: any) {
    let data: any = {};

    switch (type) {
      case 'topic':
        data = { topic: this.topic['_id'] }
        break;

      case 'solution':
        data = { solution: this.solution['_id'] }
        break;
    }
    const dialogRef = this.dialog.open<any>(ModalVotesComponent, {
      width: '500px',
      disableClose: true,
      data: data,
    });

    dialogRef.afterClosed().subscribe((reply: any) => { });
  }

  popAddCommentsDialog(type: string) {
    let coverage: any = this.topic['coverage'];
    let data: any = {};
    switch (type) {
      case 'topic':
        data = {
          location: type,
          document: this.document,
          topic: this.topic,
          coverage: coverage[0]
        }
        break;
      case 'solution':
        data = {
          location: type,
          document: this.document,
          solution: this.solution,
          coverage: coverage[0]
        }
        break;
    }

    const dialogRef = this.dialog.open<AddCommentsComponent>(AddCommentsComponent, {
      width: '640px',
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  onFileSelected(event: any) {
    let ext: any;

    if (event.target.files.length == 0) {
      return;
    } else {
      ext = event.target.files[0].name.substr(event.target.files[0].name.lastIndexOf('.') + 1);
    }

    if (ext != 'pdf') {
      this.utilityService.openErrorSnackBar('Solo archivos .pdf son permitidos.');
      return;
    }

    this.uploadProposalFG.patchValue({ files: event['target']['files'][0] });
    this.uploadProposalFG.updateValueAndValidity();

    let data: any = {
      teamID: this.team['_id'],
      formData: new FormData()
    }
    data.formData.append('file', event['target']['files'][0]);
    this.submitted = true;

    this.teamService.upoloadProposal(data).subscribe({
      error: (error: any) => {
        this.submitted = false;
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        this.team['problematicProposal'] = reply['problematicProposal'];
        this.team['metadata'] = reply['metadata'];
      },
      complete: () => {
        this.submitted = false;
        this.uploadProposalFG.reset();
        this.setTeamScore();
      }
    });
  }

  popTeamVoteDialog() {
    const dialogRef = this.dialog.open<any>(TeamVoteDialogComponent, {
      width: '420px',
      data: { team: this.team },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { 
        this.team['vote'] = reply['data']; 
        this.setTeamScore();
      }
    });
  }
}
