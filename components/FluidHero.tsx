'use client';

import {type PointerEvent, type ReactNode, useRef} from 'react';
import dynamic from 'next/dynamic';
import styles from './fluid.module.css';

const FluidBackdrop = dynamic(() => import('./fluid/FluidBackdrop'), {ssr: false});

/** Layout adapter for the unmodified vgpu interactive-fluid example. */
export function FluidHero({children}: {children: ReactNode}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const relayPointer = (event: PointerEvent<HTMLDivElement>) => {
    const canvas = rootRef.current?.querySelector('canvas');
    if (!canvas || event.target === canvas) return;
    canvas.dispatchEvent(new PointerEvent(event.type, {
      bubbles: true,
      buttons: event.buttons,
      clientX: event.clientX,
      clientY: event.clientY,
      isPrimary: event.isPrimary,
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      pressure: event.pressure,
    }));
  };

  return <div ref={rootRef} className={styles.fluidRoot} onPointerMoveCapture={relayPointer} onPointerLeave={relayPointer}>
    <div className={styles.fluidHero} aria-hidden="true"><FluidBackdrop /></div>
    {children}
  </div>;
}
