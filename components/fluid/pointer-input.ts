export interface StirInput {
  active: boolean;
  from: [number, number];
  to: [number, number];
  velocity: [number, number];
  consumeStep(): void;
  dispose(): void;
}

export function installStirInput(
  canvas: HTMLCanvasElement,
  eventTarget: HTMLElement = canvas
): StirInput {
  let activePointer: number | undefined;
  let activeTouch: number | undefined;
  let from: [number, number] = [0.5, 0.5];
  let to: [number, number] = [0.5, 0.5];
  let velocity: [number, number] = [0, 0];
  let lastTime = 0;
  let decay = 0;

  const isInteractiveTarget = (target: EventTarget | null) =>
    target instanceof Element &&
    target.closest('a, button, input, select, textarea, summary, [role="button"], [contenteditable="true"]');

  const point = (clientX: number, clientY: number): [number, number] => {
    const r = canvas.getBoundingClientRect();
    return [
      Math.max(0, Math.min(1, (clientX - r.left) / Math.max(1, r.width))),
      Math.max(
        0,
        Math.min(1, 1 - (clientY - r.top) / Math.max(1, r.height))
      ),
    ];
  };

  const moveTo = (next: [number, number], timeStamp: number) => {
    if (lastTime === 0) {
      from = to = next;
      lastTime = timeStamp;
      return;
    }
    const dt = Math.max(0.004, Math.min(0.05, (timeStamp - lastTime) / 1000));
    from = to;
    to = next;
    velocity = [
      Math.max(-2.5, Math.min(2.5, (to[0] - from[0]) / dt)),
      Math.max(-2.5, Math.min(2.5, (to[1] - from[1]) / dt)),
    ];
    lastTime = timeStamp;
    decay = 2;
  };

  const down = (event: PointerEvent) => {
    if (!event.isPrimary || activePointer !== undefined || isInteractiveTarget(event.target)) return;
    eventTarget.setPointerCapture(event.pointerId);
    activePointer = event.pointerId;
    from = to = point(event.clientX, event.clientY);
    lastTime = event.timeStamp;
    velocity = [0, 0];
    decay = 2;
  };

  const move = (event: PointerEvent) => {
    if (!event.isPrimary) return;
    moveTo(point(event.clientX, event.clientY), event.timeStamp);
  };

  const up = (event: PointerEvent) => {
    if (!event.isPrimary || event.pointerId !== activePointer) return;
    if (eventTarget.hasPointerCapture?.(event.pointerId)) {
      eventTarget.releasePointerCapture(event.pointerId);
    }
    activePointer = undefined;
    decay = 2;
  };

  const leave = () => {
    if (activePointer === undefined && activeTouch === undefined) {
      lastTime = 0;
      decay = 0;
    }
  };

  // Pointer events are cancelled by the browser once a vertical pan becomes a
  // scroll. Passive touch events keep the fluid input alive without blocking it.
  const touchStart = (event: TouchEvent) => {
    if (isInteractiveTarget(event.target)) return;
    const touch = event.changedTouches[0];
    if (!touch || activeTouch !== undefined) return;
    activeTouch = touch.identifier;
    from = to = point(touch.clientX, touch.clientY);
    lastTime = event.timeStamp;
    velocity = [0, 0];
    decay = 2;
  };

  const touchMove = (event: TouchEvent) => {
    if (activePointer !== undefined || activeTouch === undefined) return;
    const touch = Array.from(event.touches).find(({identifier}) => identifier === activeTouch);
    if (touch) moveTo(point(touch.clientX, touch.clientY), event.timeStamp);
  };

  const touchEnd = (event: TouchEvent) => {
    if (!Array.from(event.changedTouches).some(({identifier}) => identifier === activeTouch)) return;
    activeTouch = undefined;
    decay = 2;
  };

  eventTarget.addEventListener("pointerdown", down);
  eventTarget.addEventListener("pointermove", move);
  eventTarget.addEventListener("pointerup", up);
  eventTarget.addEventListener("pointercancel", up);
  eventTarget.addEventListener("pointerleave", leave);
  eventTarget.addEventListener("touchstart", touchStart, {passive: true});
  eventTarget.addEventListener("touchmove", touchMove, {passive: true});
  eventTarget.addEventListener("touchend", touchEnd, {passive: true});
  eventTarget.addEventListener("touchcancel", touchEnd, {passive: true});

  return {
    get active() {
      return activePointer !== undefined || activeTouch !== undefined || decay > 0;
    },
    get from() {
      return from;
    },
    get to() {
      return to;
    },
    get velocity() {
      return velocity;
    },
    consumeStep() {
      from = to;
      if (activePointer === undefined && activeTouch === undefined && decay > 0) {
        velocity = [velocity[0] * 0.45, velocity[1] * 0.45];
        decay--;
      }
    },
    dispose() {
      eventTarget.removeEventListener("pointerdown", down);
      eventTarget.removeEventListener("pointermove", move);
      eventTarget.removeEventListener("pointerup", up);
      eventTarget.removeEventListener("pointercancel", up);
      eventTarget.removeEventListener("pointerleave", leave);
      eventTarget.removeEventListener("touchstart", touchStart);
      eventTarget.removeEventListener("touchmove", touchMove);
      eventTarget.removeEventListener("touchend", touchEnd);
      eventTarget.removeEventListener("touchcancel", touchEnd);
      if (
        activePointer !== undefined &&
        eventTarget.hasPointerCapture?.(activePointer)
      ) {
        eventTarget.releasePointerCapture(activePointer);
      }
      activePointer = undefined;
      activeTouch = undefined;
    },
  };
}
