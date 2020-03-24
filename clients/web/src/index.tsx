import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { MainView } from './views/main/main_view';
import { Provider } from 'module-reaction'
import { UserSigninView } from './views/user/user_signin';
import './index.less';
import { router_sign_in } from './utils/enum';

const appRouters: RouterCfg[] = [
    {
        path: router_sign_in,
        component: UserSigninView,
        exact: true
    },
    {
        path: '/',
        component: MainView
    }
]

export const App: React.FC = () =>
    (
        <Router>
            <Switch>
                {
                    appRouters.map(_ => <Route key={_.path} {..._} />)
                }
            </Switch>
        </Router>
    )
ReactDOM.render(<Provider><App /></Provider>, document.getElementById('app'));

