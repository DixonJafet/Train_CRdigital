import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketBooking, TicketInitialInfo} from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private currentBooking: TicketBooking | null = null;
  private apiUrl = 'https://traincrdigital-production.up.railway.app/api/stations';

  constructor(private http: HttpClient) {}

  setBooking(booking: TicketBooking): void {
    this.currentBooking = booking;
  }

  getBooking(): TicketBooking | null {
    return this.currentBooking;
  }

  clearBooking(): void {
    this.currentBooking = null;
  }

  getInitialInfo(route: string, from: string, to: string): Observable<any> {
    const url = `${this.apiUrl}/ticketInfo`;
    const body = { route, from, to };
    return this.http.post<TicketInitialInfo>(url, body);
  }

  getStations(route: string): Observable<string[]> {
    const url = `${this.apiUrl}/${route}`;
    return this.http.get<string[]>(url);
  }
}
