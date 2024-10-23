import { Component,OnInit} from '@angular/core';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { UserAccount } from '../model/user-account.model';

@Component({
  selector: 'xp-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {
  
  ngOnInit(): void {
    this.getUserAccount();
    this.userAccount.push(this.user1);
  }

  userAccount: UserAccount[] = [];
  selectedUserAccount: UserAccount;
  user1:UserAccount={id:0, firstName:"Nikola", lastName:"Lakic",motto:"moto1",biography:"biography1",photo:"photo"}
  shouldRenderUserAccountForm: boolean = false;
  shouldEdit: boolean = false;


  constructor(private service: AdministrationService) { }

  getUserAccount(): void {
    this.service.getUserAccount().subscribe({
      next: (result: PagedResults<UserAccount>) => {
        this.userAccount = result.results;
      },
      error: () => {
      }
    })
  }

  onEditClicked(userAccount: UserAccount): void {
    this.selectedUserAccount = userAccount;
    this.shouldRenderUserAccountForm = true;
    this.shouldEdit = true;
  }



}
