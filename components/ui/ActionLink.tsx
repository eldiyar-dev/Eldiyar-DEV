import type {ComponentPropsWithoutRef} from 'react';

export type ActionLinkProps = ComponentPropsWithoutRef<'a'>;

/** Семантическая ссылка-действие для переходов к разделам и публичным контактам. */
export function ActionLink({children, ...props}: ActionLinkProps) { return <a {...props}>{children}</a>; }
