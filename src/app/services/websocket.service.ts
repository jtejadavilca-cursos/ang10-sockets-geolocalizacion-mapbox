import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import * as typeFn from '../utils/functions.types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;

  constructor(
    private socket: Socket,
  ) {
    this.checkStatus();
  }

  /**
   * Método que monitorea la conexión con el servidor
   * a través de socket
   */
  checkStatus(): void {
    this.socket.on('connect', () => {
      this.socketStatus = true;
    });
    this.socket.on('disconnect', () => {
      this.socketStatus = false;
    });
  }

  /**
   * Función que emite un evento hacie el servidor a través de socket
   * @param evento Nombre del evento
   * @param payload Data que se envía al servidor cuando se ejecuta el evento
   * @param callback Función que se ejecuta luego de que el servidor responde
   */
  emit( evento: string, payload ?: any, callback?: typeFn.FuncCallback ): void {
    this.socket.emit(evento, payload, callback);
  }

  listen(evento: string): Observable<any>{
    return this.socket.fromEvent( evento );
  }
}
