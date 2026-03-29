import { Link } from 'react-router-dom';
import styles from './style.module.scss';

interface UserAvatarProps {
  avatarUrl?: string | null;
  username?: string | null;
  email: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatarUrl,
  username,
  email,
}) => {
  const getInitial = () => {
    if (username) return username[0].toUpperCase();
    return email[0].toUpperCase();
  };

  return (
    <Link to="/profile" className={styles.avatarLink}>
      {avatarUrl ? (
        <img src={avatarUrl} alt="User avatar" className={styles.avatar} />
      ) : (
        <div className={styles.avatarPlaceholder}>{getInitial()}</div>
      )}
    </Link>
  );
};
