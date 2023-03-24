import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { TeamService } from 'src/app/services/team.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.layout-setup-dialog',
  templateUrl: './layout-setup-dialog.component.html',
  styleUrls: ['./layout-setup-dialog.component.scss']
})
export class LayoutSetupDialogComponent implements OnInit {
  public team: any = null;
  public setupFG!: FormGroup;
  public coverage: any = null;
  public layouts: any = null;
  public sublayouts: any = null;
  public topics: any = null;
  public selectedLayout: string = '';
  public selectedSubLayout: string = '';
  public document: any = null;
  public submitted: boolean = false;
  public isDataAvailable: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<LayoutSetupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public documentService: DocumentService,
    public teamService: TeamService,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
    this.team = this.dialogData['team'];
    this.coverage = this.dialogData['team']['coverage'];
  }

  ngOnInit(): void {
    let document: Observable<any> = this.documentService.fetchCoverDocument();
    forkJoin([document]).subscribe({
      error: (error: any) => { },
      next: (reply: any) => {
        this.document = reply[0];
        // console.log(this.document);
        this.layouts = this.document['layouts'];
        // console.log(this.layouts);
      },
      complete: () => { this.isDataAvailable = true; }
    });

    this.setupFG = this.formBuilder.group({
      // coverage: [this.coverage[0]['_id'], [Validators.required]],
      layout: ['', [Validators.required]],
      sublayout: ['', [Validators.required]],
    });
    // this.setupFG.controls['coverage'].disable();
    this.setupFG.controls['sublayout'].disable();
  }

  onLayoutSelected(event: any) {
    let layout: any = this.layouts.filter((x: any) => { return x['_id'] == event['value']; });
    this.sublayouts = layout[0]['subLayouts'];
    this.setupFG.controls['sublayout'].enable();
    this.selectedLayout = event['value'];
  }

  onSubLayoutSelected(event: any) {
    let layout: any = this.sublayouts.filter((x: any) => { return x['_id'] == event['value']; });
    this.topics = layout[0]['topics'];
    this.selectedSubLayout = event['value'];
  }

  saveTeamSetup(form: FormGroup) {
    this.submitted = true;
    let data: any = {
      teamID: this.team['_id'],
      layout: this.setupFG['value']['layout'],
      sublayout: this.setupFG['value']['sublayout']
    };
    this.teamService.setTeamCategories(data).subscribe({
      error: (error: any) => {
        this.submitted = false;
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        // this.team['layout'] = this.selectedLayout;
        // this.team['sublayout'] = this.selectedSubLayout;
        this.dialogRef.close(reply);
      },
      complete: () => {
        // this.submitted = false;
        // this.dialogRef.close(this.team);
      }
    });
  }
}
