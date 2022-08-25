import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'featured-users',
  templateUrl: './featured-users.component.html',
  styleUrls: ['./featured-users.component.scss']
})
export class FeaturedUsersComponent implements OnInit {

  userData =[
    {
      profileImage:'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    },
    {
      profileImage:'https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      profileImage:'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      profileImage:'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    },
    {
      profileImage:'https://images.pexels.com/photos/2726111/pexels-photo-2726111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      profileImage:'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
