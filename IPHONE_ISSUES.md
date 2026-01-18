# iPhone/iOS Safari Issues - Elements That Can Cause Problems

This document identifies elements in the site that could cause issues on iPhones and iOS Safari.

## 🔴 Critical Issues

### 1. **Conflicting CSS Property: `-webkit-text-size-adjust`**
**Location:** `src/app/globals.css` (lines 127, 130)

```css
-webkit-text-size-adjust: 100%;
/* ... */
-webkit-text-size-adjust: none;  /* ⚠️ Conflicts with above */
```

**Issue:** The property is set twice with different values. Using `none` disables accessibility features and can cause text rendering issues.

**Impact:** Users with accessibility settings (larger text) may see improperly sized text.

**Fix:** Remove the `none` value, keep only `100%`.

---

### 2. **Fixed Position Navigation with iOS Safari Address Bar**
**Location:** `src/components/Navigation.tsx` (line 61)

```tsx
className={`fixed top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-50 ...`}
```

**Issue:** iOS Safari's dynamic address bar (shows/hides on scroll) can cause fixed elements to jump or overlap incorrectly.

**Impact:** Navigation may shift unexpectedly when scrolling on iPhone.

**Mitigation:** Already using `safe-area-inset` classes, but may need additional padding-top adjustments for iOS.

---

### 3. **ScrollIntoView with Smooth Behavior on iOS**
**Location:** `src/app/page.tsx` (line 374)

```tsx
scrollToSection = useCallback((index: number) => {
  sectionsRef.current[index]?.scrollIntoView({ behavior: "smooth" })
}, [])
```

**Issue:** `scrollIntoView` with `behavior: "smooth"` can be janky or not work properly on iOS Safari, especially on older devices.

**Impact:** Smooth scrolling may fail or appear stuttery.

**Fix:** Consider using polyfill or manual scroll animation for iOS.

---

## 🟡 Performance Issues

### 4. **Heavy Canvas Animations**
**Locations:** 
- `src/components/DynamicBackground.tsx`
- `src/components/ParticleBackground.tsx`

**Issue:** Continuous canvas animations with `requestAnimationFrame` can drain battery and cause performance issues on older iPhones (iPhone X, iPhone 11, etc.).

**Impact:** 
- Reduced battery life
- Janky animations
- Device heating up

**Current Mitigation:** Code already has iOS optimizations (reduced particle count, lower animation speed), but could be more aggressive.

**Recommendation:** Consider disabling canvas animations on low-end devices or adding a toggle.

---

### 5. **Backdrop Blur Performance**
**Location:** Multiple components using `backdrop-blur-xl`

**Issue:** CSS `backdrop-filter` can be expensive on iOS, especially with multiple blurred elements.

**Impact:** Scrolling performance degradation on older iPhones.

**Current Mitigation:** Fallback background color is provided, but blur is still applied when supported.

---

### 6. **Multiple Fixed Position Elements**
**Locations:**
- Navigation: `fixed top-2`
- ScrollProgress: `fixed right-8`
- MagneticCursor: `fixed top-0`
- RegistrationPopup (mobile): `fixed bottom-0`

**Issue:** Multiple fixed position elements can cause layout thrashing and performance issues on iOS.

**Impact:** Slower scrolling, battery drain.

---

## 🟢 Minor Issues (Already Mitigated)

### 7. **Input Field Zoom**
**Location:** `src/app/globals.css` (lines 253-255)

```css
input, textarea, select {
  font-size: 16px;
}
```

**Status:** ✅ **FIXED** - All inputs are set to 16px minimum, preventing iOS Safari zoom on focus.

---

### 8. **Viewport Height (100vh)**
**Locations:**
- `src/app/layout.tsx` (line 106): `min-h-[100dvh]`
- `src/app/globals.css` (lines 144-145): `min-height: -webkit-fill-available`

**Status:** ✅ **MITIGATED** - Using both `100dvh` (modern) and `-webkit-fill-available` (iOS fallback).

---

### 9. **Touch Events**
**Status:** ✅ **HANDLED** - Touch events use `{ passive: true }` for better performance.

**Locations:**
- `src/components/EnhancedCountdown.tsx` (lines 137-144)
- Scroll listeners use passive flag

---

## 📱 Specific iPhone Issues

### 10. **Safe Area Insets (Notches)**
**Location:** `src/app/layout.tsx` (line 105): `safe-area-inset` class

**Status:** ✅ **HANDLED** - Using `env(safe-area-inset-*)` in CSS.

---

### 11. **iOS Text Rendering**
**Location:** `src/app/globals.css` (lines 139, 283-284)

**Status:** ✅ **HANDLED** - Using `-webkit-font-smoothing: antialiased`.

---

### 12. **Bounce Scrolling**
**Location:** `src/app/globals.css` (lines 132, 142)

**Status:** ✅ **HANDLED** - Using `overscroll-behavior: none`.

---

## 🔧 Recommended Fixes

### Priority 1: Fix CSS Conflict
Remove the conflicting `-webkit-text-size-adjust: none;` property.

### Priority 2: Improve iOS Scroll Behavior
Replace `scrollIntoView({ behavior: "smooth" })` with iOS-compatible smooth scrolling.

### Priority 3: Performance Optimization
- Add option to disable canvas animations on low-end devices
- Consider reducing backdrop blur usage on mobile
- Optimize fixed position elements

### Priority 4: Testing
Test on actual iPhone devices:
- iPhone SE (2nd gen) - older hardware
- iPhone 12/13 - mid-range
- iPhone 15 Pro - latest hardware

---

## 📝 Notes

Most iOS-specific issues have been considered and many fixes are already in place. The main concerns are:

1. **CSS property conflict** (easy fix)
2. **Performance on older devices** (canvas animations)
3. **Smooth scrolling compatibility** (may need polyfill)

The site should work well on modern iPhones, but may have performance issues on devices older than iPhone 12.

