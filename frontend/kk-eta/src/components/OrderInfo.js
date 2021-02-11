import React from 'react';
import { withRouter } from "react-router";
import dayjs from "dayjs";
import { GoogleSpreadsheet } from "google-spreadsheet";
import database from "../firebase/firebase";

// style imports
import cx from 'clsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { CardContent, Avatar, CardMedia, CardActionArea, CardActions, Box, Typography, TextField, Button, IconButton } from '@material-ui/core';
import { useLightTopShadowStyles } from '@mui-treasury/styles/shadow/lightTop';
import { useCoverCardMediaStyles } from '@mui-treasury/styles/cardMedia/cover';
import Rating from '@material-ui/lab/Rating';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import { ArrowBack } from '@material-ui/icons';
import { useStyles } from '../styles';

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon />,
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <SentimentDissatisfiedIcon />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfiedIcon />,
    label: 'Neutral',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon />,
    label: 'Satisfied',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon />,
    label: 'Very Satisfied',
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

const StyledRating = withStyles({
  iconFilled: {
    color: '#ffcd42',
  },
  iconHover: {
    color: '#ffe59e',
  },
  iconEmpty: {
    color: 'white'
  }
})(Rating);

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'white',
      padding: '2%',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: '#ffcd42',
      },
    },
  },
})(TextField);

function OrderInfoBox({ name, status, eta, err, done, prevdef, ratingbool, ratingchg, comment, commentchg, submit, pushhome, msg, newstatus }) {
  const classes = useStyles();
  const shadowStyles = useLightTopShadowStyles();
  const mediaStyles = useCoverCardMediaStyles();

  return (
    <Card className={cx(classes.infobox, shadowStyles.root)}>
      <CardMedia
        classes={mediaStyles}
        image={
          'https://i.pinimg.com/originals/73/62/75/7362759c02faa8997f142569eeffd872.gif'
        }
      />
      <IconButton id="backbtn" onClick={pushhome} >
        <ArrowBack fontSize="large" />
      </IconButton>
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        textAlign={'center'}
      >
        <Avatar className={classes.icon} src={'https://i.imgur.com/mP3XMz6.png'} />
        {
          (!!name && !done) ?
            (
              <div>
                <CardActionArea style={{ display: 'block' }}>
                  <CardContent >
                    <Typography className={classes.h3} variant={'overline'}>
                      hello {name}
                    </Typography>
                    <Typography className={classes.h4plain} variant={'overline'}>
                      thank you for your order!
                  </Typography>
                    <br /><br /><br /><br /><br /><br /><br />
                    {
                      (eta !== undefined && eta.length > 0) ?
                        <div>
                          <Typography className={classes.h4bold} variant={'overline'}>
                            current ETA: 
                          </Typography>
                          <br /><br />
                          <Typography className={classes.h4cool} variant={'overline'}>
                            <b>{eta}</b>
                          </Typography>
                          <br /><br />
                          <Typography className={classes.h6plain} variant={'overline'}>
                            *please keep in mind that the time is an estimate and may not be absolutely accurate
                        </Typography>
                        <br /><br /><br /><br /><br />
                        </div>
                        :
                        ''
                        // <div>
                        // <Typography className={classes.h4} variant={'overline'}>
                        //   order status: <br /> <b>{status}</b>
                        // </Typography>
                        // </div>
                    }
                    <br />
                    <Typography className={classes.h6yellow} variant={'overline'}>
                      {msg}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </div>

            ) :
            (done === true) ? (
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                textAlign={'center'}
              >
                <CardActionArea>
                  <CardContent>
                    <Typography className={classes.h3} variant={'overline'}>
                      hello {name}
                    </Typography>
                    <Typography className={classes.h4plain} variant={'overline'}>
                      {msg}
                    </Typography>
                  </CardContent>
                </CardActionArea>

                <CardActions>
                  <CardContent>
                    <CardActionArea>
                      <CardContent>
                        <Typography className={classes.yellowh5} variant={'overline'}>
                          How was your driver?
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <form noValidate autoComplete="off" onSubmit={prevdef}>
                      <StyledRating
                        name="rating"
                        getLabelText={(value) => customIcons[value].label}
                        IconContainerComponent={IconContainer}
                        onChange={ratingchg}
                      />
                      <br /><br />
                      <CssTextField
                        id="commentbox"
                        label="Comment Box (optional)"
                        value={comment}
                        onChange={commentchg}
                        multiline
                        rows={4}
                        variant="outlined"
                      />
                      <br /><br />
                      <Button
                        id="etabtn"
                        variant="contained"
                        disabled={ratingbool === false}
                        onClick={submit}
                      >
                        submit
                       </Button>
                    </form>
                  </CardContent>
                </CardActions>
              </Box>)
              :
              (<div>
                <Typography className={classes.errmsg} variant={'overline'}>
                  {err}
                </Typography>
              </div>)
        }
      </Box>
    </Card>
  )
}

class OrderInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errMsg: "",
      orderStatus: "",
      orderData: {},
      isDone: false,
      rating: 0,
      comment: "",
      ratingChanged: false,
      customMsg: "",
      newStatus: "",
    }
  }
  componentDidMount() {

    //Set scroll to top of page
    window.scrollTo(0, 0);

    //Check if they came from the home page or just entered the route

    //If they came from homepage, props will have location object
    if (!!this.props.location.state) {

      const orderData = this.props.location.state.orderData;
      let isDone = false;
      let customMsg = "";
      let newStatus = "";

      
      //Custom messages based on status of orders in allOrders
      //Check if order is shipping
      if (orderData.isShipping) {
        if (orderData.status === 'Processed') {
          customMsg = 'Your order is processed and will be fulfilled by Canada Post';
        }
        else if (orderData.status === 'Awaiting ID') {
          customMsg = 'Please refer to your invoice for further instructions';
        }
        else if (orderData.status === 'Awaiting EMT') {
          customMsg = `Don't forget to send in your EMT for $${orderData.orderTotal} before 3:30PM to ensure Canada Post receives your order`;
        }
        else if (orderData.status === 'Check back later') {
          customMsg = 'Our shipping cut-off is now 3:30PM.\nPlease check back around 1PM for the status of your order';
        }
        else {
          customMsg = 'We are processing your order. Please check back later.';
        }
      } else {
        if (orderData.status === 'Processed') {
          //Map is divided, ETA is available
          if (!!orderData.eta && orderData.eta.length > 0) {
            customMsg = `Don't forget to rate your driver after you've received your order!`;
          }
          //Map is divided, but drivers have not started route
          else if (!!orderData.eta) {
            customMsg = 'Your driver is picking up your order. Please check back shortly!';
          } else {
            customMsg = 'Your order is processed.\nPlease check back around 4:30PM for an ETA.';
          }

        }
        else if (orderData.status === 'Awaiting ID') {
          customMsg = 'Please refer to your invoice for further instructions';
        }
        else if (orderData.status === 'Awaiting EMT') {
          customMsg = `Don't forget to send in your EMT for $${orderData.orderTotal} before 3:30PM to ensure you receive your order today`;
        }
        else if (orderData.status === 'Check back later') {
          customMsg = 'Our delivery cut-off is now 3:30PM.\nPlease check back around 1PM for the status of your order';
        }
        else {
          customMsg = 'We are processing your order. Please check back later.';
        }
      }


      //If order is completed, load the driver review sheet
      if (!!orderData.completed && orderData.completed.length > 0) {
        isDone = true;

        if (orderData.completed === 'done') {
          customMsg = 'Thank you for ordering with us, hope to see you soon :)';
          newStatus = 'done';
        }
        else if (orderData.completed === 'redeliver') {
          customMsg = 'Your order will be out again tomorrow, see you soon :)';
          newStatus = 'redeliver';
        }
        else if (orderData.completed === 'cancel') {
          customMsg = 'Sorry your order has been cancelled. Hope to see you soon :)';
          newStatus = 'cancel';
        }

        this.loadSheet(orderData.driver.toLowerCase());
      }
      this.setState({ isDone, orderData, customMsg, newStatus })
    } else {
      //If they refresh the page (not coming from home)
      this.findOrderEta();
    }
  }

  loadSheet = async (title) => {

    const doc = new GoogleSpreadsheet(process.env.REACT_APP_SPREADSHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: process.env.REACT_APP_CLIENT_EMAIL,
      private_key: process.env.REACT_APP_PRIVATE_KEY,
    });

    await doc.loadInfo(); // loads document properties and worksheets

    const driverSheet = doc.sheetsByTitle[title];
    const routeInfoSheet = doc.sheetsByTitle["routeInfo"];


    this.setState({ driverSheet, routeInfoSheet }, () => {

      //Check if customer already submitted review, if they did push them to different page
      database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/${title}`).once("value")
        .then((snapshot) => {

          const reviews = snapshot.val();

          if (reviews !== null) {
            for (let i = 0; i < reviews.length; ++i) {
              if (reviews[i].orderNumber === parseInt(this.props.match.params.orderNum)) {
                this.props.history.push("/thanks");
              }
            }
          }
          
        })
    });

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
          const orderNum = parseInt(this.props.match.params.orderNum);

          for (let i = 0; i < orders.length; ++i) {

            if (orders[i].orderNumber === orderNum) {

              returnObj.found = true;
              returnObj.orderData = orders[i];

              const firstName = orders[i].fullName.substring(0, orders[i].fullName.indexOf(" "));
              returnObj.orderData.fullName = firstName;

              // if (orders[i].eta.length === 0) {

              //   returnObj.orderData.eta = "Your driver has not started their route yet. Please check again after you receive a confirmation text from your driver."

              // }
            }
          }
          resolve(returnObj);
        })
    })
  }
  //Only runs when client enters website manually
  //Checks if order is done, if not it will check in allOrders
  findOrderEta = () => {

    //Error handling
    if (isNaN(parseInt(this.props.match.params.orderNum))) {
      this.setState({ errMsg: "Invalid Order Number, go back to the homepage and try again." })
    } else {

      //Object to hold orders found in all, east, or west
      let orderObj;
      let customMsg = "";
      let newStatus = "";

      //Check if order is done, if not check in allOrders and then the route if it is set
      database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/completed`).once("value")
        .then((snapshot) => {
          const completedOrders = snapshot.val();
          let orderData = {};

          if (!!completedOrders[this.props.match.params.orderNum]) {
            orderData = {
              completed: completedOrders[this.props.match.params.orderNum].status,
              ...completedOrders[this.props.match.params.orderNum]
            }

            orderData.fullName = orderData.fullName.substring(0, orderData.fullName.indexOf(" "));

            //Custom messages to customer for order completion
            if (orderData.completed === 'done') {
              customMsg = 'Thank you for ordering with us, hope to see you soon :)';
              newStatus = 'done';
            }
            else if (orderData.completed === 'redeliver') {
              customMsg = 'Your order will be out again tomorrow, see you soon :)';
              newStatus = 'redeliver';
            }
            else if (orderData.completed === 'cancel') {
              customMsg = 'Sorry your order has been cancelled. Hope to see you soon :)';
              newStatus = 'cancel';
            }

            this.loadSheet(orderData.driver.toLowerCase())
              .then(() => {
                this.setState({ orderData, isDone: true, customMsg, newStatus });
              })



          } else {
            //Check if order is in allOrders
            database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/allOrders`).once("value")
              .then((snapshot) => {

                const orders = snapshot.val();

                //Check if orders is in the list for all of today's orders
                if (!orders[this.props.match.params.orderNum]) {
                  //Order does not exist
                  this.setState({ errMsg: "Sorry something went wrong. Please contact check your order# or contact our office!" });

                } else {
                  //orderObj = allOrders object
                  orderObj = orders[this.props.match.params.orderNum];
                  let isDone = false;

                  //Convert full name to just first name
                  orderObj.fullName = orderObj.fullName.substring(0, orderObj.fullName.indexOf(" "));

                 
                  //Custom messages based on status of orders in allOrders
                  //Check if order is shipping
                  if (orderObj.isShipping) {
                    if (orderObj.status === 'Processed') {
                      customMsg = 'Your order is processed and will be fulfilled by Canada Post';
                    }
                    else if (orderObj.status === 'Awaiting ID') {
                      customMsg = 'Please refer to your invoice for further instructions';
                    }
                    else if (orderObj.status === 'Awaiting EMT') {
                      customMsg = `Don't forget to send in your EMT for $${orderObj.orderTotal} before 3:30PM to ensure Canada Post receives your order`;
                    }
                    else if (orderObj.status === 'Check back later') {
                      customMsg = 'Our shipping cut-off is now 3:30PM.\nPlease check back around 1PM for the status of your order';
                    }
                  } else {
                    if (orderObj.status === 'Processed') {
                      //Map is divided, ETA is available
                      if (!!orderObj.eta && orderObj.eta.length > 0) {
                        customMsg = `Don't forget to rate your driver after you've received your order!`;
                      }
                      //Map is divided, but drivers have not started route
                      else if (!!orderObj.eta) {
                        customMsg = 'Your driver is picking up your order. Please check back shortly!';
                      }
                      else {
                        customMsg = 'Your order is processed.\nPlease check back around 4:30PM for an ETA.';
                      }
                    }
                    else if (orderObj.status === 'Awaiting ID') {
                      customMsg = 'Please refer to your invoice for further instructions';
                    }
                    else if (orderObj.status === 'Awaiting EMT') {
                      customMsg = `Don't forget to send in your EMT for $${orderObj.orderTotal} before 3:30PM to ensure you receive your order today`;
                    }
                    else if (orderObj.status === 'Check back later') {
                      customMsg = 'Our delivery cut-off is now 3:30PM.\nPlease check back around 1PM for the status of your order';
                    }
                    else {
                      customMsg = 'We are processing your order. Please check back later.';
                    }
                  }


                  //Check if the order is in the region specified in route
                  //If it isn't set state variable to the order version found in allOrders (no eta)
                  if (this.props.match.params.region === "e") {

                    this.findOrder("east")
                      .then((order) => {

                        if (order.found) {
                          //Order is complete
                          if (order.orderData.completed.length > 0) {
                            isDone = true;

                            //Custom messages to customer for order completion
                            if (order.orderData.completed === 'done') {
                              customMsg = 'Thank you for ordering with us, hope to see you soon :)';
                              newStatus = 'done';
                            }
                            else if (order.orderData.completed === 'redeliver') {
                              customMsg = 'Your order will be out again tomorrow, see you soon :)';
                              newStatus = 'redeliver';
                            }
                            else if (order.orderData.completed === 'cancel') {
                              customMsg = 'Sorry your order has been cancelled. Hope to see you soon :)';
                              newStatus = 'cancel';
                            }

                            this.loadSheet(order.orderData.driver.toLowerCase());
                          }

                          orderObj = order.orderData;
                        }

                        this.setState({ orderData: orderObj, isDone, customMsg, newStatus });

                      }).catch(err => console.log(err))

                  } else if (this.props.match.params.region === "w") {

                    this.findOrder("west")
                      .then((order) => {

                        if (order.found) {

                          if (order.orderData.completed.length > 0) {
                            isDone = true;

                            //Custom messages to customer for order completion
                            if (order.orderData.completed === 'done') {
                              customMsg = 'Thank you for ordering with us, hope to see you soon :)';
                              newStatus = 'done';
                            }
                            else if (order.orderData.completed === 'redeliver') {
                              customMsg = 'Your order will be out again tomorrow, see you soon :)';
                              newStatus = 'redeliver';
                            }
                            else if (order.orderData.completed === 'cancel') {
                              customMsg = 'Sorry your order has been cancelled. Hope to see you soon :)';
                              newStatus = 'cancel';
                            }

                            this.loadSheet(order.orderData.driver.toLowerCase());
                          }

                          orderObj = order.orderData;
                        }

                        //Map is divided, ETA is available
                        if (order.orderData.eta.length > 0) {
                          customMsg = `Don't forget to rate your driver after you've received your order!`;
                        }
                        //Map is divided, but drivers have not started route
                        else {
                          customMsg = 'Your driver is picking up your order. Please check back shortly!';
                        }

                        this.setState({ orderData: orderObj, isDone, customMsg, newStatus });

                      }).catch(err => console.log(err))

                    //If "a", search in both
                    //This is in case a customer checks before routes are added and just refreshes the page
                  } else if (this.props.match.params.region === "a") {
                    
                    this.findOrder("east")
                      .then((order) => {

                        if (order.found) {

                          if (order.orderData.completed === "done") {
                            isDone = true;
                            this.loadSheet(order.orderData.driver.toLowerCase());
                          }

                          orderObj = order.orderData;
                          this.setState({ orderData: orderObj, isDone, customMsg, newStatus });
                        } else {

                          this.findOrder("west")
                            .then((order) => {

                              if (order.found) {

                                if (order.orderData.completed === "done") {
                                  isDone = true;
                                  this.loadSheet(order.orderData.driver.toLowerCase());
                                }

                                orderObj = order.orderData;
                              }

                              this.setState({ orderData: orderObj, isDone, customMsg, newStatus });

                            }).catch(err => console.log(err))
                        }

                      }).catch(err => console.log(err))

                  } else {
                    this.setState({ errMsg: "Something went wrong, go back to the homepage and search again." });
                  }

                }
              })
          }

        })
    }
  }

  changeRating = (e) => {
    const rating = e.target.value;
    this.setState({ rating, ratingChanged: true });
  }

  onCommentChange = (e) => {
    const comment = e.target.value;
    this.setState({ comment });
  }

  updateFeedbackInSheet = async (feedback) => {
    const rows = await this.state.driverSheet.getRows();
    feedback.id = rows.length;
    await this.state.driverSheet.addRows([feedback]);
  }

  submitFeedback = () => {

    const newRowData = {
      day: dayjs().format("DD/MM/YYYY"),
      orderNumber: this.state.orderData.orderNumber,
      rating: this.state.rating,
      comment: (this.state.comment.length === 0 ? "No comment" : this.state.comment)
    };

    this.updateFeedbackInSheet(newRowData)
      .then(() => {
        this.props.history.push("/thanks")
      })
  }

  render() {

    return (
      <OrderInfoBox
        name={this.state.orderData.fullName}
        status={this.state.orderData.status}
        err={this.state.errMsg}
        eta={this.state.orderData.eta}
        done={this.state.isDone}
        prevdef={(e) => e.preventDefault()}
        rating={this.state.rating}
        ratingbool={this.state.ratingChanged}
        ratingchg={this.changeRating}
        comment={this.state.comment}
        commentchg={this.onCommentChange}
        submit={this.submitFeedback}
        pushhome={() => { this.props.history.push("/") }}
        msg={this.state.customMsg}
        newstatus={this.state.newStatus}
      />
    )

  }
}

export default withRouter(OrderInfo);
