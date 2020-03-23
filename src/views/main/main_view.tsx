import React from 'react'
import { mapProp, doAction, doFunction, KV } from 'module-reaction'
import { modle_user, MODULE_USER, LoginWithTokenAction } from '../../models/model_user'
import { UserDetialView } from '../user/user_detail'
import { Switch, Route, RouteComponentProps } from 'react-router-dom'
import { Layout, Icon, Avatar, Menu, Dropdown, Modal } from 'antd'
import { Net } from '../../utils/utils'
import './main_view.less'
import { model_dialog } from '../../models/model_dialog'
import { router_sign_in, router_user_detail } from '../../utils/enum'
const { Header, Content } = Layout

interface MainProps extends RouteComponentProps, KV {
    logined: boolean;// injected by mapProp
}

@mapProp(modle_user)
@mapProp(model_dialog, 'title:dlgTitle', 'visible:dlgVisible', 'text:dlgText', 'onOk:dlgOnOk', 'onCancel:dlgOnCancel', 'showLoading:dlgShowLoading')
export class MainView extends React.Component<MainProps, {}> {
    compoentRouters: RouterCfg[] = [
        {
            path: router_user_detail,
            component: UserDetialView,
            exact: true
        },
    ]
    state = {
        siderCollapse: false,
        siderTitle: ''
    }

    private onClickHeaderAvatar = (e: any) => {
        const { key } = e;
        if (key === 'logout') {
            doAction(MODULE_USER, { logined: false })
            doFunction(async () => {
                Net.clearToken()
                this.props.history.replace(router_sign_in)
            })
        }
    }

    componentWillMount() {
        doAction(LoginWithTokenAction, this.props.history)
    }

    render() {
        if (!this.props.logined) {
            return <></>
        }
        const {
            dlgVisible,
            dlgTitle,
            dlgText,
            dlgOnOk,
            dlgOnCancel,
            dlgShowLoading
        } = this.props
        return (
            <Layout className="main-view">
                <Header >
                    <Dropdown className="header-avatar-drop" overlay={
                        <Menu onClick={this.onClickHeaderAvatar}>
                            <Menu.Item key="logout">
                                <Icon type="logout" />
                                <span>Logout</span>
                            </Menu.Item>
                        </Menu>
                    }>
                        <Avatar
                            icon="user"
                            style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                        ></Avatar>
                    </Dropdown>
                </Header>
                <Content>
                    <Switch>
                        {
                            this.compoentRouters.map((_: RouterCfg, idx: number) => <Route key={`${_.path}-${idx}`} {..._} />)
                        }
                    </Switch>
                </Content>
                <Modal
                    visible={dlgVisible}
                    title={dlgTitle}
                    onOk={dlgOnOk}
                    onCancel={dlgOnCancel}
                    closable={false}
                    maskClosable={false}
                    confirmLoading={dlgShowLoading}
                >
                    {dlgText}</Modal>

            </Layout>
        )
    }


}