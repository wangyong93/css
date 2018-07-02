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
  Pagination,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import copy from 'copy-to-clipboard';

import styles from './CanalManage.less';
import {queryRule,addFatherCanal,addSonCanal} from '../../services/api';
import observer from '../../utils/observer';



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
const level=['主渠道','','次渠道'];
let tempCanalRecord = null;
let activeCanalId = '';
let modelData = ['','','1',''];

//搜索翻页参数
const fetchParams = {
  pageNum : '1',
  status : '',
  channelName : '',
  pageSize: 10
};


const CreateForm = Form.create()(props => {
  const { modalTitle,modalVisible, form, handleAdd,editSaveCanal, handleModalVisible,clearContent, modalNum,record} = props;
  const [channelId,channelName,status,remark]=modelData
  
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if(modalNum===0){
        if (tempCanalRecord === null) {         //新增主渠道时记录为空，新增子渠道时记录不为空
          // wy: 新增主渠道
          addFatherCanal({"channelName": fieldsValue.channelName,"businessId":'789',"remark": fieldsValue.remark,'status':fieldsValue.status})
        } else {
          // wy: 新增子渠道
          fieldsValue.parentChannelId=tempCanalRecord.channelId+'';  
         addSonCanal({"parentChannelId":fieldsValue.parentChannelId,"channelName": fieldsValue.channelName,"businessId":'789',"remark": fieldsValue.remark,'status':fieldsValue.status})
        } 
        handleModalVisible(false);
      } else {
        // wy: 编辑
        fieldsValue.channelId=channelId
        console.log(fieldsValue)
        editSaveCanal(fieldsValue);
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
    <Form onSubmit={this.handleSubmit}>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="渠道名称">
        {form.getFieldDecorator('channelName', {
          initialValue:channelName,
          rules: [{ required: true, message: '不能为空或超过20个字', max:20 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>


      
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 5 }} label="状态">
      {form.getFieldDecorator('status',{initialValue:status,rules:[{required: true}]})(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            <Option value="0">上线</Option>
            <Option value="1">下线</Option>
          </Select>
      )}
      </FormItem> 
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="简介">
        {form.getFieldDecorator('remark', {initialValue:remark,
          rules: [{ required: true, message: '不能为空或超过50个字', max:50 }],
        })(<TextArea rows={4} />)}
      </FormItem> 
      <p className={styles.selectFn}>功能选择</p> 
      <div className={styles.fnSelect}>
         {/* <Checkbox onChange={this.onSelChange}>聊天窗口模板</Checkbox> 
         <Checkbox onChange={this.onSelChange}>访客模板</Checkbox> */}
         <Checkbox defaultChecked disabled>聊天窗口模板</Checkbox> 
         <Checkbox defaultChecked disabled>访客模板</Checkbox>
         <Checkbox defaultChecked disabled >客户信息收集模板</Checkbox>
         <Checkbox defaultChecked disabled >客户留言模板</Checkbox>
      </div>  
      </Form>  
    </Modal>
  );
});

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class CanalManage extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;  
    dispatch({
      type: 'rule/fetch',
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
    modalNum:0,   
  };
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }


  handleStatusChange(value){
    console.log(11111)
    console.log(`selected ${value}`)
  }

  handleCanalNameChange(value){
    console.log(11111)
    console.log('changed',value)
  }


  onSelChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }


  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

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
          type: 'rule/remove',
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

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

 // ld: <Form>-onSubmit查询事件触发函数
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
      debugger
      fetchParams.pageNum = '1';
      fetchParams.status = fieldsValue.status;
      fetchParams.channelName = fieldsValue.channelName;

      dispatch({
        type: 'rule/fetch',
        payload: fetchParams,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,     //强制转换为布尔类型
    });

  };

  //通过点击更多,触发方法argumentPost，拿到record,然后复制给全局变量
  argumentPost = obj => {
    tempCanalRecord = obj;
    console.log(tempCanalRecord);
  }
  // showCopyModal = flag =>{
  //   this.setState({
  //     CopyBoxVisible:!!flag,
  //   })
  // };

  changeTitle(str,num){         //修改弹出框标题,区分是新建主渠道还是次渠道
    this.setState({       
      modalTitle: str,
      modalNum:num
    },()=>{
      // console.log(this.state.modalNum)
    });
    
  }

  // ld:新建渠道
  addCanal = (val, bool) => {   
    //bool为true时为新建主渠道，为false时为新增子渠道 
    this.changeTitle(bool?'新建主渠道':'新增子渠道',val);
    modelData = ['','','1','']; 
    this.handleModalVisible(true);
    if(bool){
      tempCanalRecord = null;
    }
  }

  // ld:编辑渠道
  editCanal = id => {
    // 根据渠道ID获取明细
    activeCanalId = id;
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/getDetail',
      payload: id,
      callback: (res) => {
        console.log(res)
        if (res.status === 0) {
          this.changeTitle('基本信息',2); 
          this.handleModalVisible(true);
          this.updateCanal(res.data);
        } else {
          message.error(res.msg)
        }
      }
    })
  }
  // ld: 修改更新渠道明细
  updateCanal = objDetail => {
    // 渲染编辑明细
    modelData = [objDetail.channelId, objDetail.channelName, objDetail.status.toString(), objDetail.remark];
  }
 // ld: 编辑保存明细
 editSaveCanal = objDetail => {
  const data = objDetail;
  debugger;
  data.channelId = activeCanalId;
  const { dispatch } = this.props;
  dispatch({
    type: 'rule/update',
    payload: data,
    callback: (res) => {
      let notice = res;
      if (notice.status === 0) {
        this.setState({
          modalVisible: false,
        });
        message.success(notice.msg);
        dispatch({
          type: 'rule/fetch',
          payload: fetchParams
        });
      } else {
        message.error(notice.msg);
      }
    }
  });
}

  modifyCanalInfo(record){
    console.log(record)
  }

  handleAdd = fields => {

    // const statusValue=(fields.status==='上线')?'0':'1';
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        remark: fields.remark,
        channelName:fields.channelName,
        // status:statusValue,
        status:fields.status,        
        level:fields.level
      },
    });
    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="渠道">
              {getFieldDecorator('channelName',{initialValue: fetchParams.channelName})(<Input placeholder="ID和名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status',{initialValue: fetchParams.status})(
                <Select placeholder="请选择" style={{ width: '100%' }}>
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



  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  //ld: 执行删除渠道信息 TODO
  deleteStrategy(id) {

    const { dispatch } = this.props;
    dispatch({
      type: 'rule/remove',
      payload: id,
      callback: (res) => {

        let notice = JSON.parse(res);
        
        if (notice.status === 0) {
          // console.log('刷新数据');
          message.success(notice.msg);
          
          dispatch({
            type: 'rule/fetch',
          });
        } else {
          message.error(notice.msg);
        }
      }
    })
  }


 showDeleteConfirm() {
  const recordId=tempCanalRecord.channelId;
  var that=this;
  confirm({
    title: '确认要删除该渠道信息？',
    content: '渠道信息一经删除便不可恢复，删除后关联的入口也将同样被清除',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    style:{ top: 300 },
    onOk() {   
      that.deleteStrategy(recordId)
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}

  //复制到粘贴板
  info() {
    const oneKeyCopy = (text) => {
      copy(text); //'我是要复制的内容'
      alert('成功复制到剪贴板');
    };
    let link='这是一条链接'
    Modal.info({
      iconType:'a',
      style:{top:300},
      width:500,
      okText:'复制链接',
      content: link,
      maskClosable:true,
      onOk(){
        oneKeyCopy(link)
      },
    });
  }

  // ld: 翻页
  turnPage = (pageNumber) => {
    fetchParams.pageNum = pageNumber.toString();
    this.props.dispatch({
      type: 'rule/fetch',
      payload: fetchParams
    });
  }

  // ld: 改变每个页面显示的条数
  onShowSizeChange = (current, pageSize) => {
    fetchParams.pageSize = pageSize
    this.props.dispatch({
      type: 'rule/fetch',
      payload: fetchParams
    });
  }

  render() {
    const { rule: { data }, loading } = this.props;
    const { selectedRows,modalVisible,modalTitle,clearContent,CopyBoxVisible,modalNum } = this.state;
    const columns = [
      {
        title: '渠道ID',
        dataIndex: 'channelId',
      },
      {
        title: '渠道名称',
        dataIndex: 'channelName',          
        // render(val){return  <a>{val}</a> }    
      },
      {
        title: '简介',
        dataIndex: 'remark',
      },
      {
        title: '状态',
        dataIndex: 'status',
        // filters: [
        //   {
        //     text: status[0],
        //     value: '上线',
        //   },
        //   {
        //     text: status[1],
        //     value: '下线',
        //   }
        // ],
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      }, 
      {
        title: '层级',
        dataIndex: 'level',
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <span>{level[val-1]}</span>
        },
      }, 
      {
        title: '创建人',
        dataIndex: 'createBy',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      }, 
      {
        title: '修改人',
        dataIndex: 'modifyBy',
      },      
      {
        title: '修改时间',
        dataIndex: 'modifyTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>

             <a onClick={(e) => this.editCanal(record.channelId)}>编辑</a>             
             <Divider type="vertical" />
            <Dropdown overlay={moreAct}  placement="bottomCenter" trigger={['click']} onVisibleChange={() => this.argumentPost(record)}>
              <a className="ant-dropdown-link" href="#">
                更多 <Icon type="down" />
              </a>
            </Dropdown>
          </Fragment>

        ),
      },
    ];
    const moreAct =  (
      <Menu>
        <Menu.Item>
            <a onClick={(e) => this.showDeleteConfirm()}>删除</a>           
        </Menu.Item>
        <Menu.Item>
          <a onClick={() =>{ this.addCanal(0, false) } }>新增</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.info}>链接</a>          
        </Menu.Item>
      </Menu>
    );    
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      editSaveCanal: this.editSaveCanal,      
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
      <PageHeaderLayout title="渠道管理">
        <Card bordered={false}>
          <div className={styles.CanalManage}>
            <div className={styles.tableTitle}>渠道管理</div>                
            <div className={styles.CanalManageForm}>{this.renderForm()}</div>
            <div className={styles.CanalManageOperator}>
              <Button icon="plus" type="primary" onClick={() =>{this.addCanal(0, true) } }>
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} modalTitle={modalTitle} clearContent={clearContent} modalNum={modalNum} />
        {/* <CopyBox {...parentMethods} CopyBoxVisible={CopyBoxVisible}/> */}
      </PageHeaderLayout>
    );
  }
}
