import React from "react";
import { withRouter } from "react-router";
import { firebase } from "../firebase/firebase";

// style imports
import cx from 'clsx';
import Card from '@material-ui/core/Card';
import { CardContent, CardMedia, CardActionArea, Box, Typography, TextField, Button } from '@material-ui/core';
import { useLightTopShadowStyles } from '@mui-treasury/styles/shadow/lightTop';
import { useCoverCardMediaStyles } from '@mui-treasury/styles/cardMedia/cover';
import {useStyles} from '../styles';

function LoginBox({ err, email, pw, change, loginbtn, enter }) {
  const classes = useStyles();
  const shadowStyles = useLightTopShadowStyles();
  const mediaStyles = useCoverCardMediaStyles();

  return (
    <Card className={cx(shadowStyles.root)}>
      <CardMedia
        classes={mediaStyles}
        image={
          'https://i.pinimg.com/originals/6a/ce/2f/6ace2f3a57ced3f41d5b41731ab7bc35.gif'
        }
      />
      
          <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            color={'common.black'}
            textAlign={'center'}
          >
            <CardActionArea>

<CardContent className={classes.content}>
            <Typography className={classes.h3} variant={'overline'}>
              {err}
              <form noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
                <TextField
                  id="logininput"
                  variant="outlined"
                  name="email"
                  placeholder="email"
                  value={email}
                  onChange={change}
                />
              </form>
              <form noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
                <TextField
                  id="pwinput"
                  variant="outlined"
                  name="password"
                  placeholder="password"
                  type="password"
                  value={pw}
                  onChange={change}
                  onKeyPress={enter}
                />
              </form>
              
            </Typography>

        </CardContent>
      </CardActionArea>
      <Button id="loginbtn" variant="contained" onClick={loginbtn}>login</Button>
          </Box>
    </Card>
  )
}

class DriverLogin extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: "",
      password: "",
      errMsg: ""
    }
  }

  handleEnter = (e) => {
    if (e.key === 'Enter') {
      this.driverLogin();
    }
  }

  onInputChange = (e) => {
    const val = e.target.value;

    this.setState({ [e.target.name]: val })
  }

  driverLogin = () => {

    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((userData) => {

        const user = { uid: userData.user.uid, email: userData.user.email };

        if (user.email.indexOf("exp") > -1) {
          this.props.history.push({ pathname: "/exp-driver", state: { user } });
        } else {
          this.props.history.push({ pathname: "/driver", state: { user } });
        }


      })
      .catch((err) => {

        if (err.code.indexOf("user-not-found") > -1) {

          this.setState({ errMsg: "User does not exist" });

        } else if (err.code.indexOf("wrong-password") > -1) {

          this.setState({ errMsg: "Invalid password" });

        } else {

          this.setState({ errMsg: err.code });

        }
      });
  }

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoginBox
          err={this.state.errMsg}
          email={this.state.email}
          pw={this.state.password}
          loginbtn={this.driverLogin}
          change={this.onInputChange}
          enter={this.handleEnter}
        />
      </div>
    )
  }
}

export default withRouter(DriverLogin);
