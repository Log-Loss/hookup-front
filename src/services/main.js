import request from '../utils/request';

const apiUrl = 'http://115.159.68.131:8080';

export async function getVertexById(id) {
  return request(`${apiUrl}/vertex?id=${id}`);
}

export async function getVertices({name, type, page, size, like}) {
  return request(`${apiUrl}/vertices?page=${page}&size=${size}&${name?`&name=${name}`:''}${type?`&type=${type}`:''}&like=${like}`);
}

export async function getRelated(id) {
  return request(`${apiUrl}/related?id=${id}`);
}

export async function getPath({id1, id2}) {
  return request(`${apiUrl}/path?id1=${id1}&id2=${id2}`);
}

export async function getSimilar({id, sameType}) {
  return request(`${apiUrl}/similar?id=${id}&sameType=${sameType === 'sameType'}`);
}

export async function getType() {
  return request(`${apiUrl}/type`);
}

export async function getStatistic() {
  return request(`${apiUrl}/statistic`);
}
