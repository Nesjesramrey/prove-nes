import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostsService } from 'src/app/services/posts.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: '.categorize-post',
  templateUrl: './categorize-post.component.html',
  styleUrls: ['./categorize-post.component.scss']
})
export class CategorizePostComponent implements OnInit {
  public post: any = null;
  public document: any = null;
  public layouts: any = null;
  public sublayouts: any = null;
  public topics: any = null;
  public solutions: any = null;
  public formGroup!: FormGroup;
  public submitted: boolean = false;
  public relationID: string = '';
  public relateTo: string = '';
  public postType: string = '';

  constructor(
    public dialogRef: MatDialogRef<CategorizePostComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder,
    public postsService: PostsService,
    public utilityService: UtilityService
  ) {
    // console.log(this.dialogData);
    this.post = this.dialogData['post'];
    console.log('post: ', this.post);
    this.document = this.dialogData['document'];
    // console.log('document: ', this.document);
    this.layouts = this.document['layouts'];
    // console.log('layouts: ', this.layouts);
    this.postType = this.dialogData['type'];
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      layout: ['', [Validators.required]],
      sublayout: ['', []],
      topic: ['', []],
      solution: ['', []]
    });
    this.formGroup['controls']['sublayout'].disable();
    this.formGroup['controls']['topic'].disable();
    this.formGroup['controls']['solution'].disable();
  }

  onSelectLayout(event: any) {
    let layout: any = this.layouts.filter((x: any) => { return x['_id'] == event['value']; });
    this.sublayouts = layout[0]['subLayouts'];
    this.formGroup['controls']['sublayout'].enable();
    this.relationID = layout[0]['_id'];
    this.relateTo = 'layout';
  }

  onSelectSubLayout(event: any) {
    let layout: any = this.sublayouts.filter((x: any) => { return x['_id'] == event['value']; });
    this.topics = layout[0]['topics'];
    this.formGroup['controls']['topic'].enable();
    this.relationID = layout[0]['_id'];
    this.relateTo = 'layout';
  }

  onSelectTopic(event: any) {
    let topic = this.topics.filter(((x: any) => { return x['_id'] == event['value']; }));
    this.solutions = topic[0]['solutions'];
    this.formGroup['controls']['solution'].enable();
    this.relationID = topic[0]['_id'];
    this.relateTo = 'topic';
  }

  onSelectSolution(event: any) {
    let solution: any = this.solutions.filter((x: any) => { return x['_id'] == event['value']; });
    this.relationID = solution[0]['_id'];
    this.relateTo = 'solution';
  }

  killDialog() {
    this.dialogRef.close(this.post);
  }

  categorizePost(formGroup: FormGroup) {
    let data: any = {}

    switch (this.postType) {
      case 'testimony':
        data = { testimony: this.post['_id'] }
        switch (this.relateTo) {
          case 'layout':
            data['layout'] = this.relationID;
            break;
          case 'topic':
            data['topic'] = this.relationID;
            break;
          case 'solution':
            data['solution'] = this.relationID;
            break;
        }
        break;

      case 'complaint':
        data = { complaint: this.post['_id'] }
        switch (this.relateTo) {
          case 'layout':
            data['layout'] = this.relationID;
            break;
          case 'topic':
            data['topic'] = this.relationID;
            break;
          case 'solution':
            data['solution'] = this.relationID;
            break;
        }
        break;
    }

    this.postsService.categorizePost(data).subscribe({
      error: (error: any) => {
        this.utilityService.openErrorSnackBar(this.utilityService['errorOops']);
      },
      next: (reply: any) => {
        console.log(reply);
        this.post['relation'] = reply['object']['relation']
        this.post['relationId'] = reply['object']['relationId'];
      },
      complete: () => {
        this.utilityService.openSuccessSnackBar(this.utilityService['saveSuccess']);
      }
    });
  }
}
