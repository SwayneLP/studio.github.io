// My Projects: custom wheel-driven scroll-snap.
// Native CSS scroll-snap doesn't expose any way to control how long the
// snap animation takes, so mouse-wheel scrolling is intercepted here and
// animated by hand - this lets us make the transition twice as slow as
// a typical native snap while still moving exactly one project per
// scroll gesture. Touch/trackpad swipes on mobile still fall back to
// the native CSS scroll-snap-type behaviour untouched.
(function () {
  const container = document.querySelector('.projects-scroll');
  if (!container) return;

  const snapTargets = Array.from(container.querySelectorAll('.work-wrapper, .section-footer'));
  if (!snapTargets.length) return;

  // Native mandatory snap usually settles in ~700-800ms; doubling that.
  const DURATION = 1600;

  let isAnimating = false;

  function targetScrollTop(el) {
    return container.scrollTop + (el.getBoundingClientRect().top - container.getBoundingClientRect().top);
  }

  function currentIndex() {
    const scrollTop = container.scrollTop;
    let closest = 0;
    let closestDistance = Infinity;
    snapTargets.forEach((el, index) => {
      const distance = Math.abs(targetScrollTop(el) - scrollTop);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = index;
      }
    });
    return closest;
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function animateScrollTo(destination) {
    isAnimating = true;
    // The CSS scroll-snap-type on this container fights a manual scrollTop
    // animation - the browser keeps forcing the position back onto the
    // nearest snap point on every intermediate frame, which makes the
    // animation look like an instant jump instead of a slow scroll. Turn
    // snapping off for the duration of the animation and restore it once
    // we've landed exactly on the target snap point.
    container.style.scrollSnapType = 'none';
    const startTop = container.scrollTop;
    const change = destination - startTop;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      container.scrollTop = startTop + change * easeInOutQuad(progress);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        container.style.scrollSnapType = '';
        isAnimating = false;
      }
    }

    requestAnimationFrame(step);
  }

  container.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      if (isAnimating) return;

      const index = currentIndex();
      const direction = event.deltaY > 0 ? 1 : -1;
      const nextIndex = Math.min(Math.max(index + direction, 0), snapTargets.length - 1);
      if (nextIndex === index) return;

      animateScrollTo(targetScrollTop(snapTargets[nextIndex]));
    },
    { passive: false }
  );
})();
