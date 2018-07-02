import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { div } from 'gl-matrix/src/gl-matrix/vec4';
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
  Steps,
  Radio,
  Tree
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import Procedure from 'components/Procedure';


import styles from './RouterRules.less';
const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;
const Step = Steps.Step;
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
// const statusMap = ['default', 'processing', 'success', 'error'];
// const status = ['关闭', '运行中', '已上线', '异常'];
const statusMap = ['default', 'success'];
const status = ['下线','上线'];
const gradation=['主渠道','次渠道'];



const CreateForm = Form.create()(props => {
  const { modalTitle,modalVisible, form, handleAdd, handleModalVisible,clearContent,current,modalNum} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };      
  const chooseCustom = 
  (
      <Select defaultValue="微信公众号" style={{ width: 120 }} onChange={this.handleChange}>
      <Option value="微信公众号">微信公众号</Option>
      <Option value="APP">APP</Option>
      <Option value="支付宝生活号">支付宝生活号</Option>
    </Select>
  )       
  const knowledge = 
  (
      <RadioGroup onChange={this.onChange} >
          <Radio value={'启用'}>启用</Radio>
          <Radio value={'不启用'}>不启用</Radio>
      </RadioGroup>
  )
  let robot = 
  (
      <RadioGroup onChange={this.onChange} >
          <Radio value={'启用'}>启用</Radio>
          <Radio value={'不启用'}>不启用</Radio>
      </RadioGroup>
  )
  const choosePolicy = 
  (
      <Select defaultValue="策略1" style={{ width: 120 }} onChange={this.handleChange}>
      <Option value="策略1">策略1</Option>
      <Option value="策略2">策略2</Option>
      <Option value="策略3">策略3</Option>
    </Select>
  )
  const ruleInfo=
  (
      <Form>
    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="渠道名称">
      {form.getFieldDecorator('scanalName', {
        rules: [{ required: true, message: '不能为空或超过20个字', max:20 }],
      })(<Input placeholder="请输入" />)}
    </FormItem>

    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="规则名称">
      {form.getFieldDecorator('scanalName', {
        rules: [{ required: true, message: '不能为空或超过100个字', max:20 }],
      })(<Input placeholder="请输入" />)}
    </FormItem>
    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 5 }} label="状态">
        <Select defaultValue="下线" placeholder="请选择" style={{ width: '100%' }}>
          <Option value="上线">上线</Option>
          <Option value="下线">下线</Option>
        </Select>
    </FormItem> 
    <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="简介">
      {form.getFieldDecorator('desc', {
        rules: [{ required: true, message: '不能为空或超过200个字', max:50 }],
      })(<TextArea rows={4}/>)}
    </FormItem> 
    </Form>
  ) 
  const Step = Steps.Step;
  const steps = [{
    title: '进线渠道',
    content: chooseCustom,
  }, {
    title: '顺丰知道',
    content: knowledge,
  }, {
    title: '机器人',
    content: robot,    
  }, {
    title: '策略',
    content: choosePolicy,    
    
  }, {
    title: '完成',
    content:ruleInfo,
  }];
  
  const next=function(){
    console.log(current,modalTitle)
    
    const current = current + 1;
    // this.setState({ current });
    console.log('下一步')     
  }
  const prev = () =>{
    console.log(current,modalTitle)    
    const current = current - 1;
    // this.setState({ current });
    console.log('上一步')        
  }
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
      {modalNum==0?
        <div>
          <Steps direction="vertical" current={current}>
              {steps.map(item => <Step key={item.title} title={item.title} description={item.content} />)}
          </Steps> 
          <Button type="primary" onClick={()=>{console.log(current)}}>下一步</Button>
          <Button style={{ marginLeft: 8 }} onClick={prev}>上一步</Button>
        </div>
      :''}
      {modalNum==1?
          <Form>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="进线渠道">
              {/* {form.getFieldDecorator('scanalName', {
                rules: [{ required: true, message: '不能为空或超过20个字', max:20 }],
              })(<Input placeholder="请输入" />)} */}
                <Select defaultValue="微信公众号" placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="支付宝服务号">支付宝服务号</Option>
                  <Option value="官网">官网</Option>
                  <Option value="QQ手机端">QQ手机端</Option>
                </Select>
            </FormItem>
        
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="规则名称">
              {form.getFieldDecorator('scanalName', {
                rules: [{ required: true, message: '不能为空或超过100个字', max:20 }],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 5 }} label="状态">
                <Select defaultValue="下线" placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="上线">上线</Option>
                  <Option value="下线">下线</Option>
                </Select>
            </FormItem> 
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="简介">
              {form.getFieldDecorator('desc', {
                rules: [{ required: true, message: '不能为空或超过200个字', max:50 }],
              })(<TextArea rows={4}/>)}
            </FormItem> 
            <p className={styles.selectFn}>路由规则</p> 
            <div className={styles.fnSelect}>
              {/* <Checkbox onChange={this.onSelChange}>聊天窗口模板</Checkbox> 
              <Checkbox onChange={this.onSelChange}>访客模板</Checkbox> */}
              <Checkbox>顺丰知道</Checkbox> 
              {/* <Checkbox defaultChecked disabled>访客模板</Checkbox>
              <Checkbox defaultChecked disabled >客户信息收集模板</Checkbox> */}
                  <Tree
                    checkable
                  >
                    <TreeNode title="机器人" key="0-0">
                      <TreeNode title="小I机器人" key="0-0-0" ></TreeNode>
                      <TreeNode title="追一机器人" key="0-0-1"></TreeNode>
                    </TreeNode>
                  </Tree>
              {/* <Checkbox defaultChecked >策略</Checkbox> */}
              <Tree
                    checkable
                  >
                    <TreeNode title="策略" key="1-0">
                      <TreeNode title="策略1" key="1-0-0" ></TreeNode>
                      <TreeNode title="策略2" key="1-0-1"></TreeNode>
                    </TreeNode>
                  </Tree>
            </div> 
          </Form>
      :''}
    </Modal>
  );
});

