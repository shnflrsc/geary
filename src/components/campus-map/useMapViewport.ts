import { useCallback, useEffect, useRef, useState } from 'react';
import {
  computePanViewBox,
  computePinchViewBox,
  computeZoomViewBox,
  DEFAULT_MAP_VIEWBOX,
  focusBuildingViewBox,
  type ViewBoxRect,
} from '../../lib/map-search';
import type { CampusBuilding } from '../../data/campus-map';

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
  fallbackViewBox: ViewBoxRect
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

export function useMapViewport() {
  const [viewBox, setViewBox] = useState<ViewBoxRect>(DEFAULT_MAP_VIEWBOX);
  const [isDragging, setIsDragging] = useState(false);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const viewBoxRef = useRef<ViewBoxRect>(DEFAULT_MAP_VIEWBOX);
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const gestureRef = useRef<GestureState | null>(null);
  const didGestureMoveRef = useRef(false);

  const updateViewBox = useCallback(
    (updater: ViewBoxRect | ((prev: ViewBoxRect) => ViewBoxRect)) => {
      setViewBox((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        viewBoxRef.current = next;
        return next;
      });
    },
    []
  );

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      if (!svg) return;

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
  }, [updateViewBox]);

  const handlePointerDown = useCallback((event: React.PointerEvent<SVGSVGElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const pointers = activePointersRef.current;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 1) {
      didGestureMoveRef.current = false;
      gestureRef.current = {
        mode: 'pan',
        pointerId: event.pointerId,
        moved: false,
        startX: event.clientX,
        startY: event.clientY,
        startViewBox: viewBoxRef.current,
      };
      return;
    }

    if (pointers.size === 2) {
      const [first, second] = Array.from(pointers.entries());
      if (first && second) {
        didGestureMoveRef.current = true;
        setIsDragging(true);
        gestureRef.current = {
          mode: 'pinch',
          id1: first[0],
          id2: second[0],
          startP1: { ...first[1] },
          startP2: { ...second[1] },
          startViewBox: viewBoxRef.current,
        };
      }
    }
  }, []);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      const pointers = activePointersRef.current;
      if (!svg || !pointers.has(event.pointerId)) return;

      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      const gesture = gestureRef.current;
      if (!gesture) return;

      const rect = svg.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      if (gesture.mode === 'pinch') {
        const cur1 = pointers.get(gesture.id1);
        const cur2 = pointers.get(gesture.id2);
        if (!cur1 || !cur2) return;

        updateViewBox(
          computePinchViewBox(
            gesture.startViewBox,
            rect,
            gesture.startP1,
            gesture.startP2,
            cur1,
            cur2
          )
        );
        return;
      }

      if (gesture.pointerId !== event.pointerId) return;

      const dxPx = event.clientX - gesture.startX;
      const dyPx = event.clientY - gesture.startY;
      if (!gesture.moved) {
        if (Math.hypot(dxPx, dyPx) < 4) return;
        gesture.moved = true;
        didGestureMoveRef.current = true;
        setIsDragging(true);
        try {
          svg.setPointerCapture(event.pointerId);
        } catch {
          // Ignore if capture is unsupported on a synthetic test event
        }
      }

      updateViewBox(computePanViewBox(gesture.startViewBox, dxPx, dyPx, rect));
    },
    [updateViewBox]
  );

  const handlePointerEnd = useCallback((event: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    const pointers = activePointersRef.current;
    pointers.delete(event.pointerId);

    if (svg) {
      try {
        if (svg.hasPointerCapture(event.pointerId)) {
          svg.releasePointerCapture(event.pointerId);
        }
      } catch {
        // Ignore if release fails
      }
    }

    const entries = Array.from(pointers.entries());
    if (entries.length >= 2) {
      const gesture = gestureRef.current;
      if (
        !gesture ||
        gesture.mode !== 'pinch' ||
        !pointers.has(gesture.id1) ||
        !pointers.has(gesture.id2)
      ) {
        const [first, second] = entries;
        if (first && second) {
          gestureRef.current = {
            mode: 'pinch',
            id1: first[0],
            id2: second[0],
            startP1: { ...first[1] },
            startP2: { ...second[1] },
            startViewBox: viewBoxRef.current,
          };
        }
      }
      return;
    }

    if (entries.length === 1) {
      const [remaining] = entries;
      if (remaining) {
        gestureRef.current = {
          mode: 'pan',
          pointerId: remaining[0],
          moved: true,
          startX: remaining[1].x,
          startY: remaining[1].y,
          startViewBox: viewBoxRef.current,
        };
      }
      return;
    }

    gestureRef.current = null;
    setIsDragging(false);
    // Reset after any synchronous click dispatch so keyboard activation isn't swallowed.
    queueMicrotask(() => {
      didGestureMoveRef.current = false;
    });
  }, []);

  const handlePointerLeave = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (
        !gestureRef.current ||
        (gestureRef.current.mode === 'pan' && !gestureRef.current.moved)
      ) {
        handlePointerEnd(event);
      }
    },
    [handlePointerEnd]
  );

  const consumeDragClick = useCallback(() => {
    if (!didGestureMoveRef.current) return false;
    didGestureMoveRef.current = false;
    return true;
  }, []);

  const zoomIn = useCallback(() => {
    updateViewBox((prev) => computeZoomViewBox(prev, 1.35));
  }, [updateViewBox]);

  const zoomOut = useCallback(() => {
    updateViewBox((prev) => computeZoomViewBox(prev, 1 / 1.35));
  }, [updateViewBox]);

  const resetView = useCallback(() => {
    updateViewBox(DEFAULT_MAP_VIEWBOX);
  }, [updateViewBox]);

  const focusBuilding = useCallback(
    (building: Pick<CampusBuilding, 'center'>) => {
      const isDesktop =
        typeof window !== 'undefined' && window.innerWidth >= 1024;
      const offset = isDesktop
        ? { offsetXRatio: 0.14, offsetYRatio: 0 }
        : { offsetXRatio: 0, offsetYRatio: -0.16 };
      updateViewBox(focusBuildingViewBox(building, 480, offset));
    },
    [updateViewBox]
  );

  const isZoomed = viewBox.width < DEFAULT_MAP_VIEWBOX.width - 1;

  return {
    svgRef,
    viewBox,
    isDragging,
    isZoomed,
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
