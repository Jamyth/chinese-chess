import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { NavigationService } from 'util/NavigationService';
import { ObjectUtil } from 'jamyth-web-util';
import './index.less';

export const Main = React.memo(() => {
    return (
        <Switch>
            {ObjectUtil.toArray(NavigationService, (path, component) => (
                <Route exact component={component} path={path} key={path} />
            ))}
            {/** TODO/Jamyth tmp path */}
            <Redirect to="/game/normal" />
        </Switch>
    );
});
