import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'avatars-row',
  templateUrl: './avatars-row.component.html',
  styleUrls: ['./avatars-row.component.scss'],
})
export class AvatarsRowComponent implements OnInit {
  @Input() title: string = "Gestiona";
  @Input() showIcon: boolean = true;

  constructor() { }

  ngOnInit(): void { }
}
