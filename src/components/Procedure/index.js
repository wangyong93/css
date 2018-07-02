import React, { PureComponent } from 'react';
import { Steps , Radio , Select , Input , Form} from 'antd';
import { div } from 'gl-matrix/src/gl-matrix/vec4';
const Step = Steps.Step;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
export default class Procedure extends PureComponent {  
    state = {
        value: '启用',
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
    render(){
        const { getFieldDecorator } = this.props.form;        
        let chooseCustom = 
        (
            <Select defaultValue="微信公众号" style={{ width: 120 }} onChange={this.handleChange}>
            <Option value="微信公众号">微信公众号</Option>
            <Option value="APP">APP</Option>
            <Option value="支付宝生活号">支付宝生活号</Option>
          </Select>
        )       
        let knowledge = 
        (
            <RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio value={'启用'}>启用</Radio>
                <Radio value={'不启用'}>不启用</Radio>
            </RadioGroup>
        )
        let robot = 
        (
            <RadioGroup onChange={this.onChange} value={this.state.value}>
                <Radio value={'启用'}>启用</Radio>
                <Radio value={'不启用'}>不启用</Radio>
            </RadioGroup>
        )
        let choosePolicy = 
        (
            <Select defaultValue="策略1" style={{ width: 120 }} onChange={this.handleChange}>
            <Option value="策略1">策略1</Option>
            <Option value="策略2">策略2</Option>
            <Option value="策略3">策略3</Option>
          </Select>
        )
        let ruleInfo=
        (
            <Form>
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="渠道名称">
            {getFieldDecorator('scanalName', {
              rules: [{ required: true, message: '不能为空或超过20个字', max:20 }],
            })(<Input placeholder="请输入" />)}
          </FormItem>
    
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 8 }} label="规则名称">
            {getFieldDecorator('scanalName', {
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
            {getFieldDecorator('desc', {
              rules: [{ required: true, message: '不能为空或超过200个字', max:50 }],
            })(<TextArea rows={4}/>)}
          </FormItem> 
          </Form>
        ) 
        return (
            <Steps direction="vertical" current={1}>
                <Step title="选择客户" description={chooseCustom}/>
                <Step title="顺丰知道" description={knowledge} />
                <Step title="机器人" description={robot} />
                <Step title="策略" description={choosePolicy} />
                <Step title="完成" description={ruleInfo} />
            </Steps>            
        )
    }

    
}