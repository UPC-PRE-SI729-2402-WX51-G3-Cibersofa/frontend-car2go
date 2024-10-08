import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favoritesUrl = 'https://car2go-fake-api.vercel.app/favorites';

  constructor(private http: HttpClient) {}

  addFavorite(carId: number): Observable<any> {
    const userId = +localStorage.getItem('id')!;
    return this.getFavoritesByUserId(userId).pipe(
      switchMap((favorites: any[]) => {
        const carFavorites = favorites.filter(fav => fav.carId === carId);
        if (carFavorites.length >= 1) {
          return of({ error: 'Cannot add the same car to favorites more than twice.' });
        } else {
          const favorite = { userId, carId };
          return this.http.post<any>(this.favoritesUrl, favorite);
        }
      })
    );
  }

  getFavoritesByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.favoritesUrl}?userId=${userId}`);
  }

  deleteFavorite(carId: number): Observable<any> {
    const userId = +localStorage.getItem('id')!;
    return this.getFavoritesByUserId(userId).pipe(
      switchMap((favorites: any[]) => {
        const favorite = favorites.find(fav => fav.carId === carId);
        if (favorite) {
          return this.http.delete<any>(`${this.favoritesUrl}/${favorite.id}`);
        } else {
          return of({ error: 'Favorite not found.' });
        }
      })
    );
  }
}
