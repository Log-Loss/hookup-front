import React from 'react';
import PropTypes from 'prop-types';
import {routerRedux} from 'dva/router';
import {
  connect
} from 'dva';
import {Button, Menu, Dropdown} from 'antd'

import styles from './detail.less';

import Main from '../layouts/main.jsx';
import Map from '../components/Map'

class Detail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      max: 20
    }
  }

  componentDidMount() {
    const {params} = this.props.match
    this.props.dispatch({type: 'main/fetchPath', payload: params})
  }

  componentWillReceiveProps(newProps) {
    if (this.props.location.pathname !== newProps.location.pathname) {
      console.log(newProps.location.pathname)
      this.props.dispatch({type: 'main/fetchPath', payload: newProps.match.params})
    }
  }

  getData() {
    let flag = true;
    const {max} = this.state;
    let nodeMap = {}
    let edges = []
    let count = 0;
    if (!this.props.main.paths || !this.props.main.paths.length) {
      return {edges, nodes: []}
    }
    this.props.main.paths.forEach(item => {
      count = 0;
      flag = true;
      const {id, type, name} = item
      if (!nodeMap[id]) {
        nodeMap[id] = {id, type, name, main: true}
      }
      if (item.incomings && Array.isArray(item.incomings)) {
        item.incomings.forEach(e => {
          if (!e.start || !flag) return
          if (!nodeMap[e.start.id])
            nodeMap[e.start.id] = e.start
          edges.push({id: e.id, source: e.start.id, target: id, tag: e.type})
          count++;
          if (count >= max) {
            flag = false
          }
        })
      }
      if (item.outgoings && Array.isArray(item.outgoings)) {
        item.outgoings.forEach(e => {
          if (!e.end || !flag) return
          if (!nodeMap[e.end.id])
            nodeMap[e.end.id] = e.end
          edges.push({id: e.id, source: id, target: e.end.id, tag: e.type})
          count++;
          if (count >= max) {
            flag = false
          }
        })
      }
    })
    console.log({edges, nodes: Object.values(nodeMap)})
    return {
      edges, nodes: Object.values(nodeMap).map(e => {
        e.name = e.name.replace(/_/g, ' ');
        return e
      })
    }
  }


  render() {
    const {main, location, match} = this.props
    console.log(this.props)
    return (
      <Main location={location} loading={main.loading}>
        <div className={styles.normal}>
          <Map data={this.getData()} menu={null} title={`PATH FROM ${match.params.name1} TO ${match.params.name2}`}/>
        </div>
      </Main>
    );
  }
}

function mapStateToProps({main}) {
  return {main}
}

export default connect(mapStateToProps)(Detail);
