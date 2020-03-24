import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Layout, Col, Form, Input, Button, message } from 'antd'
import { Net } from '../../utils/utils';
import { MODULE_USER } from '../../models/model_user';
import { doFunction, doAction } from 'module-reaction';
import logo from '../../assets/logo.svg'
import './user_signin.less'
import { router_user_detail } from '../../utils/enum';
const { Header, Content } = Layout;

interface UserSigninProp extends RouteComponentProps {

}
export class UserSigninView extends React.Component<UserSigninProp, {}>{
    state = { password: '', email: '' }

    render() {
        return (
            <Layout className="signin-view">
                <Header>
                    <img src={logo} alt="canvas recruit" />
                </Header>
                <Content>
                    <Col lg={8} md={10} sm={20} xs={22}>
                        {
                            (<div className="content-box">
                                <div className="title">CANVAS RECRUIT LOGIN</div>
                                <Col className="form-box" lg={{ span: 22, offset: 1 }} sm={{ span: 24 }}>
                                    <Form className="password-box" onSubmit={this.onSubmit} layout="vertical">
                                        <Form.Item
                                            label="Email"
                                        >
                                            <Input type="email" onChange={e => this.recEmail(e.target.value)} />
                                        </Form.Item>
                                        <Form.Item
                                            label="Password"
                                        >
                                            <Input type="password" onChange={e => this.recPassword(e.target.value)} />
                                        </Form.Item>
                                        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                                            <Button type="primary" className="submit-btn" htmlType="submit">SIGN IN</Button>
                                        </Form.Item>
                                    </Form>

                                </Col>
                            </div>)
                        }
                    </Col>
                </Content>

            </Layout>
        )
    }

    private recPassword(password: string) {
        this.setState({ password })
    }
    private recEmail(email: string) {
        this.setState({ email })
    }

    private onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const { password, email, } = this.state
        if (!password) {
            message.error('please fill password')
            return
        }
        if (!email) {
            message.error('please fill email')
            return
        }

        const res = await Net.req('/user/admin-sign-in', { email, password }, 'post')
        if (res && res.jwt_token) {
            // after log in, goto default page
            doAction(MODULE_USER, { logined: true })
            doFunction(async () => this.props.history.replace(router_user_detail))
        }
    }
}