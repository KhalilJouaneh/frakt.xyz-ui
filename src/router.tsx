import { FC } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { routes } from './constants/routes';
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
      </InitialCalls>
    </BrowserRouter>
  );
};
