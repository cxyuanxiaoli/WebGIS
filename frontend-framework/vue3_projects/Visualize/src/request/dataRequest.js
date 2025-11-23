import request from './index';

export function getLeftBarData() {
  return request.get('/leftBar');
}

export function getRightPieData() {
  return request.get('/rightPie');
}

export function getRightGraphData(type) {
  return request.get(`/rightGraph/${type}`);
}

export function getLeftScatterData() {
  return request.get('/leftScatter');
}

export function getCenterMapData() {
  return request.get('/centerMap');
}

export function getCenterTextData() {
  return request.get('/centerText');
}
