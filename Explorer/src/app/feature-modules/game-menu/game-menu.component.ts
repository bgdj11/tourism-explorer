import { Component } from '@angular/core';

@Component({
  selector: 'xp-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.css']
})
export class GameMenuComponent {
  ngOnInit(): void {
    document.body.classList.add('lock-vh');   // zabrani scroll samo na ovoj strani
  }

  ngOnDestroy(): void {
    document.body.classList.remove('lock-vh'); // vrati normalno ponašanje
  }
}
