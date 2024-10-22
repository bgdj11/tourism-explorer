import { Component, OnInit } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Problem } from '../model/problem.model';
import { AdministrationService } from '../administration.service';

@Component({
  selector: 'xp-all-problems',
  templateUrl: './all-problems.component.html',
  styleUrls: ['./all-problems.component.css']
})
export class AllProblemsComponent implements OnInit {

  problems: Problem[] = [];

  constructor(private service: AdministrationService) { }

  ngOnInit(): void {

    this.getProblem();
  }

  getProblem(): void {
    this.service.getProblem().subscribe({
      next: (result: PagedResults<Problem>) => {
        console.log(result.results);
        this.problems = result.results;
      },
      error: () => {
      }
    })
  }


}
