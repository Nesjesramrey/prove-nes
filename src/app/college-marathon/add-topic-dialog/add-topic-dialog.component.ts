import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TopicService } from 'src/app/services/topic.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.add-topic-dialog',
  templateUrl: './add-topic-dialog.component.html',
  styleUrls: ['./add-topic-dialog.component.scss']
})
export class AddTopicDialogComponent implements OnInit {
  public submitted: boolean = false;
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
  public topicFG!: FormGroup;
  public topic: any = null;
  public user: any = null;

  constructor(
    public dialogRef: MatDialogRef<AddTopicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public topicService: TopicService,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
    this.topic = this.dialogData['topic'];
    // console.log('topic: ', this.topic);
    this.user = this.dialogData['user'];
    // console.log('user: ', this.user);
  }

  ngOnInit(): void {
    this.topicFG = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
    this.topicFG.patchValue({ title: this.topic['title'] });
    this.topicFG.patchValue({ description: this.topic['description'] });
  }

  killDialog() {
    this.dialogRef.close();
  }

  editTopic(form: FormGroup) {
    this.submitted = true;
    let data: any = {
      topic_id: this.topic['_id'],
      title: form['value']['title'],
      description: form['value']['description']
    };
    this.topicService.updateTopicData(data).subscribe({
      error: (error: any) => {
        this.submitted = false;
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        this.topic['title'] = reply['title'];
        this.topic['description'] = reply['description'];
      },
      complete: () => {
        this.submitted = false;
        this.dialogRef.close(this.topic);
      }
    });
  }
}
