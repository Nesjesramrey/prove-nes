import { Component, ElementRef, HostBinding, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { forkJoin, map, Observable, startWith } from 'rxjs';
import { DocumentService } from 'src/app/services/document.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';
import { QuickLoginDialogComponent } from 'src/app/components/quick-login-dialog/quick-login-dialog.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { TeamService } from 'src/app/services/team.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TopicService } from 'src/app/services/topic.service';
import { SolutionService } from 'src/app/services/solution.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: '.create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss']
})
export class CreateTeamComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public user: any = null;
  public userAvailable: boolean = false;
  public searchCollegeFG!: FormGroup;
  public registerTeamFG!: FormGroup;
  public searchUserFG!: FormGroup;
  public userIDFG!: FormGroup;
  public setupFG!: FormGroup;
  public topicFG!: FormGroup;
  public solutionFG!: FormGroup;
  public teamUsers!: FormArray;
  public autocompleteControl = new FormControl('');
  public options: any[] = [];
  public filteredOptions!: Observable<any[]>;
  public submitted: boolean = false;
  public isSearching: boolean = false;
  public userTypes: any = [];
  public document: any = null;
  public layouts: any = null;
  public sublayouts: any = null;
  public topics: any = null;
  public coverage: any = null;
  @ViewChild('stepper') public stepper!: MatStepper;
  public selectedIndex: number = 0;
  public association: any = null;
  public imgDoc_exts: any = ['jpg', 'jpeg', 'png', 'pdf', 'JPG', 'JPEG', 'PNG', 'PDF'];
  public isMobile: boolean = false;
  public universities: any = null;
  public states: any = null;
  public stateName: string = '';
  @ViewChild('autocompleteInput') public autocompleteInput!: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  public team: any = null;
  public htmlContent: any = '';
  public editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Descripción...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [
        'strikeThrough',
        'subscript',
        'superscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        'heading',
      ],
      [
        'textColor',
        'backgroundColor',
        'customClasses',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };
  public isNewTopic: boolean = true;
  public topicSelected: any = null;
  public url: string = '';
  @HostBinding('class') public class: string = '';
  public teamAvailable: boolean = false;
  public selectedLayout: string = '';
  public selectedSubLayout: string = '';

  constructor(
    public userService: UserService,
    public formBuilder: FormBuilder,
    public utilityService: UtilityService,
    public documentService: DocumentService,
    public dialog: MatDialog,
    public deviceDetectorService: DeviceDetectorService,
    public router: Router,
    public teamService: TeamService,
    public topicService: TopicService,
    public solutionService: SolutionService,
    @Inject(DOCUMENT) public DOM: Document
  ) {
    this.isMobile = this.deviceDetectorService.isMobile();
    this.url = this.DOM.location.origin;
    if (this.isMobile) { this.class = 'fixmobile'; }
  }

  ngOnInit(): void {
    let user: Observable<any> = this.userService.fetchFireUser();
    let document: Observable<any> = this.documentService.fetchCoverDocument();
    let associations: Observable<any> = this.utilityService.fetchAssociationTypology();
    let states: Observable<any> = this.utilityService.fetchAllStates();

    forkJoin([user, document, associations, states]).subscribe({
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

        this.states = reply[3];
        this.states = this.states.filter((x: any) => { return x['code'] != 'NAL' });
        // console.log(this.states);
      },
      complete: () => {
        this.searchCollegeFG = this.formBuilder.group({
          state: ['', [Validators.required]],
          university: ['', [Validators.required]]
        });

        this.registerTeamFG = this.formBuilder.group({
          coverage: ['', [Validators.required]],
          university: ['', [Validators.required]],
          name: ['', [Validators.required]],
          leader: ['', [Validators.required]]
        });
        this.registerTeamFG.disable();
        this.autocompleteControl.disable();

        this.searchUserFG = this.formBuilder.group({
          searchemail: ['', [Validators.required, Validators.pattern(this.utilityService.emailPattern), this.utilityService.emailDomainValidator]],
          collaborators: this.formBuilder.array([])
        });

        this.userIDFG = this.formBuilder.group({
          file: ['', [Validators.required]]
        });

        this.setupFG = this.formBuilder.group({
          coverage: ['', [Validators.required]],
          layout: ['', [Validators.required]],
          sublayout: ['', [Validators.required]],
        });
        this.setupFG.controls['sublayout'].disable();

        this.topicFG = this.formBuilder.group({
          topic: ['', []],
          title: ['', [Validators.required]],
          description: ['', [Validators.required]]
        });

        this.solutionFG = this.formBuilder.group({
          title: ['', [Validators.required]],
          description: ['', [Validators.required]]
        });

        if (this.user['status'] == 500) {
          this.userAvailable = false;
        } else {
          this.userAvailable = true;
          this.registerTeamFG.patchValue({ leader: this.user['firstname'] + ' ' + this.user['lastname'] });
          this.registerTeamFG['controls']['leader'].disable();
        }

        if (!this.userAvailable) { this.searchCollegeFG.disable(); }
        this.teamUsers = this.searchUserFG.get('collaborators') as FormArray;
        // this.teamUsers.push(this.createUserField({ email: 'housero@outlook.es' }));
        // this.teamUsers.push(this.createUserField({ email: 'nenkyyy@outlook.es' }));
        // this.teamUsers.push(this.createUserField({ email: 'nenkyyy@live.com' }));
        // this.teamUsers.push(this.createUserField({ email: 'nenkyyy@icloud.com' }));

        if (this.userAvailable) {
          this.teamService.leaderStatus({ userID: this.user['_id'] }).subscribe({
            error: (error: any) => { console.log(error); },
            next: (reply: any) => {
              // console.log(reply);
              this.team = reply['association'];
              // console.log('team: ', this.team);
            },
            complete: () => {
              // if (this.team != null) {
              //   this.setupFG.patchValue({ coverage: this.team['coverage'][0]['_id'] });
              //   this.topics = this.team['sublayout']['topics'];
              //   this.setupFG.updateValueAndValidity();
              // }
              if (this.team != null) { this.teamAvailable = true; };
              this.isDataAvailable = true;
            }
          });
        } else {
          this.isDataAvailable = true;
        }
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

  filterOptionsByLabel(options: any, label: any): any {
    const value = label.trim().toLowerCase();
    return options.filter((option: any) => {
      return option.universidad_nombre.toLowerCase().includes(value);
    });
  }

  displayLabelFn(option: any | null) {
    return option ? option.universidad_nombre : '';
  }

  trackByIdFn(option: any) {
    return option.universidad_nombre;
  }

  onCoverageSelected(event: any) {
    let state: any = this.states.filter((x: any) => { return x['_id'] == event['value'] });
    this.stateName = state[0]['name'];
  }

  searchCollege(form: FormGroup) {
    this.isSearching = true;
    this.autocompleteControl.reset();
    this.registerTeamFG.patchValue({ university: '' });
    this.registerTeamFG.updateValueAndValidity();
    let data: any = {
      filter: form['value']['university'],
      state: this.stateName
    }
    this.utilityService.searchCollege(data).subscribe({
      error: (error: any) => {
        // console.log(error);
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
        this.isSearching = false;
      },
      next: (reply: any) => {
        this.universities = reply['universities'];
        // console.log('universities: ', this.universities);
        if (this.universities.length != 0) {
          this.autocompleteControl.enable();
          // this.utilityService.openSuccessSnackBar('Selecciona tu universidad.');
          this.autocompleteInput.nativeElement.focus();
          // this.autocompleteTrigger.closePanel();
        }

        if (this.universities.length == 0) {
          this.autocompleteControl.disable();
          this.utilityService.openErrorSnackBar('No se encontraron resultados.');
        }

        this.options = this.universities;
        this.filteredOptions = this.autocompleteControl.valueChanges.pipe(
          startWith(''),
          map((value: string | any) => {
            if (typeof value === 'string') { return this.filterOptionsByLabel(this.options, value); }
            return this.options;
          }));
      },
      complete: () => {
        this.searchCollegeFG.reset();
        this.isSearching = false;
      }
    });
  }

  onSearchUser(formGroup: FormGroup) {
    this.submitted = true;

    let data: any = { email: formGroup['value']['email'] }

    this.userService.searchUserByEmail(data).subscribe({
      error: (error: any) => {
        this.submitted = false;
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        // console.log(reply);
        this.submitted = false;
        let user: any;

        // user don't exists
        if (reply.length == 0) {
          user = { email: formGroup['value']['searchemail'] }
          this.teamUsers.push(this.createUserField(user));
          this.searchUserFG.controls['searchemail'].setValue('');
          return;
        }

        // user available
        if (reply[0]['_id'] == this.user['_id']) {
          this.utilityService.openErrorSnackBar('Ya eres líder de equipo.');
          this.searchUserFG.reset();
          return;
        }

        // team available
        if (this.team != null) {
          if (this.team['collaborators'].length != 0) {
            this.team['collaborators'].filter((x: any) => { });
            return;
          }
        }

        user = reply[0];
        this.teamUsers.push(this.createUserField(user));
        this.searchUserFG.controls['email'].setValue('');
      },
      complete: () => { this.submitted = false; }
    });
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

  onTopicSelected(event: any) {
    let topic: any = this.topics.filter((x: any) => { return x['_id'] == event['value']; });

    // existing topic
    if (event['value'] != undefined) {
      this.topicFG.controls['title'].disable();
      this.topicFG.patchValue({ topic: event['value'] });
      this.topicFG.patchValue({ description: topic[0]['description'] });
      this.isNewTopic = false;
      this.topicSelected = topic[0];
      this.team['topic'] = this.topicSelected;
    }
    // new topic
    else {
      this.topicFG.controls['title'].enable();
      this.topicFG.patchValue({ topic: '' });
      this.topicFG.patchValue({ description: '' });
      this.isNewTopic = true;
      this.topicSelected = null;
      this.team['topic'] = this.topicSelected;
    }
    // console.log(this.topicSelected);
  }

  onProblemTitle(event: any) {
    if (event['target']['value'] != '') {
      this.topicFG.controls['topic'].disable();
    } else {
      this.topicFG.controls['topic'].enable();
    }
  }

  onSelectUniversity(event: any) {
    this.registerTeamFG.controls['name'].enable();
    let state = this.states.filter((x: any) => { return x['name'] == this.stateName });
    this.registerTeamFG.patchValue({ coverage: [state[0]['_id']] });
    this.registerTeamFG.patchValue({ university: event['option']['value']['_id'] });
    this.registerTeamFG.updateValueAndValidity();
  }

  onFileSelected(event: any) {
    let ext: any;

    if (event.target.files.length == 0) {
      return;
    } else {
      ext = event.target.files[0].name.substr(event.target.files[0].name.lastIndexOf('.') + 1);
    }

    if (!this.imgDoc_exts.includes(ext)) {
      this.utilityService.openErrorSnackBar('Solo archivos .pdf son permitidos.');
      return;
    }

    this.validateSize(event.target);
  }

  validateSize(input: any) {
    const fileSize = input.files[0].size / 1024 / 1024;
    if (fileSize > 3) {
      this.utilityService.openErrorSnackBar('Solo archivos de hasta 5MB.');
    } else {
      this.userIDFG.patchValue({ file: input.files[0] });
      this.userIDFG.updateValueAndValidity();
    }
  }

  stepNext() {
    this.stepper.next();
    this.selectedIndex = this.stepper['selectedIndex'];
  }

  stepPrevious() {
    this.stepper.previous();
    this.selectedIndex = this.stepper['selectedIndex'];
  }

  createTeam() {
    this.submitted = true;

    let data: any = {
      coverage: this.registerTeamFG.controls['coverage']['value'],
      name: this.registerTeamFG.controls['name']['value'],
      university: this.registerTeamFG.controls['university']['value']
    };
    // console.log(data);
    // this.stepNext();
    // return;

    this.teamService.createTeam(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
        this.submitted = false;
      },
      next: (reply: any) => {
        this.team = reply;
        // console.log('team: ', this.team);
        this.setupFG.patchValue({ coverage: this.team['coverage'][0]['_id'] });
        this.setupFG.updateValueAndValidity();
      },
      complete: () => {
        this.stepNext();
        this.submitted = false;
      }
    });
  }

  saveCollaborators() {
    if (this.teamUsers['value'].length == 0) {
      this.stepNext();
      return;
    }

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
      },
      complete: () => {
        this.submitted = false;
        this.stepNext();
      }
    });
  }

  saveLeaderID() {
    if (this.userIDFG.controls['file']['value'] == '') {
      this.stepNext();
      return;
    }

    this.submitted = true;
    let data: any = {
      user_id: this.user['_id'],
      formData: new FormData()
    };
    data['formData'].append('file', this.userIDFG.controls['file']['value']);

    this.userService.uploadUserIDDocument(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
        this.submitted = false;
      },
      next: (reply: any) => {
        // console.log(reply);
        this.user['idImage'] = reply['data']['idImage'];
        // console.log(this.user);
      },
      complete: () => {
        this.submitted = false;
        this.stepNext();
      }
    });
  }

  saveTeamTopicSetup() {
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
        this.team['sublayoyt'] = this.selectedLayout;
        this.team['sublayout'] = this.selectedSubLayout;
        // console.log(this.team);
      },
      complete: () => {
        this.submitted = false;
        this.stepNext();
      }
    });
  }

  saveTeamTopic() {
    this.submitted = true;
    let data: any = {};

    switch (this.isNewTopic) {
      // new topic
      case true:
        data = {
          layout_id: this.team['sublayout'],
          formData: new FormData()
        }

        data['formData'].append('title', this.topicFG.controls['title']['value']);
        data['formData'].append('description', this.topicFG.controls['description']['value']);
        data['formData'].append('coverage', JSON.stringify([this.team['coverage'][0]['_id']]));

        this.topicService.createNewTopic(data).subscribe({
          error: (error: any) => {
            this.submitted = false;
            this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
          },
          next: (reply: any) => {
            this.team['topic'] = reply['topics'][0];

            this.teamService.assignTeamTopic({
              teamID: this.team['_id'],
              topic: reply['topics'][0]['_id']
            }).subscribe({
              error: (error: any) => {
                this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
              },
              next: (reply: any) => {
                this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
              },
              complete: () => {
                this.submitted = false;
                this.stepNext();
              }
            });
          },
          complete: () => { }
        });
        break;

      // existing topic
      case false:
        data = {
          teamID: this.team['_id'],
          topic: this.topicFG.controls['topic']['value']
        };

        this.teamService.assignTeamTopic(data).subscribe({
          error: (error: any) => {
            this.submitted = false;
            this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
          },
          next: (reply: any) => {
            this.team['topic'] = this.topicSelected;
            this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
          },
          complete: () => {
            this.submitted = false;
            this.stepNext();
          }
        });
        break;
    }
  }

  saveTeamSolution() {
    this.submitted = true;
    let data: any = {
      topic: this.team['topic']['_id'],
      formData: new FormData()
    };

    data['formData'].append('title', this.solutionFG.controls['title']['value']);
    data['formData'].append('description', this.solutionFG.controls['description']['value']);
    data['formData'].append('coverage', JSON.stringify([this.team['topic']['coverage']]));

    this.solutionService.createNewSolution(data).subscribe({
      error: (error: any) => {
        this.submitted = false;
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        this.team['topic']['solutions'] = reply['solutions'];
        this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
      },
      complete: () => {
        this.submitted = false;
        this.stepNext();
      }
    });
  }

  quickLogin() {
    const dialogRef = this.dialog.open<any>(QuickLoginDialogComponent, {
      width: '420px',
      data: {},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((reply: any) => {
      if (reply != undefined) { }
    });
  }

  handleRegistration() {
    switch (this.isMobile) {
      case true:
        this.router.navigateByUrl('/hub/signup-mobile?college=true');
        break;
      case false:
        this.router.navigateByUrl('/hub/registro?college=true');
        break;
    }
  }

  linkTeam() {
    this.router.navigateByUrl('/maraton/equipos/' + this.team['_id']);
  }
}
