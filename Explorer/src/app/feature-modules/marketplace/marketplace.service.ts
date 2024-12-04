import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { TourPreferences } from './model/tour-preferences.model';
import { environment } from 'src/env/environment';
import {TourDTO} from "../tour-authoring/model/tour.model";
import {CheckpointDTO} from "../tour-authoring/model/checkpoint.model";
import { TourProblem } from './model/tour-problem';
import { ShoppingCartDTO, ShoppingCartItemDTO } from './model/shopping-cart';
import { TourSale } from './model/tour-sale.model';
import { Coupon } from './model/coupon';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

  getTourPreferences(): Observable<PagedResults<TourPreferences>> {
    return this.http.get<PagedResults<TourPreferences>>(environment.apiHost + 'tourist/tourPreferences');
  }

  addTourPreferences(tourPreferences: TourPreferences): Observable<TourPreferences> {
    return this.http.post<TourPreferences>(environment.apiHost + 'tourist/tourPreferences', tourPreferences)
  }

  deleteTourPreferences(id: number): Observable<TourPreferences> {
    return this.http.delete<TourPreferences>(environment.apiHost + 'tourist/tourPreferences/' + id);
  }
  
  updateTourPreferences(tourPreferences: TourPreferences): Observable<TourPreferences> {
    return this.http.put<TourPreferences>(environment.apiHost + 'tourist/tourPreferences/' + tourPreferences.id, tourPreferences);
  }

  private apiUrl = environment.apiHost + 'author/tours';
  getTours(page: number, pageSize: number): Observable<PagedResults<TourDTO>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResults<TourDTO>>(this.apiUrl, { params });
  }

  getPublishToursByAuthorId(authorId : number): Observable<PagedResults<TourDTO>> {
    return this.http.get<PagedResults<TourDTO>>(`${environment.apiHost}author/tours/toursByAuthorId/${authorId}`);
  }

  getCheckpointIdsByTourId(tourId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/${tourId}/checkpoint-ids`);
  }

  private checkpointUrl = environment.apiHost + 'author/tours/tour-checkpoints';
  getCheckpointById(checkpointId: number): Observable<CheckpointDTO> {
    return this.http.get<CheckpointDTO>(`${this.checkpointUrl}/${checkpointId}`);
  }

  addProblem(problem: TourProblem): Observable<TourProblem> {
    return this.http.post<TourProblem>(environment.apiHost + 'tourProblem', problem);
  }

  getTour(tourId: number): Observable<TourDTO>{
    return this.http.get<TourDTO>(`${environment.apiHost}tourProblem/tourForTourProblem/${tourId}`);
  }

  getTour1(tourId: number): Observable<TourDTO>{
    return this.http.get<TourDTO>(`${environment.apiHost}author/tours/${tourId}`);
  }

  addTourToCart(touristId: number, shoppingCartItemDto: ShoppingCartItemDTO): Observable<any> {
    return this.http.post<any>(`${environment.apiHost}tourist/shoppingcart/add/${touristId}`, shoppingCartItemDto);
    }

  getShoppingCart(touristId: number): Observable<ShoppingCartDTO> {
      return this.http.get<ShoppingCartDTO>(`${environment.apiHost}tourist/shoppingcart/${touristId}`);
      }

  removeTourFromCart(touristId: number, tourId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiHost}tourist/shoppingcart/remove/${touristId}/${tourId}`);
    }
  
  checkout(touristId: number): Observable<any> {
    return this.http.post<any>(`${environment.apiHost}tourist/shoppingcart/checkout/${touristId}`, {});
    }

  addSale(tourSale: TourSale): Observable<TourSale> {
      return this.http.post<TourSale>(environment.apiHost + 'author/tourSale', tourSale);
    }

  getTourSales(): Observable<PagedResults<TourSale>> {
      return this.http.get<PagedResults<TourSale>>(environment.apiHost + 'author/tourSale')
    }
  
  activateSales(tourSales: TourSale[]): Observable<string> {
    return this.http.post<string>(environment.apiHost +'author/tourSale/activateSales', tourSales);
  }
  
  deactivateSales(tourSales: TourSale[]): Observable<string> {
    return this.http.post<string>(environment.apiHost +'author/tourSale/deactivateSales', tourSales);
  }

  deleteTourSale(id: number): Observable<TourSale> {
    return this.http.delete<TourSale>(environment.apiHost + 'author/tourSale/' + id);
  }

  updateTourSale(tourSale: TourSale): Observable<TourSale> {
    return this.http.put<TourSale>(environment.apiHost + 'author/tourSale/' + tourSale.id, tourSale);
  }
  
    getCoupons(page: number, pageSize: number): Observable<PagedResults<Coupon>> {
      let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
  
      return this.http.get<PagedResults<Coupon>>(environment.apiHost + 'author/coupon', { params });
    }

    getCouponById(id : number) : Observable<Coupon> {
      return this.http.get<Coupon>(environment.apiHost + `author/coupon/${id}`);
    }
  
    createCoupon(coupon: Coupon): Observable<Coupon> {
      return this.http.post<Coupon>(environment.apiHost + 'author/coupon', coupon);
  
    }
  
    updateCoupon(coupon: Coupon): Observable<Coupon> {
      return this.http.put<Coupon>(environment.apiHost + 'author/coupon/' + coupon.id, coupon);
    }
  
    deleteCoupon(id: number): Observable<void> {
      return this.http.delete<void>(environment.apiHost + `author/coupon/${id}`);
    }
}
