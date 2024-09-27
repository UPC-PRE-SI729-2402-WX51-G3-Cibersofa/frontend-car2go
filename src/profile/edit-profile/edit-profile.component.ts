import { Component } from '@angular/core';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatFormField,
    MatButton,
    MatInput
  ],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
