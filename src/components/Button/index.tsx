import React from 'react';
import { Typography } from '../Typography';
import styles from './style.module.scss';
import { IButtonProps } from '@utils';

export const Button: React.FC<IButtonProps> = ({
  onClick,
  label = 'Button',
  size = 'medium',
  color = 'primary',
  type = 'solid',
  disabled = false,
  buttonStyle,
  textStyles,
}) => {
  const buttonClass = [
    styles.defaultButton,
    size && styles[size],
    styles[color],
    styles[type],
    buttonStyle,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button onClick={onClick} className={buttonClass} disabled={disabled}>
      <Typography text={label} className={textStyles} />
    </button>
  );
};
