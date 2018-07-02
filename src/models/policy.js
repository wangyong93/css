import { queryPolicy,removePolicy,getPolicyDetail,updatePolicy,addPolicy } from '../services/api';

export default {

  //namespace：该字段就相当于model的索引，根据该命名空间就可以找到页面对应的model;
  namespace: 'policy',              

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  //effects： 处理所有的异步逻辑，将返回结果以Action的形式交给reducer处理；
  effects: {                                                        // 1、路由配置  2、数据模型   3、渲染数据
      *fetch({ payload }, { call, put }) {                          //common/router.js路由文件配置namespace唯一标示以及组件
        const response = yield call(queryPolicy, payload);          //CannalManage.js文件中的 @connect通过models/rule.js文件namespace这个唯一标识连接到该数据模型;
        yield put({                                                 //                       dispatch({ type: 'rule/fetch'})来触发effects中的fetch方法，fetch方法中调用接口queryRule
          type: 'save',
          payload: response.data,
        });
      },
    *add({ payload:obj, callback }, { call, put }) {
      const response = yield call(addPolicy, obj);
      // yield put({
      //   type: 'save',
      //   payload: response.data,
      // });
      if (callback) callback(response);
    },
    *remove({ payload:id, callback }, { call, put }) {
      const response = yield call(removePolicy, id);      //response表示调用接口的返回结果，call里第一个参数为调用的接口，第二个参数为传入接口的参数
      // yield put({                                     //将数据交给reducers处理
      //   type: 'save',      
      //   payload: response.data,
      // });
      if (callback) callback(response);
    },
    *getDetail({ payload:id, callback }, { call, put }) {
      const response = yield call(getPolicyDetail, id);      
      // yield put({                                     
      //   type: 'save',      
      //   payload: response.data,
      // });
      if (callback) callback(response);
    },
    *update({ payload:obj, callback }, { call, put }) {                          //common/router.js路由文件配置namespace唯一标示以及组件
      const response = yield call(updatePolicy, obj);          //CannalManage.js文件中的 @connect通过models/rule.js文件namespace这个唯一标识连接到该数据模型;
      if (callback) callback(response);      
    },    
  },

//reducer 类似于 redux 中的 reducer，它是一个纯函数，用于处理同步操作，是唯一可以修改 state 的地方，由 action 触发，它有 state 和 action 两个参数。
  reducers: {
    save(state, action) {         
      return {
        ...state,
        data: action.payload,           //将数据返回给页面
      };
    },
  },
};
