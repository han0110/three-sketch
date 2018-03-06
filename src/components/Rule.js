// @flow
/* eslint-disable jsx-a11y/label-has-for */

import React from 'react';
import styles from './Rule.module.scss';

type Props = {
  rules: Array<{
    symbol: string,
    name: string,
    description: string,
  }>,
};

const Rule = ({ rules }: Props) => (
  <div className={styles.wrapper}>
    <input type="checkbox" id="gear" />
    <label htmlFor="gear" className={styles.icon} />
    <label htmlFor="gear" className={styles.bg} />
    {
      rules.map(r => (
        <div className={styles.rule} key={r.description}>
          <div>{r.symbol}</div>
          <div>{r.name}</div>
          <div>{r.description}</div>
        </div>
      ))
    }
  </div>
);

export default Rule;
