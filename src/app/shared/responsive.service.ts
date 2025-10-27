/**
 * RESPONSIVE UTILITY SERVICE
 * 
 * Provides utilities for responsive behavior in TypeScript/Angular components.
 * Use this for conditional logic based on screen size.
 * 
 * Usage:
 * 1. Inject in component constructor: constructor(private responsive: ResponsiveService) {}
 * 2. Subscribe to breakpoint changes: this.responsive.isDesktop$.subscribe(...)
 * 3. Get current state: this.responsive.isMobile()
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

export enum Breakpoint {
  XS = 480,
  SM = 640,
  MD = 768,
  LG = 1024,
  XL = 1280
}

export interface ResponsiveState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private stateSubject: BehaviorSubject<ResponsiveState>;
  public state$: Observable<ResponsiveState>;

  // Convenient observables for specific breakpoints
  public isMobile$: Observable<boolean>;
  public isTablet$: Observable<boolean>;
  public isDesktop$: Observable<boolean>;
  public isLandscape$: Observable<boolean>;

  constructor() {
    // Initialize with current viewport
    const initialState = this.calculateState();
    this.stateSubject = new BehaviorSubject<ResponsiveState>(initialState);
    this.state$ = this.stateSubject.asObservable();

    // Setup derived observables
    this.isMobile$ = this.state$.pipe(map(s => s.isMobile), distinctUntilChanged());
    this.isTablet$ = this.state$.pipe(map(s => s.isTablet), distinctUntilChanged());
    this.isDesktop$ = this.state$.pipe(map(s => s.isDesktop), distinctUntilChanged());
    this.isLandscape$ = this.state$.pipe(map(s => s.isLandscape), distinctUntilChanged());

    // Listen to window resize with debouncing
    if (typeof window !== 'undefined') {
      fromEvent(window, 'resize')
        .pipe(
          debounceTime(150),
          map(() => this.calculateState()),
          distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
        )
        .subscribe(state => this.stateSubject.next(state));
    }
  }

  /**
   * Calculate current responsive state
   */
  private calculateState(): ResponsiveState {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const height = typeof window !== 'undefined' ? window.innerHeight : 768;
    
    const isMobile = width < Breakpoint.MD;
    const isTablet = width >= Breakpoint.MD && width < Breakpoint.LG;
    const isDesktop = width >= Breakpoint.LG;
    const isLandscape = width > height;

    let breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    if (width < Breakpoint.XS) breakpoint = 'xs';
    else if (width < Breakpoint.SM) breakpoint = 'sm';
    else if (width < Breakpoint.MD) breakpoint = 'md';
    else if (width < Breakpoint.LG) breakpoint = 'lg';
    else breakpoint = 'xl';

    return { width, height, isMobile, isTablet, isDesktop, isLandscape, breakpoint };
  }

  /**
   * Synchronous getters for current state
   */
  isMobile(): boolean {
    return this.stateSubject.value.isMobile;
  }

  isTablet(): boolean {
    return this.stateSubject.value.isTablet;
  }

  isDesktop(): boolean {
    return this.stateSubject.value.isDesktop;
  }

  isLandscape(): boolean {
    return this.stateSubject.value.isLandscape;
  }

  getBreakpoint(): 'xs' | 'sm' | 'md' | 'lg' | 'xl' {
    return this.stateSubject.value.breakpoint;
  }

  getWidth(): number {
    return this.stateSubject.value.width;
  }

  getHeight(): number {
    return this.stateSubject.value.height;
  }

  /**
   * Utility: Get optimal board size for current viewport
   * Returns recommended board size (4-8) based on screen size
   */
  getOptimalBoardSize(): number {
    const width = this.getWidth();
    if (width < Breakpoint.XS) return 4;      // Very small phones
    if (width < Breakpoint.SM) return 5;      // Phones
    if (width < Breakpoint.MD) return 6;      // Large phones / small tablets
    if (width < Breakpoint.LG) return 7;      // Tablets
    return 8;                                  // Desktop
  }

  /**
   * Utility: Check if screen can comfortably display board size
   */
  canDisplayBoardSize(size: number, cellSize: number = 52): boolean {
    const width = this.getWidth();
    const requiredWidth = size * cellSize + 200; // Board + controls estimate
    return width >= requiredWidth;
  }
}
