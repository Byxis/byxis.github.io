import { Component, signal, ElementRef, AfterViewInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements AfterViewInit {
  private router = inject(Router);
  private elRef = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  readonly isMobileMenuOpen = signal(false);

  ngAfterViewInit() {
    // Initial active link indicator positioning
    setTimeout(() => this.updateIndicator(), 100);

    // Update whenever route finishes loading (active class is set)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      setTimeout(() => this.updateIndicator(), 50);
    });

    // Update on viewport resize
    window.addEventListener('resize', this.onResize);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('resize', this.onResize);
    });
  }

  private onResize = () => {
    this.updateIndicator();
  };

  updateIndicator() {
    const container = this.elRef.nativeElement.querySelector('.nav-links');
    const activeItem = this.elRef.nativeElement.querySelector('.nav-item.active');
    if (container && activeItem) {
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeItem.getBoundingClientRect();
      const left = activeRect.left - containerRect.left;
      const width = activeRect.width;
      container.style.setProperty('--active-left', `${left}px`);
      container.style.setProperty('--active-width', `${width}px`);
      container.style.setProperty('--active-opacity', '1');
    } else if (container) {
      container.style.setProperty('--active-opacity', '0');
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
