import { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const { pathname } = useLocation();

  const menuItems = [
    { to: '/', label: 'Конструктор', Icon: BurgerIcon },
    { to: '/feed', label: 'Лента заказов', Icon: ListIcon },
    {
      to: '/profile',
      label: userName || 'Личный кабинет',
      Icon: ProfileIcon
    }
  ];

  const isActive = (path: string): boolean =>
    pathname === path ||
    (path === '/profile' && pathname.startsWith('/profile'));

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {menuItems.slice(0, 2).map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className={clsx(styles.link, isActive(to) && styles.link_active)}
            >
              <Icon type={isActive(to) ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2 mr-10'>{label}</p>
            </Link>
          ))}
        </div>
        <div className={styles.logo}>
          <Link to='/'>
            <Logo className='' />
          </Link>
        </div>
        <div className={styles.link_position_last}>
          {menuItems.slice(2).map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className={clsx(styles.link, isActive(to) && styles.link_active)}
            >
              <Icon type={isActive(to) ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2'>{label}</p>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};
