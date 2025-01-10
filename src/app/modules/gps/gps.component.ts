import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.css'],
})
export class GpsComponent implements OnInit, AfterViewInit {
  // current language
  currentLanguage: any = localStorage.getItem('lang');
  isDropdownActive = false;
  private map: any;
  private centroid: L.LatLngExpression = [42.3601, -71.0589]; //
  markers: L.Marker[] = []; // Array to store markers
  teamMembers: any[] = [];
  searchText: string = '';

  initMap(teamMembers: any[]): void {
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
          '&copy; <a href="https://www.aktitec.com/">Aktitec Open Street Map</a>',
      }
    );

    for (var i = 0; i < teamMembers?.length; i++) {
      if (
        teamMembers[i]['latitude'] != null ||
        teamMembers[i]['longitude'] != null
      ) {
        var marker = L.marker(
          [teamMembers[i]['latitude'], teamMembers[i]['longitude']],
          {
            opacity: 0.01,
          }
        )
          .bindTooltip(teamMembers[i]['userName'], {
            permanent: true,
            className: 'my-label',
            offset: [0, 0],
          })
          .bindPopup(teamMembers[i]['userName'])
          .addTo(this.map);
        this.markers.push(marker); // Store the marker in the array
      }
    }

    tiles.addTo(this.map);

    // // create 5 random jitteries and add them to map
    // const jittery = teamMembers
    //   .map((x) => [
    //     x['latitude'] + (Math.random() - 0.5) / 10,
    //     x['longitude'] + (Math.random() - 0.5) / 10,
    //   ])
    //   .map((x) => L.marker(x as L.LatLngExpression, { opacity: 0.01 }))
    //   .forEach((x) => {
    //     x.bindTooltip('yes', {
    //       permanent: true,
    //       className: 'my-label',
    //       offset: [0, 0],
    //     });
    //     return x.addTo(this.map);
    //   });
  }

  constructor(
    private toastr: ToastrService,
    private locationService: LocationService
  ) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.getLocations();
  }
  toggleDropdown(): void {
    this.isDropdownActive = !this.isDropdownActive;
  }
  close() {
    this.isDropdownActive = false;
  }

  showOnMap(teamMembers: any[]): void {
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="https://www.aktitec.com/">Aktitec Open Street Map</a>',
      }
    );

    for (var i = 0; i < teamMembers?.length; i++) {
      if (
        teamMembers[i]['latitude'] != null ||
        teamMembers[i]['longitude'] != null
      ) {
        var marker = L.marker(
          [teamMembers[i]['latitude'], teamMembers[i]['longitude']],
          {
            opacity: 0.01,
          }
        )
          .bindTooltip(teamMembers[i]['userName'], {
            permanent: true,
            className: 'my-label',
            offset: [0, 0],
          })
          .bindPopup(teamMembers[i]['userName'])
          .addTo(this.map);
        this.markers.push(marker); // Store the marker in the array
      }
    }
    tiles.addTo(this.map);
  }

  // get locations
  getLocations() {
    this.locationService.getLocations('teamMembers/locations').subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          this.teamMembers = data?.value;
        } else {
          this.toastr.warning('Failed to get locations', 'Warning');
        }
      },
      error: (error) => {
        console.error('Error updating location:', error);
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
      },
      complete: () => {
        this.initMap(this.teamMembers);
      },
    });
  }
  // get locations
  async refresh() {
    await this.removeMarkers();
    this.locationService.getLocations('teamMembers/locations').subscribe({
      next: (data: any) => {
        console.log(data);
        if (data?.isSuccess) {
          this.teamMembers = data?.value;
        } else {
          this.toastr.warning('Failed to get locations', 'Warning');
        }
      },
      error: (error) => {
        console.error('Error updating location:', error);
        if (this.currentLanguage == 'ar') {
          this.toastr.error('هناك شيء خاطئ', 'خطأ');
        } else {
          this.toastr.error('There Is Somthing Wrong', 'Error');
        }
      },
      complete: () => {
        this.showOnMap(this.teamMembers);
      },
    });
  }

  removeMarkers(): void {
    // Loop through the markers array and remove each marker
    this.markers.forEach((marker) => {
      this.map.removeLayer(marker); // Removes the marker from the map
    });

    // Optionally clear the markers array to free up memory
    this.markers = [];
  }
}
