export interface TicketBooking {
  from: string;
  to: string;
  date: string;
  passengers: number;
  route: 'SanJose-Cartago' | 'SanJose-Belén' | 'SanJose-Alajuela';
  price: number;
  departure_time: string;
  arrival_time: string;
  travel_time: number;
}

export interface TicketInitialInfo {
  Departure_time_list: string[];
  travel_time: number;
  Individual_price: number;
}

export interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  email: string;
}
