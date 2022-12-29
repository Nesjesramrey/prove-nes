import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { TopicSingleMobileComponent } from '../topic-single-mobile/topic-single-mobile.component';

@Component({
  selector: 'card-topics-mobile',
  templateUrl: './card-topics-mobile.component.html',
  styleUrls: ['./card-topics-mobile.component.scss']
})
export class CardTopicsMobileComponent implements OnInit {

  openDialog() {
    
    this.dialog.open(TopicSingleMobileComponent, {
      height: '100%',
      maxWidth: '100%',
      
    });
  }

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
