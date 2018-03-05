// @flow

import React from 'react';
import Link, { withPrefix } from 'gatsby-link';

import styles from './Nav.module.scss';

type Props = {
  pathname: string,
};

const Nav = ({ pathname }: Props) => {
  const links = [
    {
      show: 'About',
      to: '/',
    }, {
      show: 'Sketch',
      to: '/sketch',
    },
  ];

  if (pathname.replace(withPrefix('/sketch'), '').length >= 2) {
    return <div />;
  }

  return (
    <div className={styles.wrapper}>
      {
        links.map(link => (
          <Link
            className={`${styles.link} ${withPrefix(link.to) === pathname ? styles.active : ''}`}
            to={link.to}
            id={link.show}
            key={link.show}
          />
        ))
      }
    </div>
  );
};

export default Nav;
