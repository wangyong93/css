import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Popconfirm,
  Checkbox,
  Table,
  Pagination
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';


import styles from './PolicyManage.less';
const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
// const statusMap = ['default', 'processing', 'success', 'error'];
// const status = ['关闭', '运行中', '已上线', '异常'];
const statusMap = ['success','default' ];
const status = ['上线','下线'];
const gradation=['主渠道','次渠道'];
let modelData = ['','','1',''];
let activeStrategyId = '';
// ld: 搜索翻页参数
const fetchParams = {
  pageNum : '1',
  status : '',
  strategyName : '',
  pageSize: 10
};


//新增策略
const CreateForm = Form.create()(props => {
  const { modalTitle,modalVisible, form, handleAdd,editSavePolicy, handleModalVisible,clearContent,modalNum} = props;
  const [ relevantStrategyId, strategyName, status, remark ] = modelData;
  const styObj = {
    display:'none'
  }
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if(modalNum === 1){
        editSavePolicy(fieldsValue);
      }else{
        handleAdd(fieldsValue);
      }
    });
  };
  return (
    <Modal
      destroyOnClose={clearContent}
      title={modalTitle}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() =>{
        // console.log(this.refs.canalName.value)
         return handleModalVisible() 
        }
      }
      width='50%'
    >
      {modalNum == 1 ?
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="PolicyId" style = {styObj}>
        {form.getFieldDecorator('relevantStrategyId', { initialValue: relevantStrategyId })(<Input placeholder="请输入" />)}
        </FormItem> :  
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="PolicyId">
          {form.getFieldDecorator('relevantStrategyId', { initialValue: relevantStrategyId,
            rules: [{ required: true, message: '不能为空或超过20个字', max:20 }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
      }

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="策略名称">
        {form.getFieldDecorator('strategyName', {initialValue: strategyName,
          rules: [{ required: true, message: '不能为空或超过100个字', max:20 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 5 }} label="状态">
      {form.getFieldDecorator('status', {initialValue: status})
          (<Select  placeholder="请选择" style={{ width: '100%' }}>
            <Option value="0">上线</Option>
            <Option value="1">下线</Option>
          </Select>)
      }    
      </FormItem> 
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="策略描述">
        {form.getFieldDecorator('remark', {initialValue: remark,
          rules: [{ required: true, message: '不能为空或超过200个字', max:50 }],
        })(<TextArea rows={4} />)}
      </FormItem> 
    </Modal>
  );
});

@connect(({ policy, loading }) => ({
  policy,
  loading: loading.models.policy,
}))

@Form.create()
export default class PolicyManage extends PureComponent {
  
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'policy/fetch',       //前半部分是model的namespace（命名空间），后半部分对应model中的effects（处理异步逻辑）,或reducers（处理同步逻辑）。
      payload: fetchParams,    
    });
  }

  state = {
    modalTitle:'',
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    clearContent:true,
    // CopyBoxVisible:false
    modalNum:0    //0为新增策略，2为编辑
  };

    // ld:重置函数
    handleFormReset = () => {
      const { form, dispatch } = this.props;
  
      fetchParams.pageNum = '1';
      fetchParams.status = '';
      fetchParams.strategyName = '';
  
      form.resetFields();
      this.setState({
        formValues: {},
      });
      dispatch({
        type: 'policy/fetch',
        payload:fetchParams,
      });
    };

  onSelChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }


  // handleStandardTableChange = (pagination, filtersArg, sorter) => {
  //   const { dispatch } = this.props;
  //   const { formValues } = this.state;

  //   const filters = Object.keys(filtersArg).reduce((obj, key) => {
  //     const newObj = { ...obj };
  //     newObj[key] = getValue(filtersArg[key]);
  //     return newObj;
  //   }, {});

  //   const params = {
  //     currentPage: pagination.current,
  //     pageSize: pagination.pageSize,
  //     ...formValues,
  //     ...filters,
  //   };
  //   if (sorter.field) {
  //     params.sorter = `${sorter.field}_${sorter.order}`;
  //   }

  //   dispatch({
  //     type: 'policy/fetch',
  //     payload: params,
  //   });
  // };



  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'policy/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  // ld: <StandardTable>-onSelectRow事件触发函数
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };


  // <Form>-onSubmit查询事件触发函数
  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      fetchParams.pageNum = '1';
      fetchParams.status = fieldsValue.status;
      fetchParams.strategyName = fieldsValue.strategyName;

      dispatch({
        type: 'policy/fetch',
        payload: fetchParams,
      });
    });
  };

  // ld:布尔值状态切换函数  
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,     //强制转换为布尔类型
    });
  };

