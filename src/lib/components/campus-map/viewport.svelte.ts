import {
  computePanViewBox,
  computePinchViewBox,
  computeZoomViewBox,
  DEFAULT_MAP_VIEWBOX,
  focusBuildingViewBox,
  type ViewBoxRect,
} from '#lib/map-search';
import type { CampusBuilding } from '../../../data/campus-map';

type GestureState =
  | {
      mode: 'pan';
      pointerId: number;
      moved: boolean;
      startX: number;
      startY: number;
      startViewBox: ViewBoxRect;
    }
  | {
      mode: 'pinch';
      id1: number;
      id2: number;
      startP1: { x: number; y: number };
      startP2: { x: number; y: number };
      startViewBox: ViewBoxRect;
    };

function clientToSvgPoint(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
  fallbackViewBox: ViewBoxRect,
): { x: number; y: number } | null {
  const ctm = typeof svg.getScreenCTM === 'function' ? svg.getScreenCTM() : null;
  if (ctm && ctm.a !== 0 && ctm.d !== 0) {
    try {
      const inv = ctm.inverse();
      return {
        x: clientX * inv.a + clientY * inv.c + inv.e,
        y: clientX * inv.b + clientY * inv.d + inv.f,
      };
    } catch {
      // Fall through to bounding rect calculation
    }
  }

  const rect = svg.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  return {
    x: fallbackViewBox.x + ((clientX - rect.left) / rect.width) * fallbackViewBox.width,
    y: fallbackViewBox.y + ((clientY - rect.top) / rect.height) * fallbackViewBox.height,
  };
}

export function createMapViewport() {
  let viewBox = $state<ViewBoxRect>(DEFAULT_MAP_VIEWBOX);
  let isDragging = $state(false);
  let svgEl: SVGSVGElement | undefined = $state();

  const activePointers = new Map<number, { x: number; y: number }>();
  let gesture: GestureState | null = null;
  let didGestureMove = false;

  const isZoomed = $derived(viewBox.width < DEFAULT_MAP_VIEWBOX.width - 1);

  function updateViewBox(updater: ViewBoxRect | ((prev: ViewBoxRect) => ViewBoxRect)) {
    viewBox = typeof updater === 'function' ? updater(viewBox) : updater;
  }

  function attachWheelAndTouch(svg: SVGSVGElement): () => void {
    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      const factor = event.deltaY < 0 ? 1.2 : 1 / 1.2;
      updateViewBox((prev) => {
        const focal = clientToSvgPoint(svg, event.clientX, event.clientY, prev);
        return focal ? computeZoomViewBox(prev, factor, focal) : prev;
      });
    }

    function preventTouchScroll(event: TouchEvent) {
      event.preventDefault();
    }

    svg.addEventListener('wheel', handleWheel, { passive: false });
    svg.addEventListener('touchmove', preventTouchScroll, { passive: false });

    return () => {
      svg.removeEventListener('wheel', handleWheel);
      svg.removeEventListener('touchmove', preventTouchScroll);
    };
  }

  function handlePointerDown(event: PointerEvent) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (activePointers.size === 1) {
      didGestureMove = false;
      gesture = {
        mode: 'pan',
        pointerId: event.pointerId,
        moved: false,
        startX: event.clientX,
        startY: event.clientY,
        startViewBox: viewBox,
      };
      return;
    }

    if (activePointers.size === 2) {
      const [first, second] = Array.from(activePointers.entries());
      if (first && second) {
        didGestureMove = true;
        isDragging = true;
        gesture = {
          mode: 'pinch',
          id1: first[0],
          id2: second[0],
          startP1: { ...first[1] },
          startP2: { ...second[1] },
          startViewBox: viewBox,
        };
      }
    }
  }

  function handlePointerMove(event: PointerEvent) {
    const svg = svgEl;
    if (!svg || !activePointers.has(event.pointerId)) return;

    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (!gesture) return;

    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    if (gesture.mode === 'pinch') {
      const cur1 = activePointers.get(gesture.id1);
      const cur2 = activePointers.get(gesture.id2);
      if (!cur1 || !cur2) return;

      updateViewBox(
        computePinchViewBox(
          gesture.startViewBox,
          rect,
          gesture.startP1,
          gesture.startP2,
          cur1,
          cur2,
        ),
      );
      return;
    }

    if (gesture.pointerId !== event.pointerId) return;

    const dxPx = event.clientX - gesture.startX;
    const dyPx = event.clientY - gesture.startY;
    if (!gesture.moved) {
      if (Math.hypot(dxPx, dyPx) < 4) return;
      gesture.moved = true;
      didGestureMove = true;
      isDragging = true;
      try {
        svg.setPointerCapture(event.pointerId);
      } catch {
        // Ignore if capture is unsupported on synthetic test event
      }
    }

    updateViewBox(computePanViewBox(gesture.startViewBox, dxPx, dyPx, rect));
  }

  function handlePointerEnd(event: PointerEvent) {
    const svg = svgEl;
    activePointers.delete(event.pointerId);

    if (svg) {
      try {
        if (svg.hasPointerCapture(event.pointerId)) {
          svg.releasePointerCapture(event.pointerId);
        }
      } catch {
        // Ignore if release fails
      }
    }

    const entries = Array.from(activePointers.entries());
    if (entries.length >= 2) {
      if (
        !gesture ||
        gesture.mode !== 'pinch' ||
        !activePointers.has(gesture.id1) ||
        !activePointers.has(gesture.id2)
      ) {
        const [first, second] = entries;
        if (first && second) {
          gesture = {
            mode: 'pinch',
            id1: first[0],
            id2: second[0],
            startP1: { ...first[1] },
            startP2: { ...second[1] },
            startViewBox: viewBox,
          };
        }
      }
      return;
    }

    if (entries.length === 1) {
      const [remaining] = entries;
      if (remaining) {
        gesture = {
          mode: 'pan',
          pointerId: remaining[0],
          moved: true,
          startX: remaining[1].x,
          startY: remaining[1].y,
          startViewBox: viewBox,
        };
      }
      return;
    }

    gesture = null;
    isDragging = false;
    queueMicrotask(() => {
      didGestureMove = false;
    });
  }

  function handlePointerLeave(event: PointerEvent) {
    if (!gesture || (gesture.mode === 'pan' && !gesture.moved)) {
      handlePointerEnd(event);
    }
  }

  function consumeDragClick(): boolean {
    if (!didGestureMove) return false;
    didGestureMove = false;
    return true;
  }

  function zoomIn() {
    updateViewBox((prev) => computeZoomViewBox(prev, 1.35));
  }

  function zoomOut() {
    updateViewBox((prev) => computeZoomViewBox(prev, 1 / 1.35));
  }

  function resetView() {
    updateViewBox(DEFAULT_MAP_VIEWBOX);
  }

  function focusBuilding(building: Pick<CampusBuilding, 'center'>) {
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    const offset = isDesktop
      ? { offsetXRatio: 0.14, offsetYRatio: 0 }
      : { offsetXRatio: 0, offsetYRatio: -0.16 };
    updateViewBox(focusBuildingViewBox(building, 480, offset));
  }

  return {
    get viewBox() {
      return viewBox;
    },
    get isDragging() {
      return isDragging;
    },
    get isZoomed() {
      return isZoomed;
    },
    get svgEl() {
      return svgEl;
    },
    set svgEl(el: SVGSVGElement | undefined) {
      svgEl = el;
    },
    attachWheelAndTouch,
    zoomIn,
    zoomOut,
    resetView,
    focusBuilding,
    consumeDragClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
    handlePointerLeave,
  };
}
