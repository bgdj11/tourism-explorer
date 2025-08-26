import {
  Component, HostListener, OnInit, AfterViewInit, OnDestroy,
  ElementRef, ViewChild
} from '@angular/core';
import { SpaceInvadersService } from './space-invaders.service';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { User } from '../../infrastructure/auth/model/user.model';


interface Enemy { x: number; y: number; }

@Component({
  selector: 'app-space-invaders',
  templateUrl: './space-invaders.component.html',
  styleUrls: ['./space-invaders.component.css']
})
export class SpaceInvadersComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('stageWrap', { static: true }) stageWrapRef!: ElementRef<HTMLElement>;
  @ViewChild('stage',     { static: true }) stageRef!:     ElementRef<HTMLElement>;

  readonly baseWidth  = 600;
  readonly baseHeight = 420;

  // OVE dimenzije direktno vežemo u HTML – zato niko spolja ne može da ih pregazi
  readonly playerW = 44;
  readonly playerH = 36;
  readonly enemySize = 40;
  readonly projW = 5;
  readonly projH = 15;

  player = { x: (this.baseWidth - this.playerW) / 2 };
  readonly playerBottom = 10;

  enemies: Enemy[] = [];
  projectile = { x: 0, y: 0, active: false };

  interval: any;
  gameTimer: any;
  gameTime = 0;
  finalScore = 0;
  user?: User;
  gameOverFlag = false;

  private ro?: ResizeObserver;

  constructor(
    private service: SpaceInvadersService,
    private auth: AuthService
  ){
    this.auth.user$.subscribe(u => this.user = u);
  }

  ngOnInit(){ this.startGame(); }

  ngAfterViewInit(): void {
    const wrap = this.stageWrapRef.nativeElement;
    const stage = this.stageRef.nativeElement;
    const recalc = () => {
      const scale = Math.min(wrap.clientWidth  / this.baseWidth,
        wrap.clientHeight / this.baseHeight) * 0.98;
      stage.style.setProperty('--scale', String(scale));
    };
    recalc();
    this.ro = new ResizeObserver(recalc);
    this.ro.observe(wrap);
  }

  ngOnDestroy(){ this.clearTimers(); this.ro?.disconnect(); }

  // ---- GAME ----
  startGame(){
    this.gameOverFlag = false;
    this.gameTime = 0;
    this.enemies = [];
    this.player.x = (this.baseWidth - this.playerW) / 2;

    this.generateEnemies();
    this.interval   = setInterval(() => this.moveEnemies(), 500);
    this.gameTimer  = setInterval(() => this.gameTime++, 1000);
  }
  restartGame(){ this.clearTimers(); this.startGame(); }
  private clearTimers(){ clearInterval(this.interval); clearInterval(this.gameTimer); }

  generateEnemies(){
    const cols = 5, rows = 3;
    const margin = Math.max(12, Math.floor((this.baseWidth - cols * this.enemySize) / (cols + 1)));
    const step = this.enemySize + margin;
    const startX = margin, startY = 40;
    for(let j=0;j<rows;j++){
      for(let i=0;i<cols;i++){
        this.enemies.push({ x: startX + i*step, y: startY + j*step });
      }
    }
  }

  moveEnemies(){
    if(this.gameOverFlag) return;
    const maxX = this.baseWidth - this.enemySize;
    for(const e of this.enemies){
      e.x += 10;
      if(e.x > maxX) e.x = 0;
    }
  }

  fireProjectile(){
    if(this.projectile.active || this.gameOverFlag) return;
    this.projectile.x = Math.floor(this.player.x + (this.playerW - this.projW)/2);
    this.projectile.y = Math.floor(this.baseHeight - this.playerH - this.playerBottom - this.projH);
    this.projectile.active = true;
    const it = setInterval(()=>{
      this.projectile.y -= 10;
      this.checkHit();
      if(this.projectile.y < 0){
        this.projectile.active = false;
        clearInterval(it);
      }
    }, 50);
  }

  checkHit(){
    for(let i=0;i<this.enemies.length;i++){
      const e = this.enemies[i];
      const hitX = (this.projectile.x + this.projW) > e.x && this.projectile.x < (e.x + this.enemySize);
      const hitY = (this.projectile.y + this.projH) > e.y && this.projectile.y < (e.y + this.enemySize);
      if(hitX && hitY){
        this.enemies.splice(i,1);
        this.projectile.active = false;
        this.checkGameOver();
        break;
      }
    }
  }

  checkGameOver(){
    if(this.enemies.length === 0){
      this.finalScore = this.gameTime;
      this.gameOverFlag = true;
      alert(`Kraj igre! Vreme trajanja: ${this.gameTime} sekundi`);
      this.endGame();
    }
  }

  endGame(){
    this.clearTimers();
    const userId = this.user?.id;
    if(!userId) return;
    const gameId = 1;
    this.service.saveScore(gameId, userId, this.finalScore).subscribe({
      next: () => {
        this.service.awardTopScorerCoupon().subscribe({
          next: r => alert(r.message || 'Coupon awarded successfully!'),
          error: e => console.error('Error awarding coupon:', e)
        });
      },
      error: e => console.error('Failed to save score:', e)
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent){
    if(this.gameOverFlag) return;
    const maxLeft = 0, maxRight = this.baseWidth - this.playerW;
    if(e.key === 'ArrowLeft'){
      this.player.x = Math.max(maxLeft, this.player.x - 15);
    }else if(e.key === 'ArrowRight'){
      this.player.x = Math.min(maxRight, this.player.x + 15);
    }else if(e.key === ' '){
      this.fireProjectile();
    }
  }
}

