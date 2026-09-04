'use client';
import {useEffect, useRef, useState} from 'react';
import styles from './ui.module.css';
export type RevealProps = {children: React.ReactNode; delay?: number; className?: string};

/** Анимирует появление контента в области просмотра с учётом reduced motion. */
export function Reveal({children, delay = 0, className = ''}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null); const [visible, setVisible] = useState(false);
  useEffect(() => { const el = ref.current; if (!el) return; const observer = new IntersectionObserver(([entry]) => {if (entry.isIntersecting) {setVisible(true); observer.disconnect();}}, {threshold: .15}); observer.observe(el); return () => observer.disconnect(); }, []);
  return <div ref={ref} className={`${styles.reveal} ${visible ? styles.visible : ''} ${className}`} style={{transitionDelay: `${delay}ms`}}>{children}</div>;
}
