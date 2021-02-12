import React from "react";
import { withRouter } from "react-router";

// style imports
import cx from 'clsx';
import Card from '@material-ui/core/Card';
import { CardContent, Avatar, CardMedia, CardActionArea, Box, Typography, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useLightTopShadowStyles } from '@mui-treasury/styles/shadow/lightTop';
import { useCoverCardMediaStyles } from '@mui-treasury/styles/cardMedia/cover';
import { useStyles } from '../styles';

function HomeBox({ ordernum, click, change, err, enter }) {
  const classes = useStyles();
  const shadowStyles = useLightTopShadowStyles();
  const mediaStyles = useCoverCardMediaStyles();
  return (
    <Card className={cx(classes.homebox, shadowStyles.root)}>
      <CardMedia
        classes={mediaStyles}
        image={
          'https://i.pinimg.com/originals/73/62/75/7362759c02faa8997f142569eeffd872.gif'
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
            <Typography className={classes.errmsg} variant={'overline'}>
              {err}
            </Typography>
            <br />
            <Avatar className={classes.icon} src={'https://i.imgur.com/mP3XMz6.png'} />
            <Typography className={classes.cta} variant={'overline'}>
              enter your order#
            <form noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
                <TextField
                  id="homeinput"
                  size='small'
                  variant="outlined"
                  value={ordernum}
                  onChange={change}
                  onKeyPress={enter}
                />
              </form>
            </Typography>
          </CardContent>
        </CardActionArea>
        <Button id="etabtn" variant="contained" onClick={click}>search</Button>
      </Box>
    </Card>
  )
}

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orderNum: "",
      errMsg: ""
    };
  }

  handleEnter = (e) => {
    if (e.key === 'Enter') {
      this.props.history.push(`/m/${this.state.orderNum}`)
      //this.findOrderEta();
    }
  }

  orderNumChange = (e) => {
    const orderNum = e.target.value;

    this.setState({ orderNum, errMsg: "" });
  }

  render() {
    return (
      <div >
        <HomeBox
          ordernum={this.state.orderNum}
          change={this.orderNumChange}
          click={() => this.props.history.push(`/m/${this.state.orderNum}`)}
          err={this.state.errMsg}
          enter={this.handleEnter}
        />
      </div>
    )
  }
}



export default withRouter(Home);
