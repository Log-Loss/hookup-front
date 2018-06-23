import React from 'react';
import {connect} from 'dva';
import PropTypes from 'prop-types';
import {
  Layout, BackTop, Spin
} from 'antd';

import Header from './header.jsx';
import Footer from './footer.jsx';

import styles from './main.less';

function Main(props) {
  const {location, children, dispatch} = props
  return (
    <Layout className={styles.normal}>
      <Layout.Header className={styles.header}>
        <Header location={location} dispatch={dispatch}/>
      </Layout.Header>
      <Layout.Content className={styles.content}>
        <div className={styles.container}>
          {children}
        </div>
        <BackTop/>
      </Layout.Content>
      <Layout.Footer className={styles.footer}>
        <Footer/>
      </Layout.Footer>
    </Layout>
  );
}

Main.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired
};

export default connect()(Main);
