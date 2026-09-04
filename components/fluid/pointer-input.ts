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
  let from: [number, number] = [0.5, 0.5];
  let to: [number, number] = [0.5, 0.5];
  let velocity: [number, number] = [0, 0];
  let lastTime = 0;
  let decay = 0;

  const point = (event: PointerEvent): [number, number] => {
    const r = canvas.getBoundingClientRect();
    return [
      Math.max(0, Math.min(1, (event.clientX - r.left) / Math.max(1, r.width))),
      Math.max(
        0,
        Math.min(1, 1 - (event.clientY - r.top) / Math.max(1, r.height))
      ),
    ];
  };

  const down = (event: PointerEvent) => {
    if (!event.isPrimary || activePointer !== undefined) return;
    eventTarget.setPointerCapture(event.pointerId);
    activePointer = event.pointerId;
    from = to = point(event);
    lastTime = event.timeStamp;
    velocity = [0, 0];
    decay = 2;
  };

  const move = (event: PointerEvent) => {
    if (!event.isPrimary) return;
    const next = point(event);
    if (lastTime === 0) {
      from = to = next;
      lastTime = event.timeStamp;
      return;
    }
    const dt = Math.max(
      0.004,
      Math.min(0.05, (event.timeStamp - lastTime) / 1000)
    );
    from = to;
    to = next;
    velocity = [
      Math.max(-2.5, Math.min(2.5, (to[0] - from[0]) / dt)),
      Math.max(-2.5, Math.min(2.5, (to[1] - from[1]) / dt)),
    ];
    lastTime = event.timeStamp;
    decay = 2;
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
    if (activePointer === undefined) {
      lastTime = 0;
      decay = 0;
    }
  };

  eventTarget.addEventListener("pointerdown", down);
  eventTarget.addEventListener("pointermove", move);
  eventTarget.addEventListener("pointerup", up);
  eventTarget.addEventListener("pointercancel", up);
  eventTarget.addEventListener("pointerleave", leave);

  return {
    get active() {
      return activePointer !== undefined || decay > 0;
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
      if (activePointer === undefined && decay > 0) {
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
      if (
        activePointer !== undefined &&
        eventTarget.hasPointerCapture?.(activePointer)
      ) {
        eventTarget.releasePointerCapture(activePointer);
      }
      activePointer = undefined;
    },
  };
}
