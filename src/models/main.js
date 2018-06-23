import {getVertexById, getVertices, getRelated, getPath, getSimilar, getStatistic, getType} from '../services/main'
import {notification} from 'antd';
const model = {
  namespace: 'main',
  state: {
    loading: false,
    paths: [],
    relates: [],
    vertex: {},
    vertices: [],
    similars: [],
    types: [],
    statistic: {
      edgeCount: 220047,
      vertexCount: 95895,
    }
  },

  subscriptions: {
    setup({dispatch, history}) {  // eslint-disable-line
    }
  },

  effects: {
    * fetchBasic({payload}, {call, put}) {  // eslint-disable-line
      yield put({type: 'save', payload: {loading: true}});
      const res = yield call(getType)
      // const res1 = yield call(getStatistic)
      if (res) {
        yield put({type: 'save', payload: {types: res}});
      }
      yield put({type: 'save', payload: {loading: false}});
    },
    * fetchVertexById({payload}, {call, put}) {  // eslint-disable-line
      yield put({type: 'save', payload: {loading: true}});
      const res = yield call(getVertexById, payload)
      if (res) {
        yield put({type: 'save', payload: {vertex: res}});
      }
      yield put({type: 'save', payload: {loading: false}});
    },

    * fetchVertices({payload}, {call, put, select}) {  // eslint-disable-line
      yield put({type: 'save', payload: {loading: true}});
      const {filter, name, page = 0, size = 10} = payload
      let parameters = {}
      if (filter === 'name') {
        parameters = {name, page, size, like: false}
      } else if (filter === 'type') {
        parameters = {type: name, page, size, like: false}
      } else if (filter === 'like') {
        parameters = {name, page, size, like: true}
      } else if (filter === 'id') {
        const res = yield call(getVertexById, Number(name))
        yield put({type: 'save', payload: {vertices: res ? [res] : []}});
        yield put({type: 'save', payload: {loading: false}});
        return
      }
      const res = yield call(getVertices, parameters)
      if (res && Array.isArray(res)) {
        if (page === 0)
          yield put({type: 'save', payload: {vertices: res}});
        else {
          const vertices = yield select(state => state.main.vertices || [])
          yield put({type: 'save', payload: {vertices: [...vertices, ...res]}});
        }
      }
      yield put({type: 'save', payload: {loading: false}});
    },

    * fetchRelated({payload}, {call, put}) {  // eslint-disable-line
      yield put({type: 'save', payload: {loading: true}});
      const res = yield call(getRelated, payload)
      if (res && Array.isArray(res)) {
        yield put({type: 'save', payload: {relates: res}});
      }
      yield put({type: 'save', payload: {loading: false}});
    },

    * fetchPath({payload}, {call, put}) {  // eslint-disable-line
      yield put({type: 'save', payload: {loading: true}});
      let res;
      if (payload.isId === 'id') {
        res = yield call(getPath, {id1: payload.name1, id2: payload.name2})
      } else {
        const res1 = yield call(getVertices, {name: payload.name1, page: 0, size: 1, like: false})
        const res2 = yield call(getVertices, {name: payload.name2, page: 0, size: 1, like: false})
        if (!res1 || !res2 || !res1.length || !res2.length) {
          notification.error({message: `Not Found`, description: 'No such node name',})
          return
        }
        res = yield call(getPath, {id1: res1[0].id, id2: res2[0].id})
      }
      if (res && Array.isArray(res)) {
        yield put({type: 'save', payload: {paths: res}});
      }
      yield put({type: 'save', payload: {loading: false}});
    },

    * fetchSimilar({payload}, {call, put}) {  // eslint-disable-line
      yield put({type: 'save', payload: {loading: true}});
      const res = yield call(getSimilar, payload)
      if (res && Array.isArray(res)) {
        yield put({type: 'save', payload: {similars: res}});
      }
      yield put({type: 'save', payload: {loading: false}});
    },
  },

  reducers: {
    save(state, action) {
      return {...state, ...action.payload};
    }
  }

};

export default model;
