import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import {ProblemComment, TourProblem} from "../../marketplace/model/tour-problem";
//import {ProblemComment} from "../../marketplace/model/problem-comment";
import { AdministrationService } from '../administration.service';
import {TourDTO} from "../../tour-authoring/model/tour.model";
import { TourExecutionService } from '../../tour-execution/tour.execution.service';
import { SendMessageRequest } from '../../tour-execution/model/message-request';
import { NotificationDto } from '../../tour-execution/model/notifications';

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
  problemComments: { [probId: number]: (ProblemComment & { username?: string, userRole?: string })[] } = {};
  commentText:  string = ''; // To bind with textarea
  isCommentDisabled: boolean = true;
  due: Date | undefined;
  follower: number =0;
  //commentDetails: { [commentId: number]: { username?: string, userRole?: string } } = {};

  constructor(private service: AdministrationService, private authService: AuthService, private exService: TourExecutionService) { }

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
            //this.problemComments = [];
            this.problemComments[problem.id!] = problem.problemComments;
            this.problemComments[problem.id!].forEach(problemComment => {
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

  calculateTomorrow(): string {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  }

  hasDeadlineExpire(problem: TourProblem): boolean{
    if(problem.resolvingDue == undefined){
      return false;
    }
    const currentDate = new Date();
    const deadline = new Date(problem.resolvingDue!);
    if(deadline <= currentDate){
      return true;
    }
    return false;
  }

  isOlderThanFiveDays(problem: TourProblem): boolean {
    const reportedDate = new Date(problem.reportedAt); 
    const currentDate = new Date(); 
    const differenceInDays = Math.floor(
      (currentDate.getTime() - reportedDate.getTime()) / (1000 * 3600 * 24)
    );
    return !problem.resolved && differenceInDays > 5; 
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

  closeProblem(problem: TourProblem): void {
    problem.closed = true;
    this.service.updateProblem(problem).subscribe(
      (updatedProblem) => {
        console.log('Problem marked as closed:', updatedProblem);
      },
      (error) => {
        console.error('Error updating closed:', error);
      }
    );
  }

  SaveDeadline(problem: TourProblem): void {
    problem.resolvingDue = this.due;
    this.due = undefined;
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

  submitComment(problem: TourProblem & { tourName?: string, touristUsername?: string }): void {
    if (this.commentText.trim()) {
      const problemComment = {
        text: this.commentText,
        userId: this.loggedInUserId,
        tourProblemId: problem.id!,
        commentedAt: new Date()
      };
      this.service.addProblemComment(problem.id!, problemComment).subscribe(
        (response) => {
          console.log('Comment added:', response);
          this.commentText = ''; // Reset the input after submit

          if(this.loggedInUserRole ==='author'){
            this.follower = problem.touristId;
          }
          if(this.loggedInUserRole ==='tourist'){
            this.follower = problem.authorId;
          }

          if(this.loggedInUserRole ==='author' || this.loggedInUserRole ==='tourist'){
            const messageRequest: SendMessageRequest = {
              senderId: this.loggedInUserId,
              followerId: this.follower,
              content: `Imate novu poruku na prijavljenom problemu za turu ${problem.tourName}`,
              //resourceUrl: `${problem.id!}`  
              resourceUrl: 'tour-problems'
              //resourceType: this.resourceType || undefined
            };
        
            this.exService.sendMessageToFollower(messageRequest).subscribe(
              (response) => {
                console.log('Poruka i notifikacija su poslati:', response);
              },
              (error: any) => {
                console.error('Greška prilikom slanja poruke:', error);
              }
            );
        }
          this.loadTourProblems();
        },
        (error) => console.error('Error adding comment:', error)
      );
    }
  }
}