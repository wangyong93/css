import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}



// export async function queryRule(params) {
//   return request(`/api/rule?${stringify(params)}`);
// }


// export async function removeRule(params) {
//   return request('/api/rule', {
//     method: 'POST',
//     body: {
//       ...params,
//       method: 'delete',
//     },
//   });
// }

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/user/login', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function queryLogin (params) {  
  return request('/api/user/login',{
    method:'POST',
    body:params
  });
}
//查询所有渠道接口
export function queryRule(params) {
  return request(`/api/channel/page/arrang/search`,{
    method: 'POST',
    body: params || {} ,
  });
}
//新增主渠道接口
export async function addFatherCanal (params) {  
  return request('/api/channel/add',{
    method:'PUT',
    body:params
  });
}
//新增子渠道接口
export async function addSonCanal (params) {  
  return request('/api/channel/sub/add',{
    method:'PUT',
    body:params
  });
}
//根据ID获取渠道明细接口
export async function getCanalDetail (id) {             //async表示内部的函数都是同步的。
  return request('/api/channel/get/'+id,{
    method:'GET'
  });
}
//编辑渠道并更新渠道接口
export async function updateCanal (obj) {  
  return request('/api/channel/update/',{
    method:'POST',
    body:obj
  });
}
// 删除渠道接口
export async function removeCanal (id) {             
  return request('/api/channel/delete/'+id,{
    method:'DELETE'
  });
}

// 查询所有策略接口
export async function queryPolicy (params) {  
  return request('/api/strategy/page/search',{
    method:'POST',
    body:params  || {},
  });
}
//新建策略
export async function addPolicy (obj) {  
  return request('/api/strategy/add',{
    method:'PUT',
    body:obj
  });
}
// 删除策略接口
export async function removePolicy (id) {             //async表示内部的函数都是同步的。
  return request('/api/strategy/delete/'+id,{
    method:'DELETE'
  });
}
//根据ID获取策略明细接口
export async function getPolicyDetail (id) {             //async表示内部的函数都是同步的。
  return request('/api/strategy/get/'+id,{
    method:'GET'
  });
}
//编辑策略并更新策略接口
export async function updatePolicy (obj) {  
  return request('/api/strategy/update/',{
    method:'POST',
    body:obj
  });
}


// 查询所有路由接口
export async function queryRouter (params) {  
  return request('/api/rule/page/search',{
    method:'POST',
    body:params  || {},
  });
}
