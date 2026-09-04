'use client';

import {type ReactNode, useState} from 'react';
import dynamic from 'next/dynamic';
import styles from './fluid.module.css';

const FluidBackdrop = dynamic(() => import('./fluid/FluidBackdrop'), {ssr: false});

/** Layout adapter for the unmodified vgpu interactive-fluid example. */
export function FluidHero({children}: {children: ReactNode}) {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);

  return <div ref={setRoot} className={styles.fluidRoot}>
    <div className={styles.fluidHero} aria-hidden="true">{root && <FluidBackdrop inputTarget={root} />}</div>
    {children}
  </div>;
}
