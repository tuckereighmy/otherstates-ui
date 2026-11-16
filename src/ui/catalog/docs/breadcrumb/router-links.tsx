'use client';

import * as stylex from '@stylexjs/stylex';
import { createContext, useContext, useState } from 'react';
import { Breadcrumb, type BreadcrumbLinkProps } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const Navigate = createContext<(href: string) => void>(() => {});

function RouterLink({ href, onClick, ...props }: BreadcrumbLinkProps) {
  const navigate = useContext(Navigate);
  return (
    <a
      {...props}
      href={href}
      onClick={event => {
        onClick?.(event);
        event.preventDefault();
        navigate(href);
      }}
    />
  );
}

const s = stylex.create({
  root: { display: 'grid', gap: tokens['--os-space-3'], justifyItems: 'center' },
  route: { margin: 0, fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-md'], color: tokens['--os-color-fg-muted'] },
});

export default function BreadcrumbRouterLinks() {
  const [route, setRoute] = useState('/teams/design/members');

  return (
    <Navigate.Provider value={setRoute}>
      <div {...stylex.props(s.root)}>
        <Breadcrumb
          linkAs={RouterLink}
          items={[
            { label: 'Teams', href: '/teams' },
            { label: 'Design', href: '/teams/design' },
            { label: 'Members' },
          ]}
        />
        <p role="status" {...stylex.props(s.route)}>Route: {route}</p>
      </div>
    </Navigate.Provider>
  );
}
