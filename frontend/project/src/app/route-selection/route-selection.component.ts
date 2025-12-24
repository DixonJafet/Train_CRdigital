import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { TicketBooking } from '../models/ticket.model';
import { addMinutes } from '../services/utils';

@Component({
  selector: 'app-route-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './route-selection.component.html',
  styleUrls: ['./route-selection.component.scss']
})
export class RouteSelectionComponent implements OnInit {
  booking: TicketBooking = this.bookingService.getBooking() || {
    from: '',
    to: '',
    date: '',
    passengers: 1,
    route: 'SanJose-Cartago',
    price: 0,
    departure_time: '',
    arrival_time: '',
    travel_time: 0

  };

  stations: string[] = [];
  times: string[] = [];
  minDate: string;
  filteredFrom: string[] = [];
  filteredTo: string[] = [];
  filteredDTime: string[] = [];
  showFromSuggestions = false;
  showToSuggestions = false;
  showDTimeSuggestions = false;
  showFromAll = false;
  showToAll = false;
  showDTimeAll = false;
  Individual_price: number = 0;
  maxSuggestions = 6;

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadStations();
  }

  loadStations(): void {
    this.bookingService.getStations(this.booking.route).subscribe(
      (data) => {
        this.stations = data;
        // Reset from/to when route changes
        this.booking.from = '';
        this.booking.to = '';
        this.booking.price = 0;
      },
      (error) => {
        console.error('Error loading stations:', error);
        this.stations = [];
      }
    );
  }

  closeAllDropdowns(): void {
    this.filteredFrom = [];
    this.filteredTo = [];
    this.showFromSuggestions = false;
    this.showToSuggestions = false;
    this.showFromAll = false;
    this.showToAll = false;
    this.showDTimeAll = false;
  }

  //this is the place to make a request of the price to a backend service
  calculatePrice(): void {
    if (!this.booking.from || !this.booking.to || !this.booking.date) {
      this.booking.price = 0;
      return;
    }
    const fromIndex = this.stations.indexOf(this.booking.from);
    const toIndex = this.stations.indexOf(this.booking.to);

    // If user typed a station that's not in the known list, we can't calculate price
    if (fromIndex < 0 || toIndex < 0) {
      this.booking.price = 0;
      return;
    }

    let basePrice = this.Individual_price;

    this.booking.price = basePrice * this.booking.passengers;
  }

  onPassengerChange(): void {
    this.calculatePrice();
  }

  onDateChange(): void {
    this.calculatePrice();
  }

  onFromChange(): void {
    const val = (this.booking.from || '').toString().trim();
    if (!val) {
      this.filteredFrom = [];
      this.showFromSuggestions = false;
      this.showFromAll = false;
    } else {
      const q = val.toLowerCase();
      this.filteredFrom = this.stations.filter(s => s.toLowerCase().includes(q)).slice(0, this.maxSuggestions);
      this.showFromSuggestions = this.filteredFrom.length > 0;
    }

    if (this.booking.from && this.booking.to && this.filteredFrom.length === 1 && this.filteredFrom[0] === this.booking.from) {
      console.log("Fetching initial info");
      this.filteredFrom = [];
      this.showFromSuggestions = false;
      this.showFromAll = false;
      this.getIinitialInfo();
    }

    if (this.booking.from && this.booking.to && this.booking.from === this.booking.to) {
      // clear the other input when user selects the same station
      this.booking.to = '';
    }
    


    this.calculatePrice();
  }

  onToChange(): void {
    const val = (this.booking.to || '').toString().trim();
    if (!val) {
      this.filteredTo = [];
      this.showToSuggestions = false;
      this.showToAll = false;
    } else {
      const q = val.toLowerCase();
      this.filteredTo = this.stations.filter(s => s.toLowerCase().includes(q)).slice(0, this.maxSuggestions);
      this.showToSuggestions = this.filteredTo.length > 0;
    }

    if (this.booking.from && this.booking.to && this.filteredTo.length === 1 && this.filteredTo[0] === this.booking.to) {
      console.log("Fetching initial info");
      this.filteredTo = [];
      this.showToSuggestions = false;
      this.showToAll = false;
      this.getIinitialInfo();
    }

    if (this.booking.from && this.booking.to && this.booking.from === this.booking.to) {
      // clear the other input when user selects the same station
      this.booking.from = '';
    }


    this.calculatePrice();
  }

  onDTimeChange():void{
    const val = (this.booking.departure_time || '').toString().trim();
    if (!val) {
      this.filteredDTime = [];
      this.showDTimeSuggestions = false;
      this.showDTimeAll = false;
    } else {
      const q = val.toLowerCase();
      this.filteredDTime = this.times.filter(t => t.toLowerCase().includes(q)).slice(0, this.maxSuggestions);
      this.showDTimeSuggestions = this.filteredDTime.length > 0;
    }


    this.calculatePrice();
  }


  getIinitialInfo(): void {
    this.bookingService.getInitialInfo(this.booking.route, this.booking.from, this.booking.to).subscribe(
      (data) => {
        this.times = data.Departure_time_list;
        this.booking.travel_time = data.travel_time;
        this.Individual_price = data.Individual_price;
      },
      (error) => {
        console.error('Error loading initial info:', error);
        this.times = [];
      }
    );
  }


  selectFrom(station: string): void {
    this.booking.from = station;
    this.filteredFrom = [];
    this.showFromSuggestions = false;
    this.showFromAll = false;
    // If selecting same as 'to', clear 'to'
        
    if (this.booking.from && this.booking.to ) {
      console.log("Fetching initial info");
      this.cleanTime();
      this.getIinitialInfo();
    }
    if (this.booking.to && this.booking.to === station) {
      this.booking.to = '';
    }

    this.calculatePrice();
  }



  selectTo(station: string): void {
    this.booking.to = station;
    this.filteredTo = [];
    this.showToSuggestions = false;
    this.showToAll = false;
    // If selecting same as 'from', clear 'from'
        
    if (this.booking.from && this.booking.to ) {
      console.log("Fetching initial info");
      this.cleanTime();
      this.getIinitialInfo();
    }
    if (this.booking.from && this.booking.from === station) {
      this.booking.from = '';
    }
    this.calculatePrice();
  }


  cleanTime():void{
    this.booking.departure_time = "";
    this.booking.arrival_time = "";
  }
  selectDTime(time: string): void { 

    this.booking.departure_time = time;
    this.filteredDTime = [];
    this.showDTimeAll = false;
    this.showDTimeSuggestions = false;
    this.booking.arrival_time = addMinutes(this.booking.departure_time,this.booking.travel_time);
    this.calculatePrice();
  }

  onRouteChange(): void {
    this.closeAllDropdowns();
    this.loadStations();
  }

  toggleFromDropdown(): void {
    this.showFromAll = !this.showFromAll;
    if (this.showFromAll) {
      this.filteredFrom = this.stations.slice();
      this.showFromSuggestions = this.filteredFrom.length > 0;
    } else {
      this.filteredFrom = [];
      this.showFromSuggestions = false;
    }
  }

  toggleToDropdown(): void {
    this.showToAll = !this.showToAll;
    if (this.showToAll) {
      this.filteredTo = this.stations.slice();
      this.showToSuggestions = this.filteredTo.length > 0;
    } else {
      this.filteredTo = [];
      this.showToSuggestions = false;
    }
  }

  toggleDTimeDropdown(): void {
    this.showDTimeAll = !this.showDTimeAll;
    if (this.showDTimeAll) {
      this.filteredDTime = this.times.slice();
      this.showDTimeSuggestions = this.filteredDTime.length > 0;
    } else {
      this.filteredDTime = [];
      this.showDTimeSuggestions = false;
    }
  }   

  isFormValid(): boolean {
    if (!this.booking.from || !this.booking.to || !this.booking.date || !this.booking.departure_time) {
      return false;
    }

    if (this.booking.from === this.booking.to) {
      return false;
    }

    // Ensure selected stations are known (so price calculation works)
    const fromIndex = this.stations.indexOf(this.booking.from);
    const toIndex = this.stations.indexOf(this.booking.to);
    if (fromIndex < 0 || toIndex < 0) {
      return false;
    }

    return this.booking.passengers > 0;
  }

  proceedToPayment(): void {
    if (this.isFormValid()) {
      this.bookingService.setBooking(this.booking);
      this.router.navigate(['/payment']);
    }
  }
}
