import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TopicService } from 'src/app/services/topic.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.edit-topic-data',
  templateUrl: './edit-topic-data.component.html',
  styleUrls: ['./edit-topic-data.component.scss']
})
export class EditTopicDataComponent implements OnInit {
  public isDataAvailable: boolean = false;
  public topic: any = null;
  public formGroup!: FormGroup;
  public submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditTopicDataComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public topicSevice: TopicService,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
    this.topic = this.dialogData['topic'];
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      title: [this.topic['title'], [Validators.required]],
      description: [this.topic['description'], [Validators.required]]
    });

    setTimeout(() => {
      this.isDataAvailable = true;
    }, 1000);
  }

  editTopic(formGroup: FormGroup) {
    this.submitted = true;
    let data: any = {
      topic_id: this.topic['_id'],
      title: formGroup['value']['title'],
      description: formGroup['value']['description']
    };
    this.topicSevice.updateTopicData(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService.errorOops);
        this.killDialog();
      },
      next: (reply: any) => {
        this.utilityService.openSuccessSnackBar(this.utilityService.saveSuccess);
        this.dialogRef.close(reply);
      },
      complete: () => {
        this.submitted = false;
      }
    });
  }

  killDialog() {
    this.dialogRef.close();
  }
}
