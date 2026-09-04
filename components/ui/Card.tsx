import type {HTMLAttributes} from 'react';

export type CardProps = HTMLAttributes<HTMLDivElement> & {as?: 'article' | 'div'};

/** Нейтральный контейнер карточки; визуальное оформление задаёт потребитель через className. */
export function Card({as: Component = 'div', children, ...props}: CardProps) { return <Component {...props}>{children}</Component>; }
