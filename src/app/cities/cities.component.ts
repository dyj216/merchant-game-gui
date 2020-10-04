import { Component, OnInit } from '@angular/core';
import {ApiService} from '../api.service';
import {CityListElement} from '../city-list-element';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {
  cities: CityListElement[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getCities().subscribe(cities => this.cities = cities);
  }
}
