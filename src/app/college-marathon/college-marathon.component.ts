import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: '.college-marathon',
  templateUrl: './college-marathon.component.html',
  styleUrls: ['./college-marathon.component.scss']
})
export class CollegeMarathonComponent implements OnInit {

  constructor(
    public utilityService: UtilityService
  ) { }

  ngOnInit(): void { }
}
