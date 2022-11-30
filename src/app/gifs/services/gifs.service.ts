import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private apiUrl: string = 'https://api.giphy.com/v1/gifs';
  private apiKey: string = 'yY18icoumpwYLT0Oq1pKPPWs8YaL1gPo';
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {

    // Muestra Gifs por defecto al iniciar

    if(localStorage.length == 0) {
      const params = new HttpParams()
        .set('api_key', this.apiKey)
        .set('limit', '10');

      this.http
        .get<SearchGifsResponse>(`${this.apiUrl}/trending`, { params })
        .subscribe((resp) => {
          this.resultados = resp.data;
        });
    }

    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('ultimaBusqueda')!) || [];
  }

  buscarGifs(query: string = '') {
    query = query.trim().toLocaleLowerCase();

    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http
      .get<SearchGifsResponse>(
        `${this.apiUrl}/search`, { params }
      )
      .subscribe((resp) => {
        this.resultados = resp.data;
        localStorage.setItem('ultimaBusqueda', JSON.stringify(this.resultados));
      });
  }
}
