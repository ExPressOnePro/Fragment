import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {isAuthenticated} from "@/utils/auth.js";


export default function PrivateRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated() ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
}
