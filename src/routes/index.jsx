import React from 'react';
import {connect} from 'dva';
import { Link } from 'dva/router';

import styles from './index.less';

import Main from '../layouts/main.jsx';
import Search from "../components/Search";
import Cloud from "../components/Cloud";

class Index extends React.PureComponent {
  componentDidMount() {
    this.props.dispatch({type: 'main/fetchBasic'})
  }

  render() {
    const {location, dispatch, main} = this.props
    return (
      <Main location={location}>
        <div style={{width: '60%', marginLeft: '20%', marginTop: 50}}>
          <h1>Hookup</h1>
          <Search dispatch={dispatch}/>
          <div className={styles.cont}>
            <div className={styles.box}>
              <div className={styles.title}>
                Edges
              </div>
              <div className={styles.content}>
                {main.statistic ? main.statistic.edgeCount : '-'}
              </div>
            </div>
            <div className={styles.box}>
              <div className={styles.title}>
                Vertexes
              </div>
              <div className={styles.content}>
                {main.statistic ? main.statistic.vertexCount : '-'}
              </div>
            </div>
          </div>
          <div className={styles.cont}>
            <div className={styles.box}>
              <div className={styles.title}>
                Types
              </div>
              {/*<div className={styles.content}>*/}
                {/*{main.types ? main.types.map(e => (*/}
                  {/*<span><Link to={'/detail/type/' + e} key={e}>{e}</Link>, </span>*/}
                {/*)) : ''}...*/}
              {/*</div>*/}
            </div>
          </div>
        </div>
        <div className={styles.content} style={{width: window.innerWidth - 148}}>
          <Cloud data={main.types.map(e => ({type: e, count: Math.floor(Math.random()*200)+200}))} dispatch={dispatch} />
        </div>
      </Main>
    );
  }
}


function mapStateToProps({main}) {
  return {main}
}

export default connect(mapStateToProps)(Index);
