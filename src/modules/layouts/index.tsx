import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Navbar } from '@components';
import { usePwaDetection } from '@hooks';
import styles from './style.module.scss';

interface ScreenProps {
  children: ReactNode;
  isMobileMenuOpen?: boolean;
  onMobileMenuToggle?: () => void;
}

export * from './Header';
export * from './Footer';

export const Screen = ({
  children,
  isMobileMenuOpen,
  onMobileMenuToggle,
}: ScreenProps) => {
  const { isMobilePwa } = usePwaDetection();
  return (
    <div className={styles.screenContainer}>
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={onMobileMenuToggle}
      />
      <main
        className={styles.screenMain}
        style={isMobilePwa ? { paddingBottom: 88 } : {}}
      >
        {children}
      </main>
      {isMobilePwa ? <Navbar /> : <Footer />}
    </div>
  );
};
