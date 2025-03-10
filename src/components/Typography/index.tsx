import { ITypographyProps } from '@utils';
import styles from './style.module.scss';

export const Typography = ({
  text = 'button',
  style,
  className,
  limit,
}: ITypographyProps) => {
  const displayedText =
    limit && text?.length > limit ? `${text.substring(0, limit)}...` : text;

  return (
    <div className={className ? styles[className] : ''} style={style}>
      {displayedText}
    </div>
  );
};