@connect(({ routerRule, loading }) => ({
  routerRule,
  loading: loading.models.routerRule,
}))
@Form.create()
export default class RouterRules extends PureComponent {

    state = {
      modalTitle:'',
      modalVisible: false,
      expandForm: false,
      selectedRows: [],
      formValues: {},
      clearContent:true,
      // CopyBoxVisible:false
      current:0,
      modalNum:0  //0为新增策略，1为编辑
    };
  
  // next() {
  //   const current = this.state.current + 1;
  //   this.setState({ current });
  //   console.log('下一步')
  // }
  // prev() {
  //   debugger
  //   const current = this.state.current - 1;
  //   this.setState({ current });
  //   console.log('上一步')    
  // }
  onSelChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'routerRule/fetch',
    });
  }
      handleChange=(value)=>{
        console.log(`selected ${value}`);
    }
    onChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
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
      type: 'routerRule/fetch',
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
      type: 'routerRule/fetch',
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
          type: 'routerRule/remove',
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

      dispatch({
        type: 'routerRule/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,     //强制转换为布尔类型
    });
  };


  changeTitle(str,num){         //修改弹出框标题,区分是新建主渠道还是次渠道
    this.setState({
      modalTitle: str,
      modalNum:num
    });
  }
  handleAdd = fields => {
    this.props.dispatch({
      type: 'routerRule/add',
      payload: {
        description: fields.desc,
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
            {/* <FormItem label="规则编号">
              {getFieldDecorator('no')(<Input placeholder="请输入" />)}
            </FormItem> */}
            <FormItem label="渠道">
              {getFieldDecorator('no')(<Input placeholder="ID和名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            {/* <FormItem label="使用状态"> */}
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {/* <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option> */}
                  <Option value="上线">上线</Option>
                  <Option value="下线">下线</Option>
                  <Option value="全部">全部</Option>
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

 remove() {console.log('执行删除')}
 showDeleteConfirm() {

  confirm({
    title: '确认要删除该渠道路由信息？',
    content: '渠道路由信息一经删除便不可恢复，删除后关联的入口也将同样被清除',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    style:{ top: 300 },
    onOk() {
      console.log('OK');
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}
  info() {
    Modal.info({
      iconType:'a',
      style:{top:300},
      width:600,
      okText:'复制链接',
      content: '这是一条链接',
      maskClosable:true,
      onOk() {
        console.log('复制成功')
      },
    });
  }
  render() {
    const { routerRule: { data }, loading } = this.props;
    const { selectedRows, modalVisible, modalTitle,clearContent,CopyBoxVisible,current, modalNum} = this.state;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'channelId',
      },
      {
        title: '渠道名称',
        dataIndex: 'channelName',          
        // render(val){return  <a>{val}</a> }    
      },
      {
        title: '规则名称',
        dataIndex: 'ruleName',          
      },
      {
        title: '规则描述',
        dataIndex: 'useIsp',
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
        //   },
        //   // {
        //   //   text: status[2],
        //   //   value: 2,
        //   // },
        //   // {
        //   //   text: status[3],
        //   //   value: 3,
        //   // },
        // ],
        onFilter: (value, record) => record.status.toString() === value,      //record是dataSource循环出来的每一行的数据
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      }, 
      // {
      //   title: '层级',
      //   dataIndex: 'gradation',
      //   filters: [
      //     {
      //       text: gradation[0],
      //       value: '主渠道',
      //     },
      //     {
      //       text: gradation[1],
      //       value: '次渠道',
      //     },
      //     // {
      //     //   text: status[2],
      //     //   value: 2,
      //     // },
      //     // {
      //     //   text: status[3],
      //     //   value: 3,
      //     // },
      //   ],
      //   onFilter: (value, record) => record.gradation.toString() === value,
      //   render(val) {
      //     return <Badge  text={gradation[val]} />;
      //   },
      // }, 
      {
        title: '创建人',
        dataIndex: 'createBy',
      },     

      {
        title: '创建时间',
        dataIndex: 'createTime',
        // sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      }, 
      {
        title: '修改人',
        dataIndex: 'modifyBy',
      },      
      {
        title: '修改时间',
        dataIndex: 'modifyTime',
        // sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (record) => (
          <Fragment>
             {/* <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove()}>
               <a>删除</a>
             </Popconfirm>
             <Divider type="vertical" /> */}
             <a onClick={this.showDeleteConfirm}>删除</a>
             <Divider type="vertical" />
             <a onClick={() =>{ this.changeTitle('路由规则编辑',1); return  this.handleModalVisible(true)}}>编辑</a>

          </Fragment>

        ),
      },
    ];
    
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
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
      <PageHeaderLayout title="路由规则">
        <Card bordered={false}>
          <div className={styles.RouterRules}>
            <div className={styles.tableTitle}>路由规则</div>                
            <div className={styles.RouterRulesForm}>{this.renderForm()}</div>
            <div className={styles.RouterRulesOperator}>
              <Button icon="plus" type="primary" onClick={() =>{ this.changeTitle('新增路由接口',0); return this.handleModalVisible(true) } }>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              rowSelection={rowSelection}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
            {/* <Procedure/> */}
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} modalTitle={modalTitle} clearContent={clearContent} current={current} modalNum={modalNum}/>
      </PageHeaderLayout>
    );
  }
}
