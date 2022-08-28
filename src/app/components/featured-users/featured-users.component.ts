import { Component, Input, OnInit } from '@angular/core';
import { Console } from 'console';

interface UserDataType{
  profileImage:string
}
@Component({
  selector: 'featured-users',
  templateUrl: './featured-users.component.html',
  styleUrls: ['./featured-users.component.scss']
})
export class FeaturedUsersComponent implements OnInit {

  @Input('inputAmount') amountOfVisibleUsers:number = 5;
  userData:UserDataType[] =[
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
    {
      profileImage:'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      profileImage:'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  ]
  visibleUsers:UserDataType[]= this.userData.slice(0,this.amountOfVisibleUsers);
  userQuantity:number = this.userData.length;
  constructor() { }

  console = console.log(this.amountOfVisibleUsers);

  trackByFn(index:number, userData:UserDataType):number{
    return index;
  }
  ngOnInit(): void {
  }

}
