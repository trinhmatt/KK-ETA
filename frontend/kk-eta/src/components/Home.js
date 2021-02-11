import React from "react";
import { withRouter } from "react-router";
import database from "../firebase/firebase";

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
      this.findOrderEta();
    }
  }

  orderNumChange = (e) => {
    const orderNum = e.target.value;

    this.setState({ orderNum, errMsg: "" });
  }

  findOrder = (region) => {

    return new Promise((resolve, reject) => {
      let returnObj = {
        found: false,
        orderData: {}
      };

      database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/${region}`).once("value")
        .then((snapshot) => {

          const orders = snapshot.val();

          const orderNum = parseInt(this.state.orderNum);


          if (orders !== null) {

            for (let i = 0; i < orders.length; ++i) {
              if (orders[i].orderNumber === orderNum) {

                returnObj.found = true;
                returnObj.orderData = orders[i];

                const firstName = orders[i].fullName.substring(0, orders[i].fullName.indexOf(" "));
                returnObj.orderData.fullName = firstName;

              }
            }
          }

          resolve(returnObj);
        })
    })
  }

  findOrderEta = () => {

    //Error handling
    if (isNaN(parseInt(this.state.orderNum))) {
      this.setState({ errMsg: "Error: Please enter a valid number!", orderNum: "" })
    } else {

      //Check if order is done (i.e. in completed sheet)
      database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/completed`).once("value")
        .then((snapshot) => {
          const completedOrders = snapshot.val();
          let orderData = {};

          if (!!completedOrders[this.state.orderNum]) {
            orderData = {
              completed: completedOrders[this.state.orderNum].status,
              ...completedOrders[this.state.orderNum]
            }
            console.log(orderData)
            orderData.fullName = orderData.fullName.substring(0, orderData.fullName.indexOf(" "));

            this.props.history.push({ pathname: `/a/${this.state.orderNum}`, state: { orderData } });

          } else {

            //If not in completed, check if it is an express order
            //Check west first 
            database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/exp_west`).once("value")
              .then((snapshot) => {
                const orders = snapshot.val();

                if (!!orders[this.state.orderNum]) {
                  this.props.history.push({
                    pathname: `/${this.state.orderNum}`,
                    state: { data: orders[this.state.orderNum] }
                  })
                } else {
                  //Check east 
                  database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/exp_east`).once("value")
                    .then((snapshot) => {
                      const orders = snapshot.val();

                      if (!!orders[this.state.orderNum]) {
                        this.props.history.push({
                          pathname: `/${this.state.orderNum}`,
                          state: { data: orders[this.state.orderNum] }
                        })
                      }

                    })
                }
              })


            //If not express, check if it is a main order 
            database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/allOrders`).once("value")
              .then((snapshot) => {

                const orders = snapshot.val();
                let orderObj = {
                  fullName: "",
                  orderNum: 0,
                  eta: "",
                  completed: "",
                  status: ""
                }


                //Check if orders is in the list for all of today's orders
                if (!orders[this.state.orderNum]) {

                  this.setState({ errMsg: "Order not found, make sure the number is correct" });

                  //If it isn't processed show the order status
                  // } else if (orders[this.state.orderNum].status !== "Processed") {
                  //   this.setState({orderStatus: `Order Status: ${orderObj.status}`})
                } else {

                  orderObj = orders[this.state.orderNum];
                  orderObj.fullName = orderObj.fullName.substring(0, orderObj.fullName.indexOf(" "));

                  //Check for east orders
                  this.findOrder("east")
                    .then((order) => {

                      //If nothing, check west
                      if (!order.found) {

                        this.findOrder("west")
                          .then((returnObj) => {

                            //Need this in case order is not in east or west 
                            let regionCode = "a";

                            if (returnObj.found) {
                              regionCode = "w";
                              orderObj = returnObj.orderData;
                            }

                            this.props.history.push({ pathname: `/${regionCode}/${this.state.orderNum}`, state: { orderData: orderObj } });

                          }).catch((err) => console.log(err));
                      } else {
                        orderObj = order.orderData;
                        this.props.history.push({ pathname: `/e/${this.state.orderNum}`, state: { orderData: orderObj } });
                      }
                    })
                    .catch((err) => console.log(err))





                }
              })
          }
        })


    }
  }

  render() {
    return (
      <div >
        <HomeBox
          ordernum={this.state.orderNum}
          change={this.orderNumChange}
          click={this.findOrderEta}
          err={this.state.errMsg}
          enter={this.handleEnter}
        />
      </div>
    )
  }
}



export default withRouter(Home);
