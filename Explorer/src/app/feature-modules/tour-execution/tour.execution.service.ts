import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import {Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Problem } from './model/problem.model';
import { Equipment } from './model/my-equipment.model';
import { TouristEquipment } from './model/tourist-equipment.model';
import { TourDTO } from "../tour-authoring/model/tour.model";
import {TourExecution} from "./model/tour-execution.model";
import {TourReview} from "./model/review.model";
import { MapLocation } from 'src/app/feature-modules/tour-execution/model/map-location.model';
import { TouristPositionDto } from 'src/app/feature-modules/tour-execution/model/tourist-position.model';
import { ShoppingCartDTO, ShoppingCartItemDTO } from './model/shopping-cart.model';
import { SendMessageRequest } from './model/message-request';
import { NotificationDto } from './model/notifications';
import { UserDto } from './model/all-tourists';
import { FollowersDto } from './model/followers';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class TourExecutionService {

    constructor(private http: HttpClient, private authService: AuthService) { }

    getProblem(): Observable<PagedResults<Problem>> {
      return this.http.get<PagedResults<Problem>>(environment.apiHost + 'tourist/problems')
    }

  getPosition(touristId: number): Observable<TouristPositionDto> {
    return this.http.get<TouristPositionDto>(`${environment.apiHost}tourist/position/${touristId}`);
  }

    addProblem(problem: Problem): Observable<Problem> {
        return this.http.post<Problem>(environment.apiHost + 'tourist/problems', problem);
      }

    getEquipment(): Observable<PagedResults<Equipment>> {
        return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'tourist/touristEquipment')
      }

    getByTouristAndEquipment(touristId: number, equipmentId: number): Observable<TouristEquipment> {
        return this.http.get<TouristEquipment>(`${environment.apiHost}tourist/touristEquipment/tourist/${touristId}/equipment/${equipmentId}`);
      }

    deleteEquipment(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiHost}tourist/touristEquipment/${id}`);
      }

    addTouristEquipment(touristEquipment: TouristEquipment): Observable<TouristEquipment> {
        return this.http.post<TouristEquipment>(`${environment.apiHost}tourist/touristEquipment`, touristEquipment);
      }

    startTourExecution(tourId: number, userId: number): Observable<any> {
        return this.http.post<any>(`${environment.apiHost}tourist/tour-executions/start?tourId=${tourId}&userId=${userId}`, {});
      }

    getAllTours(): Observable<TourDTO[]> {
        return this.http.get<TourDTO[]>(`${environment.apiHost}tourist/tour-executions/all-tours`);
      }

    getTourExecutionStatus(tourId: number, userId: number): Observable<TourExecution> {
        return this.http.get<TourExecution>(`${environment.apiHost}tourist/tour-executions/status?tourId=${tourId}&userId=${userId}`);
      }

    completeTourExecution(executionId: number): Observable<void> {
      return this.http.post<void>(`${environment.apiHost}tourist/tour-executions/${executionId}/complete`, {});
    }

    abandonTourExecution(executionId: number): Observable<void> {
      return this.http.post<void>(`${environment.apiHost}tourist/tour-executions/${executionId}/abandon`, {});
    }
  // Prikaz svih recenzija za turu
  getAllReviews(tourId: number, page: number, pageSize: number): Observable<PagedResults<TourReview>> {
    return this.http.get<PagedResults<TourReview>>(`${environment.apiHost}author/tours/${tourId}/reviews?page=${page}&pageSize=${pageSize}`);
  }

  // Dodavanje nove recenzije za turu
  addReview(tourId: number, review: TourReview): Observable<TourReview> {
    return this.http.post<TourReview>(`${environment.apiHost}author/tours/${tourId}/reviews`, review);
  }

  // Ažuriranje postojeće recenzije
  updateReview(reviewId: number, review: TourReview): Observable<TourReview> {
    return this.http.put<TourReview>(`${environment.apiHost}author/tours/reviews/${reviewId}`, review);
  }

  // Brisanje recenzije
  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiHost}author/tours/reviews/${reviewId}`);
  }
    checkVisitedCheckpoint(executionId: number, location: MapLocation): Observable<any> {
      return this.http.post<any>(`${environment.apiHost}tourist/tour-executions/${executionId}/check-visited-checkpoint`, location);
    }
  getCheckpointSecret(executionId: number, checkpointId: number): Observable<string> {
    return this.http.get<string>(`${environment.apiHost}tourist/tour-executions/${executionId}/checkpoint/${checkpointId}/secret`);
  }

  getToursPublished(): Observable<PagedResults<TourDTO>> {
    return this.http.get<PagedResults<TourDTO>>(environment.apiHost + 'tourist/pubishledtourss')
  }

  getShoppingCart(touristId: number): Observable<ShoppingCartDTO> {
  return this.http.get<ShoppingCartDTO>(`${environment.apiHost}tourist/shoppingcart/${touristId}`);
  }


  addTourToCart(touristId: number, shoppingCartItemDto: ShoppingCartItemDTO): Observable<any> {
  return this.http.post<any>(`${environment.apiHost}tourist/shoppingcart/add/${touristId}`, shoppingCartItemDto);
  }


  removeTourFromCart(touristId: number, tourId: number): Observable<any> {
  return this.http.delete<any>(`${environment.apiHost}tourist/shoppingcart/remove/${touristId}/${tourId}`);
  }

  checkout(touristId: number): Observable<any> {
  return this.http.post<any>(`${environment.apiHost}tourist/shoppingcart/checkout/${touristId}`, {});
  }

  getPurchasedTours(touristId: number): Observable<TourDTO[]> {
  return this.http.get<TourDTO[]>(`${environment.apiHost}tourist/tokens/purchased-tours?touristId=${touristId}`);
  }

  getAllTourists(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${environment.apiHost}tourist/allTourists`);
  }


  getFollowedTourists(page: number, pageSize: number): Observable<PagedResults<FollowersDto>> {
  const currentUserId = this.authService.user$.value.id;
  return this.http.get<PagedResults<FollowersDto>>(`${environment.apiHost}followers/follower/${currentUserId}?page=${page}&pageSize=${pageSize}`);
  }

  getNonFollowedTourists(): Observable<UserDto[]> {
  const currentUserId = this.authService.user$.value.id;
  return this.http.get<UserDto[]>(`${environment.apiHost}tourist/allTourists/nonFollowed/${currentUserId}`);
  }

  createFollower(followDto: FollowersDto): Observable<FollowersDto> {
  const currentUserId = this.authService.user$.value.id; // Uzmi ID trenutnog korisnika
  followDto.followerId = currentUserId; // Postavi ID pratioca

  return this.http.post<FollowersDto>(`${environment.apiHost}followers`, followDto); // Pozovi API endpoint
  }



  getFollowedUsers(): Observable<UserDto[]> {
  const currentUserId = this.authService.user$.value.id;
  return this.http.get<UserDto[]>(`${environment.apiHost}tourist/allTourists/followed/${currentUserId}`);
  }

  deleteFollowerByFollowingId(followingId: number): Observable<void> {
  const currentUserId = this.authService.user$.value.id;

  return this.http.delete<void>(`${environment.apiHost}followers/following/${followingId}`).pipe(
  catchError(error => {
    console.error('Error while deleting follower by followingId:', error);
    return of(void 0); // Vraća prazan rezultat u slučaju greške
  })
  );
  }


  deleteFollower(id: number): Observable<void> {
  return this.http.delete<void>(`${environment.apiHost}followers/${id}`).pipe(
  catchError(error => {
      console.error('Greška prilikom uklanjanja pratioca:', error);
      return of(void 0);
  })
  );
  }


  deleteFollowerByFollowerAndFollowingIds(followerId: number, followingId: number): Observable<void> {
  return this.http.delete<void>(`${environment.apiHost}followers/follower/${followerId}/following/${followingId}`).pipe(
  catchError(error => {
      console.error('Greška prilikom uklanjanja pratioca:', error);
      return of(void 0); // Vraća prazan rezultat u slučaju greške
  })
  );
  }


  sendMessageToFollower(request: SendMessageRequest): Observable<any> {
  return this.http.post<any>(`${environment.apiHost}notifications/send`, request);
  }

  markNotificationAsRead(notificationId: number): Observable<any> {
  return this.http.put<any>(`${environment.apiHost}notifications/mark-as-read/${notificationId}`, {});
  }

  getNotificationsForUser(userId: number): Observable<NotificationDto[]> {
  return this.http.get<NotificationDto[]>(`${environment.apiHost}notifications/${userId}`);
  }


}
