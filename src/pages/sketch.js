import React from 'react';
import Link from 'gatsby-link';

import styles from './sketch.module.scss';

const prefix = '/sketch';

const Sketch = () => {
  const links = [
    { show: 'Smooth camera', to: `${prefix}/smooth-camera` },
  ];

  return (
    <div className={styles.wrapper}>
      {
        links.map(link => (
          <Link
            className={`${styles.link}`}
            to={link.to}
            id={link.show}
            key={link.show}
          />
        ))
      }
    </div>
  );
};

export default Sketch;
