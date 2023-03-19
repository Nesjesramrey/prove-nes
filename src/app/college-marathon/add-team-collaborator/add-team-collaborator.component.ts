import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.add-team-collaborator',
  templateUrl: './add-team-collaborator.component.html',
  styleUrls: ['./add-team-collaborator.component.scss']
})
export class AddTeamCollaboratorComponent implements OnInit {
  public searchUserFG!: FormGroup;
  public teamUsers!: FormArray;
  public submitted: boolean = false;
  public user: any = null;
  public team: any = null;

  constructor(
    public dialogRef: MatDialogRef<AddTeamCollaboratorComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public utilityService: UtilityService,
    public userService: UserService,
    public teamService: TeamService
  ) {
    // console.log(this.dialogData);
    this.user = this.dialogData['user'];
    this.team = this.dialogData['team'];
  }

  ngOnInit(): void {
    this.searchUserFG = this.formBuilder.group({
      searchemail: ['', [Validators.required, Validators.pattern(this.utilityService.emailPattern), this.utilityService.emailDomainValidator]],
      collaborators: this.formBuilder.array([])
    });
    this.teamUsers = this.searchUserFG.get('collaborators') as FormArray;
  }

  killDialog() { this.dialogRef.close(); }

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
    let collaborator: any = this.team['collaborators'].filter((x: any) => { return x['user']['email'] == email });
    if (collaborator.length != 0) {
      this.utilityService.openErrorSnackBar('Ya existe el colaborador.');
      this.searchUserFG.controls['searchemail'].setValue('');
      this.submitted = false;
      return;
    }

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
        this.dialogRef.close(reply);
      },
      complete: () => { this.submitted = false; }
    });
  }
}
