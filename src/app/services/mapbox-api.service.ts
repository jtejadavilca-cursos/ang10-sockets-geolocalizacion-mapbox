import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Lugar, Marcador } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MapboxApiService {

  constructor(
    private http: HttpClient
  ) { }

  obtenerLugares(): Observable<Marcador> {
    return this.http.get<Marcador>(`${ environment.mapbox_uri }/mapa`);
  }
}
