import React from 'react';
import styles from './style.module.scss';
import { ITypographyProps } from '@utils';

export const Typography: React.FC<ITypographyProps> = ({
  className,
  text,
  limit,
}) => {
  const displayText = limit ? text.slice(0, limit) + '...' : text;
  return <p className={`${styles.typography} ${className}`}>{displayText}</p>;
};
