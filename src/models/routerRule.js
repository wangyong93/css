import { queryRouter } from '../services/api';

export default {
  namespace: 'routerRule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
      *fetch({ payload }, { call, put }) {      
        const response = yield call(queryRouter, payload);          //CannalManage.js文件中的 @connect通过models/rule.js文件namespace这个唯一标识连接到该数据模型;
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
    // *remove({ payload, callback }, { call, put }) {
    //   const response = yield call(removeRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response.data,
    //   });
    //   if (callback) callback();
    // },
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