//修改弹出框标题,区分是新建主渠道还是次渠道
  changeTitle(str,num){         
    this.setState({
      modalTitle: str,
      modalNum:num
    },()=>{
      // console.log(this.state.modalNum)      
    });
  }


// ld:查询条件渲染
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="策略">
              {getFieldDecorator('strategyName',{initialValue: fetchParams.strategyName})(<Input placeholder="ID和名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            {/* <FormItem label="使用状态"> */}
            <FormItem label="状态">
              {getFieldDecorator('status',{initialValue: fetchParams.status})(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {/* <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option> */}
                  <Option value="0">上线</Option>
                  <Option value="1">下线</Option>
                  <Option value="">全部</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div style={{ overflow: 'hidden' , textAlign:'center'}}>
              <span style={{marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </span>
            </div>
         </Col>         
        </Row>
   
      </Form>
    );
  }

//表格查询条件状态渲染
renderForm() {
  return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
}

// 新增策略请求接口函数 
handleAdd = fields => {
  const { dispatch } = this.props;
  fields.relevantStrategyId = Number(fields.relevantStrategyId);
  dispatch({
    type: 'policy/add',
    payload: fields,
    callback: (res) => {
      let notice = res;
      if (notice.status === 0) {
        this.setState({
          modalVisible: false,
        });
        debugger;
        message.success(notice.msg);
        dispatch({
          type: 'policy/fetch',
          payload: fetchParams
        });
      } else {
        message.error(notice.msg);
      }
    }
  });
};

//根据策略ID删除策略确认函数
showDeleteConfirm(id) {
  const that=this;
  confirm({
    title: '确认要删除该策略信息？',
    content: '策略信息一经删除便不可恢复，删除后关联的入口也将同样被清除',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    style:{ top: 300 },
    onOk() {
      that.deleteStrategy(id)
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}


//执行删除策略函数
  deleteStrategy(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'policy/remove',
      payload: id,
      callback: (res) => {
        console.log(res)        
        let notice = JSON.parse(res);
        console.log(notice)
        if (notice.status === 0) {
          // console.log('刷新数据');
          message.success(notice.msg);
          dispatch({
            type: 'policy/fetch',
          });
        } else {
          message.error(notice.msg);
        }
      }
    })
  }

  // 新建策略
  addPolicy = () => {
    this.changeTitle('新建策略',0);
    modelData = ['','','1','']; 
    this.handleModalVisible(true);
  }

  // ld:编辑策略
  editPolicy = id => {
    // 根据策略ID获取明细
    activeStrategyId = id;
    const { dispatch } = this.props;
    dispatch({
      type: 'policy/getDetail',
      payload: id,
      callback: (res) => {
        if (res.status === 0) {
          this.changeTitle('基本信息',1); 
          this.handleModalVisible(true);
          this.updatePolicy(res.data);
        } else {
          message.error(res.msg)
        }
      }
    })
  }

  // ld: 修改更新策略明细
  updatePolicy = objDetail => {
    // 渲染编辑明细
    modelData = [objDetail.relevantStrategyId, objDetail.strategyName, objDetail.status.toString(), objDetail.remark];
  }

 // ld: 编辑保存明细
 editSavePolicy = objDetail => {
  console.log(objDetail)
  const data = objDetail;
  data.strategyId = activeStrategyId;
  const { dispatch } = this.props;
  objDetail.relevantStrategyId = Number(objDetail.relevantStrategyId);
  dispatch({
    type: 'policy/update',
    payload: data,
    callback: (res) => {
      debugger;
      let notice = res;
      if (notice.status === 0) {
        this.setState({
          modalVisible: false,
        });
        message.success(notice.msg);
        dispatch({
          type: 'policy/fetch',
          payload: fetchParams
        });
      } else {
        message.error(notice.msg);
      }
    }
  });
}


//复制链接
  info() {
    Modal.info({
      iconType:'a',
      style:{top:300},
      width:600,
      okText:'复制链接',
      content: '这是一条链接',
      maskClosable:true,
      onOk() {
        console.log(111)
      },
    });
  }

    // ld: 翻页
    turnPage = (pageNumber) => {
      fetchParams.pageNum = pageNumber.toString();
      this.props.dispatch({
        type: 'policy/fetch',
        payload: fetchParams
      });
    }

  // ld: 改变每个页面显示的条数
  onShowSizeChange = (current, pageSize) => {
    fetchParams.pageSize = pageSize
    this.props.dispatch({
      type: 'policy/fetch',
      payload: fetchParams
    });
  }

  // ld: 渲染表格明细函数    
  render() {
    const { policy: { data }, loading } = this.props;
    const { selectedRows, modalVisible, modalTitle,clearContent,CopyBoxVisible,modalNum } = this.state;

    const columns = [
      {
        title: '策略ID',
        dataIndex: 'relevantStrategyId',
      },
      {
        title: '策略名称',
        dataIndex: 'strategyName',          
        // render(val){return  <a>{val}</a> }    
      },
      {
        title: '策略描述',
        dataIndex: 'remark',
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: [
          {
            text: status[0],
            value: '上线',
          },
          {
            text: status[1],
            value: '下线',
          },
        ],
        onFilter: (value, record) => record.status.toString() === value,      //record是dataSource循环出来的每一行的数据
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      }, 
      {
        title: '创建人',
        dataIndex: 'createBy',
      },     
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        // sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      }, 
      {
        title: '修改人',
        dataIndex: 'modifyBy',
      },      
      {
        title: '修改时间',
        dataIndex: 'updatedAt',
        // sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>

             <a onClick={(e) => this.showDeleteConfirm(record.strategyId)}>删除</a>
             <Divider type="vertical" />
             {/* <a onClick={() =>{ this.changeTitle('基本信息',1); return  this.handleModalVisible(true)}}>编辑</a> */}
             <a onClick={(e) => this.editPolicy(record.strategyId)}>编辑</a>
             

          </Fragment>

        ),
      },
    ];
    
    // const menu = (
    //   <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
    //     <Menu.Item key="remove">删除</Menu.Item>
    //     <Menu.Item key="approval">批量审批</Menu.Item>
    //   </Menu>
    // );

    const parentMethods = {
      handleAdd: this.handleAdd,
      editSavePolicy: this.editSavePolicy,      
      handleModalVisible: this.handleModalVisible,
      // showCopyModal:this.showCopyModal
    };
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      },
    };
    return (
      <PageHeaderLayout title="策略管理">
        <Card bordered={false}>
          <div className={styles.PolicyManage}>
            <div className={styles.tableTitle}>策略管理</div>                
            <div className={styles.PolicyManageForm}>{this.renderForm()}</div>
            <div className={styles.PolicyManageOperator}>
              <Button icon="plus" type="primary" onClick={() =>{ this.addPolicy() } }>
                新建
              </Button>
            </div>
            <Table
              columns={columns}
              dataSource={data.list}
              loading={loading}
              rowKey={record => record.id}
              pagination={false}
            />
            {/* <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              rowSelection={rowSelection}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              // onChange={this.handleStandardTableChange}
              onChange={this.turnPage}  
              onShowSizeChange={this.onShowSizeChange}                          
            /> */}
            <Pagination
              className="ant-table-pagination"
              showSizeChanger 
              showQuickJumper 
              total={data.total}
              current={data.pageNum}
              pageSize={fetchParams.pageSize}
              onChange={this.turnPage}
              onShowSizeChange={this.onShowSizeChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} modalTitle={modalTitle} clearContent={clearContent}  modalNum={modalNum}/>
        {/* <CopyBox {...parentMethods} CopyBoxVisible={CopyBoxVisible}/> */}
      </PageHeaderLayout>
    );
  }
}
