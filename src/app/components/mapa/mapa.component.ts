import { Component, OnInit } from '@angular/core';
import { Lugar } from '../../interfaces/interfaces';

import * as mapboxgl from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {

  subsSocketNuevoMarcador: Subscription;
  subsSocketMoverMarcador: Subscription;
  subsSocketBorrarMarcador: Subscription;

  map: mapboxgl.Map;

  lugares: Lugar[] = [{
    id: '1',
    nombre: 'Fernando',
    lng: -75.75512993582937,
    lat: 45.349977429009954,
    color: '#dd8fee'
  },
  {
    id: '2',
    nombre: 'Amy',
    lng: -75.75195645527508,
    lat: 45.351584045823756,
    color: '#790af0'
  },
  {
    id: '3',
    nombre: 'Orlando',
    lng: -75.75900589557777,
    lat: 45.34794635758547,
    color: '#19884b'
  }];

  constructor(
    private wsService: WebsocketService
  ) { }

  ngOnInit(): void {
    this.crearMapa();
  }

  escucharSockets(): void {
    // marcador nuevo
    this.subsSocketNuevoMarcador = this.wsService.listen('nuevo-marcador')
                                                  .subscribe( ( marcador: Lugar ) => this.agregarMarcador(marcador));
    // marcador mover
    this.subsSocketMoverMarcador = this.wsService.listen('mover-marcador')
                                                  .subscribe( ( marcador: Lugar ) => console.log(marcador) );
    // marcador borrar
    this.subsSocketBorrarMarcador = this.wsService.listen('eliminar-marcador')
                                                  .subscribe( ( marcador: Lugar ) => console.log(marcador) );
  }


  crearMapa(): void {
    // mapboxgl.accessToken = 'pk.eyJ1IjoianRlamFkYXZpbGNhIiwiYSI6ImNrYzh0MWEzdjFhMnUzM3Q2a29pYWZmeWMifQ.CFhqO2DmWR1zfZu_4uh-Ng';
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoianRlamFkYXZpbGNhIiwiYSI6ImNrYzh0a3JuMTB3M2cycm80Znd0cGVnNHUifQ.dAlZAKbhT0uV9R1BCyrNng';
    this.map = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-75.75512993582937, 45.34794635758547],
      zoom: 15.8
    });

    this.lugares.forEach( lugar => {
      this.agregarMarcador(lugar);
    });
  }

  agregarMarcador( marcador: Lugar ): void {

    // POPUP MARCADOR
    const h2 = document.createElement('h2');
    h2.innerText = marcador.nombre;

    const btnBorrar = document.createElement('button');
    btnBorrar.innerText = 'Borrar';

    const div = document.createElement('div');
    div.append(h2, btnBorrar);
    // FIN POPUP MARCADOR

    const customPopup = new mapboxgl.Popup({
      offset: 25,
      closeOnClick: false
    }).setDOMContent(div);

    const marker = new mapboxgl.Marker({
      draggable: true,
      color: marcador.color
    })
    .setLngLat([marcador.lng, marcador.lat])
    .setPopup(customPopup)
    .addTo( this.map );

    marker.on('drag', () => {
      const lngLat = marker.getLngLat();
      console.log(lngLat);
    });


    btnBorrar.addEventListener('click', () => {
      marker.remove();
    });
  }

  crearMarcador(): void {
    const customMarker: Lugar = {
      id: new Date().toISOString(),
      lng: -75.75512993582937,
      lat: 45.34794635758547,
      nombre: 'Sin nombre',
      color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    };

    this.agregarMarcador(customMarker);
  }
}
