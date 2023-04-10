import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TopicService } from 'src/app/services/topic.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-move-copy-topic',
  templateUrl: './move-copy-topic.component.html',
  styleUrls: ['./move-copy-topic.component.scss']
})
export class MoveCopyTopicComponent implements OnInit {
  public topic: any = null;
  public layout: any = null;
  public document: any = null;
  public layouts: any = null;
  public sublayouts: any = null;
  public formGroup!: FormGroup;
  public submitted: boolean = false;
  public isDataAvailable: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<MoveCopyTopicComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public utilityService: UtilityService,
    public topicService: TopicService
  ) {
    console.log(this.dialogData);
    this.topic = this.dialogData['topic'];
    this.layout = this.dialogData['layout'];
    this.document = this.dialogData['document'];
    this.layouts = this.dialogData['document']['layouts'];
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({ toSublayout: ['', [Validators.required]] });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }

  killDialog() { this.dialogRef.close(); }

  onLayoutSelected(event: any) {
    let layout: any = this.layouts.filter((x: any) => { return x['_id'] == event['value']; });
    this.sublayouts = layout[0]['subLayouts'];
    // this.formGroup.controls['toSublayout'].enable();
  }

  onMoveTopic(form: FormGroup) {
    let data: any = {
      topic: this.topic['_id'],
      fromSublayout: this.layout['_id'],
      toSublayout: this.formGroup['value']['toSublayout']
    };

    if (data['fromSublayout'] == data['toSublayout']) {
      this.utilityService.openErrorSnackBar('No se puede mover al mismo tema.');
      return;
    }

    this.topicService.moveTopic(data).subscribe({
      error: (error: any) => { this.utilityService.openErrorSnackBar(this.utilityService['errorOops']); },
      next: (reply: any) => { this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']); },
      complete: () => { this.dialogRef.close(this.topic); }
    });
  }
}
