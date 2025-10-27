# Responsive Design System

## Overview

This application uses a **modular, CSS-variable-based responsive design system** that automatically adapts to different screen sizes without cluttering component code.

## Architecture

### 1. **CSS Custom Properties (Variables)** 
Location: `src/styles/responsive.css`

All sizing is controlled through CSS variables that change at different breakpoints:
- `--cell-size`: Chess board cell dimensions
- `--piece-btn-size`: Piece selector button size
- `--left-panel-width`: Side panel width
- `--font-size-*`: Typography scale
- `--container-padding`: Spacing values

### 2. **Breakpoints**

| Breakpoint | Min Width | Target Devices |
|------------|-----------|----------------|
| XS | 0px | Portrait phones |
| SM | 640px | Landscape phones, small tablets |
| MD | 768px | Tablets |
| LG | 1024px | Laptops, desktops |
| XL | 1280px | Large desktops |

### 3. **Mobile-First Approach**

Base styles target mobile devices. Styles progressively enhance for larger screens using `min-width` media queries.

## Usage Guide

### In CSS Files

No changes needed! Your existing CSS automatically inherits responsive variables:

```css
/* Before (fixed size) */
.cell {
  width: 52px;
  height: 52px;
}

/* After (responsive, handled automatically) */
.cell {
  width: var(--cell-size);
  height: var(--cell-size);
}
```

The responsive.css file already applies these to common classes.

### In TypeScript Components

#### Option 1: Pure CSS (Recommended)
Simply rely on CSS variables - no TypeScript changes needed!

#### Option 2: Programmatic Control (Advanced)
Use the `ResponsiveService` for conditional logic:

```typescript
import { ResponsiveService } from '../shared/responsive.service';

export class MyComponent {
  constructor(private responsive: ResponsiveService) {
    // Subscribe to changes
    this.responsive.isMobile$.subscribe(isMobile => {
      console.log('Mobile mode:', isMobile);
    });
    
    // Synchronous checks
    if (this.responsive.isMobile()) {
      // Mobile-specific logic
    }
    
    // Get optimal board size for screen
    const optimalSize = this.responsive.getOptimalBoardSize();
  }
}
```

### In Templates

#### Option 1: CSS Classes (Best)
Use existing classes - they're already responsive!

```html
<div class="game-content">
  <div class="left-panel">...</div>
  <div class="board-container">...</div>
</div>
```

#### Option 2: Conditional Rendering (If needed)
```html
<div *ngIf="responsive.isMobile$ | async">
  Mobile-only content
</div>
```

## Key Features

### 1. **Auto-Scaling Board**
- Chess cells resize from 40px (mobile) to 56px (desktop)
- Maintains aspect ratio and proportions
- No horizontal overflow on any device

### 2. **Flexible Layout**
- Stacks vertically on mobile (< 768px)
- Side-by-side on tablets/desktop (≥ 768px)
- Panel width adjusts automatically

### 3. **Optimized Controls**
- Piece buttons: 65px (mobile) to 85px (desktop)
- 2-column grid on small phones, 3-column on larger screens
- Touch-friendly sizing (minimum 44x44px targets)

### 4. **Typography Scaling**
- H1: 1.75rem → 2.5rem
- Body: 0.875rem → 1rem
- Coordinates: 0.75rem → 0.9375rem

### 5. **Landscape Mode**
- Reduces vertical spacing when height < 600px
- Optimizes for landscape phone orientation

### 6. **Accessibility**
- Respects `prefers-reduced-motion`
- Maintains minimum touch target sizes (44x44px)
- High DPI display optimizations

## Testing Responsive Design

### In Browser DevTools:
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Test different device presets:
   - iPhone SE (375px) - Small phone
   - iPhone 12 Pro (390px) - Standard phone
   - iPad (768px) - Tablet
   - iPad Pro (1024px) - Large tablet
   - Desktop (1280px+) - Desktop

### Keyboard Shortcuts:
- `Ctrl+Shift+M` - Toggle device mode
- `Ctrl+Shift+R` - Rotate device

## Customization

### Adjusting Breakpoints
Edit `src/styles/responsive.css`:

```css
@media (min-width: 768px) {
  :root {
    --cell-size: 50px; /* Change from 48px */
  }
}
```

### Adding New Responsive Variables
```css
:root {
  --my-custom-size: 20px; /* Mobile */
}

@media (min-width: 1024px) {
  :root {
    --my-custom-size: 30px; /* Desktop */
  }
}
```

Then use in your CSS:
```css
.my-element {
  width: var(--my-custom-size);
}
```

## Benefits

✅ **Clean Code**: No cluttered inline styles or NgClass conditions
✅ **Maintainable**: Change one variable, update everywhere
✅ **Performance**: CSS-only, no JavaScript overhead
✅ **Future-Proof**: Easy to add new breakpoints or adjust existing ones
✅ **Consistent**: All components share the same responsive behavior
✅ **Accessible**: Built-in support for reduced motion, high DPI, etc.

## File Structure

```
src/
├── styles/
│   ├── responsive.css      # 📱 Main responsive system
│   └── ui.css              # Base UI styles
├── app/
│   └── shared/
│       └── responsive.service.ts  # 🔧 Optional TypeScript utilities
└── styles.css              # Imports responsive + ui
```

## Migration Checklist

Your existing code works without changes! But for best results:

- [x] Import responsive.css in styles.css
- [ ] Review component CSS for hardcoded sizes
- [ ] Test on multiple screen sizes
- [ ] Consider using ResponsiveService for complex logic
- [ ] Update new components to use CSS variables

## Common Patterns

### Pattern 1: Responsive Component
```typescript
// No changes needed - CSS handles it!
@Component({
  styleUrls: ['./my-component.css']
})
export class MyComponent {}
```

### Pattern 2: Mobile-Specific Feature
```typescript
export class MyComponent {
  constructor(private responsive: ResponsiveService) {}
  
  ngOnInit() {
    this.responsive.isMobile$.subscribe(isMobile => {
      this.showCompactView = isMobile;
    });
  }
}
```

### Pattern 3: Optimal Board Size
```typescript
export class BoardComponent {
  constructor(private responsive: ResponsiveService) {
    // Suggest appropriate size on load
    this.size = this.responsive.getOptimalBoardSize();
  }
}
```

## Browser Support

- ✅ Chrome 49+ (CSS Variables)
- ✅ Firefox 31+
- ✅ Safari 9.1+
- ✅ Edge 15+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Notes

- CSS variables are faster than JavaScript calculations
- Media queries are hardware-accelerated
- Debounced resize listener (150ms) prevents lag
- No layout thrashing or forced reflows

## Further Reading

- [MDN: CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [MDN: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev: Responsive Web Design Basics](https://web.dev/responsive-web-design-basics/)
