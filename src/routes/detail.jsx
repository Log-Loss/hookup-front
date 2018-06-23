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
    this.props.dispatch({type: 'main/fetchVertices', payload: params})
  }

  componentWillReceiveProps(newProps) {
    if (this.props.location.pathname !== newProps.location.pathname) {
      console.log(newProps.location.pathname)
      this.props.dispatch({type: 'main/fetchVertices', payload: newProps.match.params})
    }
  }

  getData() {
    let flag = true;
    const {max} = this.state;
    let nodeMap = {}
    let edges = []
    let count = 0;
    if (!this.props.main.vertices || !this.props.main.vertices.length) {
      return {edges, nodes: []}
    }
    this.props.main.vertices.forEach(item => {
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

  loadMore = () => {
    const {params} = this.props.match
    const page = Number(params.page || 0) + 1
    this.props.dispatch(routerRedux.push(`/detail/${params.filter}/${params.name}/${page}`))
  }

  getTitle = () => {
    const {params} = this.props.match
    const {filter, name} = params
    if (filter === 'name')
      return `RESULT: NAME IS ${name}`
    else if (filter === 'type')
      return `RESULT: TYPE IS ${name}`
    else if (filter === 'like')
      return `RESULT: NAME LIKE %${name}%`
    else if (filter === 'id')
      return `RESULT: ID IS ${name}`
  }


  render() {
    const {main, location} = this.props
    console.log(this.props)
    const menus = (
      <Menu onClick={(key) => this.setState({max: Number(key.key)})}>
        <Menu.Item key="2">2 items/node</Menu.Item>
        <Menu.Item key="5">5 items/node</Menu.Item>
        <Menu.Item key="10">10 items/node</Menu.Item>
        <Menu.Item key="20">20 items/node</Menu.Item>
        <Menu.Item key="40">40 items/node</Menu.Item>
        <Menu.Item key="100">100 items/node</Menu.Item>
        <Menu.Item key="1000">1000 items/node</Menu.Item>
      </Menu>
    );
    const menu = (
      <Button.Group size="small">
        <Dropdown overlay={menus}>
          <Button size="small">{this.state.max} items/node</Button>
        </Dropdown>
        {
          this.props.main.vertices && this.props.main.vertices.length > 9 ?
          <Button size="small" onClick={this.loadMore}>Load more</Button> : null
        }
      </Button.Group>
    )
    return (
      <Main location={location} loading={main.loading}>
        <div className={styles.normal}>
          <Map data={this.getData()} menu={menu} title={this.getTitle()}/>
        </div>
      </Main>
    );
  }
}

function mapStateToProps({main}) {
  return {main}
}

export default connect(mapStateToProps)(Detail);
