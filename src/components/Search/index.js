import React from 'react';
import {Input, Select} from 'antd';
import {routerRedux} from 'dva/router';

import styles from './index.less';

class Search extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      filter: 'name',
      sameType: true,
      v1: '',
    }
  }
  onSearch = (value) => {
    if (!value) {
      this.props.dispatch(routerRedux.push('/'))
      return
    }
    if (this.state.filter === 'similar') {
      this.props.dispatch(routerRedux.push('/similar/'+value+(this.state.sameType?'/sameType':'')))
      return
    }
    if (this.state.filter === 'path') {
      this.props.dispatch(routerRedux.push('/path/'+encodeURI(this.state.v1)+'/'+encodeURI(value)))
      return
    }
    this.props.dispatch(routerRedux.push('/detail/'+this.state.filter+'/'+encodeURI(value)))
  }
  render() {
    const {dispatch} = this.props
    return (
      <div className={styles.box}>
        <Input.Group compact>
          <Select value={this.state.filter} onChange={(value) => {
            this.setState({filter: value})
          }}>
            <Select.Option value="id">ID</Select.Option>
            <Select.Option value="name">Name</Select.Option>
            <Select.Option value="type">Type</Select.Option>
            <Select.Option value="like">Name Like</Select.Option>
            <Select.Option value="similar">Similar Node</Select.Option>
            <Select.Option value="path">Path</Select.Option>
          </Select>
          {this.state.filter==='similar'?
            <Select value={''+this.state.sameType} onChange={(value) => {
              this.setState({sameType: value==='true'})
            }}>
              <Select.Option value={'true'}>Same Type</Select.Option>
              <Select.Option value={'false'}>All Types</Select.Option>
            </Select>:null
          }
          {this.state.filter==='path'?
          <Input style={{ width: '30%' }} placeholder="Search..." onChange={e => this.setState({v1: e.target.value})}/>:null}
          <Input.Search style={{ width: '50%' }} placeholder="Search..." enterButton onSearch={this.onSearch}/>
        </Input.Group>
      </div>
    );
  }
}


export default Search;
