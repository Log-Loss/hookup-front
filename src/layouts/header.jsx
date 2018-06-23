import React from 'react';
import PropTypes from 'prop-types';
import {Menu, Icon} from 'antd';
import {Link} from 'dva/router';
import Search from '../components/Search'

import styles from './header.less';

function Header({location, dispatch}) {
  return (
    <header className={styles.normal}>
      <div className={styles.logo}>
        <Link to="/">Hookup</Link>
      </div>
      <Search dispatch={dispatch}/>
    </header>
  );
}

export default Header;
