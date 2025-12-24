import { Routes } from '@angular/router';
import { RouteSelectionComponent } from './route-selection/route-selection.component';
import { PaymentComponent } from './payment/payment.component';

export const routes: Routes = [
  { path: '', redirectTo: '/route-selection', pathMatch: 'full' },
  { path: 'route-selection', component: RouteSelectionComponent },
  { path: 'payment', component: PaymentComponent }
];
