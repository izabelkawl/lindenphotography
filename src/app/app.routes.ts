import { Routes } from '@angular/router';
import { AboutPage } from './pages/about.page';
import { ContactPage } from './pages/contact.page';
import { OffersPage } from './pages/offers.page';
import { PortfolioPage } from './pages/portfolio.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'o-mnie' },
  { path: 'o-mnie', component: AboutPage },
  { path: 'portfolio', component: PortfolioPage },
  { path: 'oferta', component: OffersPage },
  { path: 'kontakt', component: ContactPage },
  { path: '**', redirectTo: 'o-mnie' },
];
