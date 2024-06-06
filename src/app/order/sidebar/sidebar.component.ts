import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
constructor(private router: Router) {}

  addUser() {
    this.router.navigate(['/mfe1/orderComponent/mfe-user/homeComponent/addUserComponent']);
  }

  addRole(){
    this.router.navigate(['/mfe1/orderComponent/mfe-user/homeComponent/addrolecomponent']);

  }
  ListUsers(){
    this.router.navigate(['/mfe1/orderComponent/mfe-user/homeComponent/userListComponent']);


  }

  ListRoles(){
    this.router.navigate(['/mfe1/orderComponent/mfe-user/homeComponent/roleListComponent']);

  }
  
}
