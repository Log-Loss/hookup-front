import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'dva/router'
import {
  connect
} from 'dva';
import {Button, Table, Tag} from 'antd'

import styles from './detail.less';

import Main from '../layouts/main.jsx';

class Similar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    const {params} = this.props.match
    this.props.dispatch({type: 'main/fetchSimilar', payload: params})
  }

  componentWillReceiveProps(newProps) {
    if (this.props.location.pathname !== newProps.location.pathname) {
      console.log(newProps.location.pathname)
      this.props.dispatch({type: 'main/fetchSimilar', payload: newProps.match.params})
    }
  }

  getData() {
    if (!this.props.main.similars || !this.props.main.similars.length) {
      return []
    }
    return this.props.main.similars.map(e => ({
      id: e.Recommended.id,
      name: e.Recommended.name,
      type: e.Recommended.type,
      strength: e.Strength
    }))
  }

  render() {
    const {main, location} = this.props
    const columns = [{
      title: 'ID',
      dataIndex: 'Recommended.id',
    }, {
      title: 'Name',
      dataIndex: 'Recommended.name',
      render: e => e.replace(/_/g, ' ')
    }, {
      title: 'Type',
      dataIndex: 'Recommended.type',
      render: e => <Tag>{e}</Tag>
    }, {
      title: 'Strength',
      dataIndex: 'Strength'
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
      <Link to={`/detail/id/${record.Recommended.id}`}>GOTO</Link>&nbsp;&nbsp;&nbsp;
          <Link to={`/similar/${record.Recommended.id}`}>SIMILAR</Link>&nbsp;&nbsp;&nbsp;
          <Link to={`/path/${this.props.match.params.id}/${record.Recommended.id}/id`}>PATH</Link>
    </span>
      ),
    }];

    return (
      <Main location={location} loading={main.loading}>
        <div className={styles.normal}>
          <Table pagination={false}
                 columns={columns} rowKey="Recommended.id"
                 title={() => (<div>&nbsp;&nbsp;Similar Nodes of NODE({this.props.match.params.id}) <Link to={`/detail/id/${this.props.match.params.id}`}>GOTO</Link></div>)}
            dataSource={this.props.main.similars && Array.isArray(this.props.main.similars) ? this.props.main.similars : []}/>
        </div>
      </Main>
    );
  }
}

function mapStateToProps({main}) {
  return {main}
}

export default connect(mapStateToProps)(Similar);
