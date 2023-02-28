import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: '.categorize-post',
  templateUrl: './categorize-post.component.html',
  styleUrls: ['./categorize-post.component.scss']
})
export class CategorizePostComponent implements OnInit {
  public complaint: any = null;
  public document: any = null;
  public layouts: any = null;
  public sublayouts: any = null;
  public topics: any = null;
  public solutions: any = null;
  public formGroup!: FormGroup;
  public submitted: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CategorizePostComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public formBuilder: FormBuilder
  ) {
    // console.log(this.dialogData);
    this.complaint = this.dialogData['complaint'];
    // console.log('complaint: ', this.complaint);
    this.document = this.dialogData['document'];
    // console.log('document: ', this.document);
    this.layouts = this.document['layouts'];
    // console.log('layouts: ', this.layouts);
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
  }

  onSelectSubLayout(event: any) {
    let layout: any = this.sublayouts.filter((x: any) => { return x['_id'] == event['value']; });
    this.topics = layout[0]['topics'];
    this.formGroup['controls']['topic'].enable();
  }

  onSelectTopic(event: any) {
    let topic = this.topics.filter(((x: any) => { return x['_id'] == event['value']; }));
    this.solutions = topic[0]['solutions'];
    this.formGroup['controls']['solution'].enable();
  }

  onSelectSolution(event: any) { }

  killDialog() {
    this.dialogRef.close(this.complaint);
  }
}
