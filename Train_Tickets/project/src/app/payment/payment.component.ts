import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { TicketBooking, PaymentInfo } from '../models/ticket.model';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [QRCodeComponent, CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  booking: TicketBooking | null = null;
  bookingString: string = '';
  showConfirmation = false;
  qrCodeColorDark: string = '#ff8c00';
  qrCodeColorLight: string = '#FFFFFF';


  payment: PaymentInfo = {
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    email: ''
  };

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.booking = this.bookingService.getBooking();
    if (!this.booking) {
      this.router.navigate(['/route-selection']);
    }
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.payment.cardNumber = formattedValue;
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\//g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    this.payment.expiryDate = value;
  }

  isFormValid(): boolean {
    const cardNumberValid = this.payment.cardNumber.replace(/\s/g, '').length === 16;
    const cardHolderValid = this.payment.cardHolder.trim().length > 0;
    const expiryValid = /^\d{2}\/\d{2}$/.test(this.payment.expiryDate);
    const cvvValid = /^\d{3,4}$/.test(this.payment.cvv);
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.payment.email);

    return cardNumberValid && cardHolderValid && expiryValid && cvvValid && emailValid;
  }

  submitPayment(): void {
    console.log(this.bookingService.getBooking());
    this.booking = this.bookingService.getBooking();
    if (this.booking) {
      const resultString = Object.entries(this.booking).map(([key, value]) => `${key}: ${value}`).join(', \n');
     // this.bookingString = JSON.stringify(this.booking);
     this.bookingString = resultString;
    }
    if (this.isFormValid()) {
      this.showConfirmation = true;
    }
  }

  backToRouteSelection(): void {
    this.router.navigate(['/route-selection']);
  }

  startNewBooking(): void {
    this.bookingService.clearBooking();
    this.router.navigate(['/route-selection']);
  }
}
