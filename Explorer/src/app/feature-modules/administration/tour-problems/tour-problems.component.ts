import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import {ProblemComment, TourProblem} from "../../marketplace/model/tour-problem";
//import {ProblemComment} from "../../marketplace/model/problem-comment";
import { AdministrationService } from '../administration.service';
import {TourDTO} from "../../tour-authoring/model/tour.model";


@Component({
  selector: 'xp-tour-problems',
  templateUrl: './tour-problems.component.html',
  styleUrls: ['./tour-problems.component.css']
})
export class TourProblemsComponent implements OnInit {
  loggedInUserId: number = 0;
  loggedInUserRole: string = '';
  tourProblems: (TourProblem & { tourName?: string, touristUsername?: string })[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  problemComments : (ProblemComment & { username?: string, userRole?: string })[] = [];
  commentText: string = ''; // To bind with textarea
  isCommentDisabled: boolean = true;
  //commentDetails: { [commentId: number]: { username?: string, userRole?: string } } = {};

  constructor(private service: AdministrationService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.loggedInUserId = user.id;  // <-- Get logged-in user ID from AuthService
      this.loggedInUserRole = user.role;
      this.loadTourProblems();
    });
  }

  loadTourProblems(): void {
    this.service.getTourProblems(this.loggedInUserId).subscribe(
      (problems) => {
        this.tourProblems = problems;
        this.tourProblems.forEach(problem => {
          this.service.getTour(problem.tourId).subscribe(
            (tour: TourDTO) => {
              problem.tourName = tour.name; // Add the tour name to the problem
            },
            (error) => console.error(`Error fetching tour name for tourId ${problem.tourId}:`, error)
          );
          this.service.getUser(problem.touristId).subscribe(
            (user) => {
              problem.touristUsername = user.username; // Add the tourist username to the problem
            },
            (error) => console.error(`Error fetching username for touristId ${problem.touristId}:`, error)
          );

          if(problem.problemComments.length > 0){
            this.problemComments = [];
            this.problemComments = problem.problemComments;
            this.problemComments.forEach(problemComment => {
              this.service.getUser(problemComment.userId).subscribe(
                (user) => {
                  if(user.role == "2"){
                    problemComment.userRole = "Tourist";
                  }
                  if(user.role == "1"){
                    problemComment.userRole = "Tour Author";
                  }
                  if(user.role == "0"){
                    problemComment.userRole = "Administartor";
                  }
                  problemComment.username = user.username;
                  //problemComment.userRole = user.role;
                },
                (error) => console.error(`Error fetching username for touristId ${problem.touristId}:`, error)
              );
            });
          }
        
        });
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error fetching tour problems';
        this.isLoading = false;
        console.error(error);
      }
    );
  }

  markAsResolved(problem: TourProblem): void {
    problem.resolved = true;
    this.service.updateProblem(problem).subscribe(
      (updatedProblem) => {
        console.log('Problem marked as resolved:', updatedProblem);
      },
      (error) => {
        console.error('Error updating problem:', error);
      }
    );
  }

  checkCommentInput(): void {
    this.isCommentDisabled = !this.commentText.trim(); // Disable if empty
  }

  onCommentChange(event: any): void {
    this.commentText = event.target.value;
  }

  submitComment(problemId: number): void {
    if (this.commentText.trim()) {
      const problemComment = {
        text: this.commentText,
        userId: this.loggedInUserId,
        tourProblemId: problemId,
        commentedAt: new Date()
      };
      this.service.addProblemComment(problemId, problemComment).subscribe(
        (response) => {
          console.log('Comment added:', response);
          this.commentText = ''; // Reset the input after submit
          this.loadTourProblems();
        },
        (error) => console.error('Error adding comment:', error)
      );
    }
  }
}