
import { UserAccount } from '../model/user-account.model';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdministrationService } from '../administration.service';

@Component({
  selector: 'xp-user-account-form',
  templateUrl: './user-account-form.component.html',
  styleUrls: ['./user-account-form.component.css']
})
export class UserAccountFormComponent {

  @Input() userAccount: UserAccount;
  @Output() userAccountUpdate = new EventEmitter<null>();
  @Input() shouldEdit: boolean = false;

  constructor(private service: AdministrationService) { }

  ngOnChanges(): void {
    this.userForm.reset();
    /*if (this.shouldEdit) {
      this.preferencesForm.patchValue(this.tourPreferences);
    }*/
      if (this.shouldEdit && this.userAccount) {
        this.userForm.patchValue({
            firstName: this.userAccount.firstName,
            lastName: this.userAccount.lastName,
            biography: this.userAccount.biography,
            motto: this.userAccount.motto,
            photo: this.userAccount.photo
        });
    }
  }

  userForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),  
    biography: new FormControl('', Validators.required),  
    motto: new FormControl('', Validators.required),  
    photo: new FormControl('', Validators.required),
    //interestTagsIn: new FormControl('', Validators.required)
  });

  updateUserAccount(): void {
   // const interestTagsInput: string = this.userForm.value.interestTagsIn || '';
    /*const interestTagsArray: string[] = interestTagsInput
      .split(',')               
      .map(tag => tag.trim())    
      .filter(tag => tag.length > 0); 
  */
    const userAccount: UserAccount = {
      firstName: this.userForm.value.firstName || "",
      lastName: this.userForm.value.lastName ||  "",
      biography: this.userForm.value.biography || "",
      motto: this.userForm.value.motto || "",
      photo: this.userForm.value.photo ||  "",
      //interestTags: interestTagsArray 
    };
    userAccount.id = this.userAccount.id;
    this.service.updateUserAccount(userAccount).subscribe({
      next: () => { this.userAccountUpdate.emit();}
    });
  }

}
