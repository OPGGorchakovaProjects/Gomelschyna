import React from 'react';
import { Link } from 'react-router-dom';
import styles from './style.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  className = '',
}) => {
  const btnClass = `${styles.button} ${styles[variant]} ${className}`;

  if (to) {
    return (
      <Link
        to={to}
        className={btnClass}
        style={{ color: 'white', textDecoration: 'none' }}
      >
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={btnClass}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'white', textDecoration: 'none' }}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={btnClass} onClick={onClick}>
      {children}
    </button>
  );
};
