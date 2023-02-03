import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: '.single-post-page',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit {
  public positID: string = '';

  constructor(
    public activatedRoute: ActivatedRoute
  ) {
    this.positID = this.activatedRoute['snapshot']['params']['postID'];
    console.log(this.positID);
  }

  ngOnInit(): void { }
}
