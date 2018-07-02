import { queryRule, removeCanal, addRule,getCanalDetail,updateCanal } from '../services/api';

export default {
  namespace: 'rule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {                                                      // 1、路由配置  2、数据模型   3、渲染数据
      *fetch({ payload }, { call, put }) {                        //common/router.js路由文件配置namespace唯一标示以及组件
        const response = yield call(queryRule, payload);          //CannalManage.js文件中的 @connect通过models/rule.js文件namespace这个唯一标识连接到该数据模型;
        yield put({                                               //                       dispatch({ type: 'rule/fetch'})来触发effects中的fetch方法，fetch方法中调用接口queryRule
          type: 'save',
          payload: response.data,
        });     
      },
    // *add({ payload, callback }, { call, put }) {
    //   const response = yield call(addRule, payload);
    //   debugger;
    //   yield put({
    //     type: 'save',
    //     payload: response.data,
    //   });
    //   if (callback) callback();
    // },
    *getDetail({ payload:id, callback }, { call, put }) {
      const response = yield call(getCanalDetail, id);      
      // yield put({                                     
      //   type: 'save',      
      //   payload: response.data,
      // });
      if (callback) callback(response);
    },
    *update({ payload:obj, callback }, { call, put }) {                          //common/router.js路由文件配置namespace唯一标示以及组件
      const response = yield call(updateCanal, obj);          //CannalManage.js文件中的 @connect通过models/rule.js文件namespace这个唯一标识连接到该数据模型;
      if (callback) callback(response);      
    }, 
    *remove({ payload:id, callback }, { call, put }) {

      const response = yield call(removeCanal, id);
      console.log(response)
      // yield put({
      //   type: 'save',
      //   payload: response.data,
      // });
      if (callback) callback(response);
      
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
