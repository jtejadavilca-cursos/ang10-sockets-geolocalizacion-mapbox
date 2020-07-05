import { Component, OnInit } from '@angular/core';
import { Lugar, Marcador } from '../../interfaces/interfaces';

import * as mapboxgl from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../services/websocket.service';
import { MapboxApiService } from '../../services/mapbox-api.service';

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

  lugares: Marcador = {};
  markersMapbox: { [id: string]: mapboxgl.Marker } = {};

  constructor(
    private wsService: WebsocketService,
    private mboxService: MapboxApiService
  ) { }

  ngOnInit(): void {
    this.obtenerMarcadores();
    this.escucharSockets();
  }

  escucharSockets(): void {
    // marcador nuevo
    this.subsSocketNuevoMarcador = this.wsService.listen('nuevo-marcador')
                                                  .subscribe( ( marcador: Lugar ) => this.agregarMarcador(marcador));
    // marcador mover
    this.subsSocketMoverMarcador = this.wsService.listen('mover-marcador')
                                                  .subscribe( ( marcador: Lugar ) =>{
                                                    this.markersMapbox[ marcador.id ].setLngLat([marcador.lng, marcador.lat]);
                                                  });
    // marcador borrar
    this.subsSocketBorrarMarcador = this.wsService.listen('eliminar-marcador')
                                                  .subscribe( ( id: string ) => {
                                                    this.markersMapbox[ id ].remove();
                                                    delete this.markersMapbox[ id ];
                                                    delete this.lugares[ id ];
                                                  });
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

    for ( const [key, marcador] of Object.entries(this.lugares)) {
      this.agregarMarcador(marcador);
    }
  }

  agregarMarcador( marcador: Lugar ): void {
    console.log('Agregar marcador...');
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
      this.moverMarcador(marcador.id, lngLat);
    });


    btnBorrar.addEventListener('click', () => {
      marker.remove();
      this.borrarMarcador( marcador.id );
    });


    this.markersMapbox[ marcador.id ] = marker;
  }

  // Service
  obtenerMarcadores(): void {
    this.mboxService.obtenerLugares()
          .subscribe( resp => {
              console.log('resp ', resp);
              this.lugares = resp;
              this.crearMapa();
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
    this.wsService.emit( 'nuevo-marcador',  customMarker);
  }

  borrarMarcador( id: string ): void {

    this.wsService.emit( 'eliminar-marcador',  id);
  }

  moverMarcador(id: string, lngLat: mapboxgl.LngLat): void {
    this.wsService.emit( 'mover-marcador',  {
      id,
      lng: lngLat.lng,
      lat: lngLat.lat
    });
  }
}
