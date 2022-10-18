import { FC } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { routes } from './constants/routes';
import Header from './componentsNew/Header';
import Navigation from './componentsNew/Navigation';
import {
  useConnectionInit,
  useAppInit,
  useHealthNotification,
  useFirebaseNotifications,
  useWebSocketSubscriptions,
} from './hooks';

const InitialCalls: FC = ({ children }) => {
  useAppInit();
  useHealthNotification();
  useConnectionInit();
  useFirebaseNotifications();
  useWebSocketSubscriptions();

  return <>{children}</>;
};

export const Router = (): JSX.Element => {
  return (
    <BrowserRouter>
      <InitialCalls>
        <Route component={Header} />
        <div className="fraktion__layout_navigation">
          <Route component={Navigation} />
          <div className="fraktion__layout_container">
            <Switch>
              {routes.map(({ exact, path, component: Component }, index) => (
                <Route
                  key={index}
                  exact={exact}
                  path={path}
                  component={() => <Component />}
                />
              ))}
            </Switch>
          </div>
        </div>
      </InitialCalls>
    </BrowserRouter>
  );
};
