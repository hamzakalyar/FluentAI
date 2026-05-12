import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center text-sm text-slate-500 mb-6">
      <Link to="/dashboard" className="hover:text-primary transition-colors">
        Home
      </Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return (
          <React.Fragment key={to}>
            <ChevronRight size={14} className="mx-2 shrink-0" />
            {last ? (
              <span className="font-semibold text-navy capitalize">
                {value.replace('-', ' ')}
              </span>
            ) : (
              <Link to={to} className="hover:text-primary transition-colors capitalize">
                {value.replace('-', ' ')}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
