import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {}
