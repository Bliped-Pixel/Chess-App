/**
 * EXAMPLE: Using ResponsiveService in a Component (OPTIONAL)
 * 
 * Most components don't need this - CSS handles responsiveness automatically!
 * Use this service only when you need programmatic control based on screen size.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsiveService } from './responsive.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-responsive-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="example-container">
      <h2>Responsive Example</h2>
      
      <!-- Method 1: Pure CSS (Recommended) -->
      <div class="board-container">
        <!-- CSS variables handle sizing automatically -->
        <div class="cell">Cell auto-sizes</div>
      </div>
      
      <!-- Method 2: Observable with async pipe -->
      <div *ngIf="responsive.isMobile$ | async">
        <p>Mobile-only content</p>
      </div>
      
      <!-- Method 3: Component property -->
      <div *ngIf="showDesktopFeature">
        <p>Desktop-only feature</p>
      </div>
      
      <!-- Method 4: State display (debug) -->
      <div class="debug-info">
        <p>Current breakpoint: {{ responsive.getBreakpoint() }}</p>
        <p>Screen width: {{ responsive.getWidth() }}px</p>
        <p>Is Mobile: {{ responsive.isMobile() }}</p>
        <p>Optimal board size: {{ responsive.getOptimalBoardSize() }}</p>
      </div>
    </div>
  `,
  styles: [`
    /* Styles automatically responsive via CSS variables */
    .example-container {
      padding: var(--container-padding);
    }
    
    .debug-info {
      background: #f0f0f0;
      padding: 1rem;
      border-radius: 8px;
      font-size: var(--font-size-body);
    }
  `]
})
export class ResponsiveExampleComponent implements OnInit, OnDestroy {
  showDesktopFeature = false;
  private destroy$ = new Subject<void>();

  constructor(public responsive: ResponsiveService) {
    // Public for template access
  }

  ngOnInit(): void {
    // Example: Subscribe to breakpoint changes
    this.responsive.isDesktop$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDesktop => {
        this.showDesktopFeature = isDesktop;
        console.log('Desktop mode:', isDesktop);
      });

    // Example: One-time check on init
    if (this.responsive.isMobile()) {
      console.log('Component initialized on mobile device');
    }

    // Example: Get recommended board size
    const optimalSize = this.responsive.getOptimalBoardSize();
    console.log('Optimal board size for this screen:', optimalSize);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
