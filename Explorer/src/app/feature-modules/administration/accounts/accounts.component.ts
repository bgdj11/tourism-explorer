import { Component } from '@angular/core';
import { Account } from '../model/account.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent {
  
  accounts: Account[] = [];
  selectedAccount: Account;
  
  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
    this.getAccounts();
  } 
  
  getAccounts(): void {
    this.service.getAccounts().subscribe({
      next: (result: PagedResults<Account>) => {
        this.accounts = result.results;
      },
      error: () => {
      }
    })
  }
  updateAccount(account: Account): void {
    this.selectedAccount = account;
    this.selectedAccount.isActive = !account.isActive;


    this.service.updateAccount(this.selectedAccount).subscribe({
      next: () => this.getAccounts(), 
      error: (err) => {
        console.error('Update failed', err);
      }
    });
    
  }
}
