import React from 'react';
import PropTypes from 'prop-types';
import {
  Router, Switch, Route
} from 'dva/router';
import Dynamic from 'dva/dynamic';

function RouterConfig({
  history, app
}) {
  const Index = Dynamic({
    app,
    models: () => [
      import('./models/main')
    ],
    component: () => import('./routes/index')
  });

  const Name = Dynamic({
    app,
    models: () => [
      import('./models/main')
    ],
    component: () => import('./routes/detail')
  });

  const Similar = Dynamic({
    app,
    models: () => [
      import('./models/main')
    ],
    component: () => import('./routes/similar')
  });

  const Path = Dynamic({
    app,
    models: () => [
      import('./models/main')
    ],
    component: () => import('./routes/path')
  });

  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Index} />
        <Route path="/detail/:filter/:name/:page?" component={Name} />
        <Route path="/similar/:id/:sameType?" component={Similar} />
        <Route path="/path/:name1/:name2/:isId?" component={Path} />
      </Switch>
    </Router>
  );
}

RouterConfig.propTypes = {
  history: PropTypes.object.isRequired
};

export default RouterConfig;
