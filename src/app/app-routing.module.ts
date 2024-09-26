import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './public/pages/home/home.component';
import {FooterComponent} from "./public/components/footer/footer.component";
import {LoginComponent} from "./register/components/login/login.component";
import {RegisterComponent} from "./register/components/register/register.component";
import {ForgotPasswordComponent} from "./register/components/forgot-password/forgot-password.component";
import {PlanComponent} from "./plans/components/plan/plan.component";
import {PaymentFormComponent} from "./plans/components/payment-form/payment-form.component";
import {PageNotFoundComponent} from "./public/pages/page-not-found/page-not-found.component";
import {TechnicalReviewComponent} from "./buyer/components/technical-review/technical-review.component";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'home', component:HomeComponent },
  {path: 'footer', component:FooterComponent },
  { path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent },
  {path: 'forgot-password', component: ForgotPasswordComponent },
  {path: 'plan', component: PlanComponent },
  {path: 'payment-form', component: PaymentFormComponent },
  {path: 'technical-review', component: TechnicalReviewComponent},
  {path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
