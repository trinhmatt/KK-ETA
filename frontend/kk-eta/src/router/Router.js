import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from "../components/Home";
import DriverLogin from "../components/DriverLogin";
import DriverHome from "../components/DriverHome";
import OrderInfo from "../components/OrderInfo";
import Thanks from "../components/Thanks";
import ExpressHome from "../components/ExpressHome";
import ExpressOrderInfo from "../components/ExpressOrderInfo";

const AppRouter = () => (
  <Router basename={process.env.PUBLIC_URL}>
    <Switch>
      <Route path="/" exact={true}>
        <Home />
      </Route>
      <Route path="/:region/:orderNum">
        <OrderInfo />
      </Route>
      <Route exact path="/exp-driver">
        <ExpressHome />
      </Route>
      <Route exact path="/login">
        <DriverLogin />
      </Route>
      
      
      <Route exact path="/driver">
        <DriverHome />
      </Route>
      
      <Route exact path="/thanks">
        <Thanks />
      </Route>
      
      <Route path="/:orderNum">
        <ExpressOrderInfo />
      </Route>
      
      
    </Switch>
  </Router>
)

export default AppRouter;
