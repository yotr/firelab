import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.css'],
})
export class GpsComponent implements OnInit, AfterViewInit {
  private map: any;
  private centroid: L.LatLngExpression = [42.3601, -71.0589]; //
  private initMap(): void {
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 3,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    // create 5 random jitteries and add them to map
    const jittery = Array(5)
      .fill(this.centroid)
      .map((x) => [
        x[0] + (Math.random() - 0.5) / 10,
        x[1] + (Math.random() - 0.5) / 10,
      ])
      .map((x) => L.marker(x as L.LatLngExpression))
      .forEach((x) => x.addTo(this.map));

    tiles.addTo(this.map);
  }

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.initMap();
  }
}
