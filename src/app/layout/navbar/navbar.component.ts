import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  readonly isMobileMenuOpen = signal(false);

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
