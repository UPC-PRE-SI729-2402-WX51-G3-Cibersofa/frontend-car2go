import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favoritesUrl = 'http://localhost:8080/api/v1/favorites';

  constructor(private http: HttpClient) {}

  addFavorite(vehicleId: number): Observable<any> {
    return this.http.post<any>(`${this.favoritesUrl}/${vehicleId}`, {});
  }

  getMyFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.favoritesUrl}/my-favorites`);
  }

  deleteFavorite(vehicleId: number): Observable<any> {
    return this.http.delete<any>(`${this.favoritesUrl}/${vehicleId}`);
  }
}
