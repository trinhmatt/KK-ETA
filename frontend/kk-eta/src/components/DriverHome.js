import React, { useState } from "react";
/*global google*/
import { withRouter } from "react-router";
import { firebase } from "../firebase/firebase";
import database from "../firebase/firebase";
import { GoogleSpreadsheet } from "google-spreadsheet";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";

import CustomerBlock from "./CustomerBlock";
import '../index.css';

//style imports
import cx from 'clsx';
import { Row, Item } from '@mui-treasury/components/flex';
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import { AddCircle, RemoveCircle, DirectionsCar, ExitToApp, Room, Mail, Phone } from '@material-ui/icons';
import { CardContent, CardMedia, CardActionArea, Box, Backdrop, Button, CardActions, Accordion, AccordionSummary, AccordionDetails, Typography, Modal } from '@material-ui/core';
import { useLightTopShadowStyles } from '@mui-treasury/styles/shadow/lightTop';
import { useCoverCardMediaStyles } from '@mui-treasury/styles/cardMedia/cover';
import Loader from 'react-loader-spinner';
import { useStyles } from '../styles';

//CUSTOMS HOOKS FOR MATERIAL UI
function Alert(props) {
  return <MuiAlert elevation={6} varient="filled" {...props} />;
}

const LoadingThing = props => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress &&
    <div id='centerstyle'>
      <Loader type='Hearts' color='#ff96d7' height={100} width={100} />
    </div>
  );
}

function BufferBox({ buffertime, addfn, subfn }) {
  const classes = useStyles();
  const shadowStyles = useLightTopShadowStyles();
  const mediaStyles = useCoverCardMediaStyles();
  return (
    <Card className={cx(classes.bufferbox, shadowStyles.root)}>
      <CardMedia
        classes={mediaStyles}
        image={
          'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c87d20d4-1cbe-42ae-b191-cc629a5b5a73/dboq3yo-39e2d1f9-502e-489f-94ba-3f12cee5ffa1.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvYzg3ZDIwZDQtMWNiZS00MmFlLWIxOTEtY2M2MjlhNWI1YTczXC9kYm9xM3lvLTM5ZTJkMWY5LTUwMmUtNDg5Zi05NGJhLTNmMTJjZWU1ZmZhMS5naWYifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.6geYT7yXH1VcUtvra6vudrOOFmTtYn_Z7jwE6kfNQxQ'
        }
      />
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        minHeight={100}
        color={'common.black'}
        textAlign={'center'}
      >
        <CardActionArea>
          <CardContent className={classes.content}>
            <h4 className={classes.title}>click to add/sub 5mins to buffer</h4>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <form noValidate autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            <IconButton id="addbtn" name="bufferToAdd" variant='contained' onClick={addfn} aria-label="add buffer time">
              <AddCircle />
            </IconButton>
              &nbsp;&nbsp;
              <IconButton id="subbtn" name="bufferToSubtract" variant='contained' onClick={subfn} aria-label="subtract buffer time">
              <RemoveCircle name="bufferToSubtract" />
            </IconButton>
          </form>
        </CardActions>
        <CardActionArea>
          <CardContent className={classes.content}>
            <h4 className={classes.title}>current buffer time: <b>{buffertime}mins</b></h4>
          </CardContent>
        </CardActionArea>

      </Box>

    </Card>
  )
}

function CustomerListCard({ orders, getRouteTime }) {
  const classes = useStyles();
  const shadowStyles = useLightTopShadowStyles();
  const mediaStyles = useCoverCardMediaStyles();

  //For modal
  const [open, setOpen] = useState(false);
  const [curr, setOrder] = useState('');

  const handleOpen = (e) => {
    setOrder(e.currentTarget.value);
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }

  //Convert SMS and address string for android phones
  let SMSString = "&";
  const userEnv = navigator.userAgent.toLowerCase();
  let arr = [];
  let geoString = '';



  if (!!orders) {
    for (let i = 0; i < orders.length; ++i) {
      geoString = orders[i].geoString;
      if (userEnv.indexOf("android") > -1) {
        SMSString = "?";
      } else {
        //Current geostring is for android, if apple change it
        geoString = `maps://maps.google.com/maps?daddr=${orders[i].lat},${orders[i].lng}&amp;ll=`
      }


      //Only show first name
      const firstName = orders[i].fullName.substring(0, orders[i].fullName.indexOf(" "));

      //Text messages for drivers
      const msg_10 = encodeURI(`Hey I'm 10 minutes away. See you soon!`);
      const msg_5 = encodeURI(`Hey I'm 5 minutes away. See you soon!`);
      const msg_15 = encodeURI(`Hey I'm 15 minutes away. See you soon!`);
      const msg_next = encodeURI(`Hello again! You're the next customer on my route. Please be ready to receive your order. I will text you once again when I am nearby!`);
      const msg_here = encodeURI(`Hi I'm here. Please come out to meet me!`);
      const msg_safedrop = encodeURI(`Your order has been safe dropped! Have a great night.`);
      const msg_conf = encodeURI(`Hi ${firstName}, this is your driver from KK. Please confirm your address is correct: ${orders[i].address}. I am on my way and will text you when you are my next order!`);

      arr.push(
        <div key={orders[i].orderNumber}>
          <Accordion style={{ backgroundColor: 'transparent' }}>
            <AccordionSummary>
              <Typography>
                <b>{i + 1}. {orders[i].orderNumber}</b>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Card>
                <CardActions>
                  <CardContent>
                    <Row alignItems={'center'}>
                      <Item position={'center'}>
                        <Button size='small' variant='contained' color='primary' target="_blank" href={geoString}>
                          <Room /> {orders[i].address}
                        </Button>
                      </Item>
                    </Row>
                    <Row mt={2} alignItems={'center'}>
                      <Item position={'center'}>
                        <Button size='small' startIcon={<Mail />} variant='contained' color='secondary' href={`sms://${orders[i].number}${SMSString}body=${msg_next}`}>next order</Button>
                      </Item>
            &nbsp;
            <Item position={'center'}>
                        <Button size='small' startIcon={<Mail />} variant='contained' color='secondary' href={`sms://${orders[i].number}${SMSString}body=${msg_here}`}>i'm here</Button>
                      </Item>
                    </Row>
                    <Row mt={2} alignItems={'center'}>
                      <Item position={'center'}>
                        <Button size='small' startIcon={<Mail />} variant='contained' color='secondary' href={`sms://${orders[i].number}${SMSString}body=${msg_5}`}>5min</Button>
                      </Item>
            &nbsp;
            <Item position={'center'}>
                        <Button size='small' startIcon={<Mail />} variant='contained' color='secondary' href={`sms://${orders[i].number}${SMSString}body=${msg_10}`}>10min</Button>
                      </Item>
            &nbsp;
            <Item position={'center'}>
                        <Button size='small' startIcon={<Mail />} variant='contained' color='secondary' href={`sms://${orders[i].number}${SMSString}body=${msg_15}`}>15min</Button>
                      </Item>
                    </Row>
                    <Row mt={2} alignItems={'center'}>
                      <Item position={'center'}>
                        <Button size='small' startIcon={<Mail />} variant='contained' color='secondary' href={`sms://${orders[i].number}${SMSString}body=${msg_safedrop}`}>safedrop</Button>
                      </Item>
                      <Item position={'center'}>
                        <Button id='temp' size='small' startIcon={<Mail />} variant='contained' href={`sms://${orders[i].number}${SMSString}body=${msg_conf}`}>confirm</Button>
                      </Item>
                    </Row>
                    <Row mt={2} alignItems={'center'}>
                      <Item position={'center'}>
                        <Button startIcon={<Phone />} variant='contained' color='secondary' href={`tel:${orders[i].number}`}>{orders[i].number}</Button>
                      </Item>
                    </Row>
                    <Row mt={2} alignItems={'center'}>
                      <Item position={'center'}>
                        <Button id="rrbtn" variant='contained' onClick={handleOpen} value={orders[i].address}>RE-ROUTE</Button>
                      </Item>
                    </Row>
                  </CardContent>
                </CardActions>
              </Card>

            </AccordionDetails>
          </Accordion>
        </div>
      )
    }
  }
  return (
    <Card className={cx(classes.clist, shadowStyles.root)}>
      <CardMedia
        classes={mediaStyles}
        image={
          'https://i.pinimg.com/originals/1e/ee/7a/1eee7a1096988d8dfa73c6212bd763cb.gif'
        }
      />
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        minHeight={160}
        color={'common.black'}
        textAlign={'center'}
      >
        <CardActionArea>
          <CardContent className={classes.content}>

            <h1 className={classes.title}>customer list</h1>


          </CardContent>
        </CardActionArea>
        <CardActions>
          <CardContent>
            {
              (!!orders) ?
              <div>
                  <CardActions>
                    <Modal
                      open={open}
                      onClose={handleClose}
                    >
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <Card className={cx(classes.popup, shadowStyles.root)}>
                          <CardMedia
                            classes={mediaStyles}
                            image={
                              'https://i.pinimg.com/originals/ac/1c/b3/ac1cb3d2baa33b1bbba1e409fbfb70b1.gif'
                            }
                          />
                          <CardActionArea>
                            <CardContent>
                              <Row mt={10} alignItems={'center'}>
                                <Typography className={classes.h5}>
                                  are u sure u want to <b>re-route</b>
                                </Typography>
                              </Row>
                              <Row mt={1} alignItems={'center'}>
                                <Item position={'center'}>
                                  <Button id='canbtn' size='small' variant='contained' onClick={handleClose}>no</Button>
                                </Item>
                                <Item position={'center'}>
                                  <Button color='secondary' size='small' variant='contained' onClick={(e) => { getRouteTime(e, curr, handleClose) }}>RE-ROUTE</Button>
                                </Item>
                              </Row>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </div>
                    </Modal>
                  </CardActions>
                {arr}
              </div>
                
                :
                ''
            }
          </CardContent>
        </CardActions>

      </Box>
    </Card>
  )
}

//COMPONENT DEFINITION
class DriverHome extends React.Component {
  constructor(props) {
    super(props);
    this.map = React.createRef();
    this.state = {
      errorState: false,
      errorMsg: "",
      allCustomerCards: [],
      orderedCustObjs: [],
      mainOrderObj: {},
      extraOrderObj: {},
      orderList: [],
      startTime: "",
      lastDest: "",
      defaultDest: "290 Bremner Blvd, Toronto, ON M5V 3L9",
      currentBuffer: 0,
      orderToShow: 0,
      startDisplay: "none",
      routeStarted: false,
      loading: false,
      modalOpen: false,
      disableGetRoute: true,
      dir: "LOADING...",
      routeCompleted: false,
      routeTime: ""
    };
  }
  //Load the spreadsheet based on the delivery region 
  loadSheet = async (dir) => {

    const doc = new GoogleSpreadsheet(process.env.REACT_APP_SPREADSHEET_ID);

    const privateKey = process.env.REACT_APP_PRIVATE_KEY.replace(/\\n/g, '\n');

    await doc.useServiceAccountAuth({
      client_email: process.env.REACT_APP_CLIENT_EMAIL,
      private_key: privateKey,
    });

    await doc.loadInfo(); // loads document properties and worksheets

    const orderSheet = doc.sheetsByTitle[dir];
    const extraOrderSheet = doc.sheetsByTitle[dir + '2'];
    const routeInfoSheet = doc.sheetsByTitle["routeInfo"];
    const completedSheet = doc.sheetsByTitle["completed"];

    this.setState({ orderSheet, extraOrderSheet, routeInfoSheet, completedSheet });

  }
  componentDidMount() {
    //Check if user is logged in or not
    //Data will not render if not
    const infowindow = new google.maps.InfoWindow(
      {
        size: new google.maps.Size(150, 50)
      });

    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({ errorMsg: "You are not logged in!", errorState: true })
      } else {

        let dir;

        if (user.email.indexOf("east") > -1) {
          dir = "east";
        } else if (user.email.indexOf("west") > -1) {
          dir = "west";
        } else if (user.email.indexOf("backup") > -1) {
          dir = "backup";
        } else {
          dir = "test";
        }

        this.loadSheet(dir)
          .then(() => {

            //Initialize address autocomplete
            this.initAutocomplete();

            //Once the sheets load, allow the user to fetch routes
            this.setState({ disableGetRoute: false }, () => {
              database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/routeInfo/${dir}`).once("value")
                .then((snapshot) => {

                  const routeData = snapshot.val();
                  let mainOrderObj = {};
                  let extraOrderObj = {};

                  //If route is started and list is in db, generate orderlist 

                  if (routeData.routeOrder && routeData.routeStarted) {
                    for (let i = 0; i < routeData.routeOrder.length; i++) {

                      if (routeData.routeOrder[i].sheet === "main") {
                        mainOrderObj[routeData.routeOrder[i].orderNumber] = true;
                      } else {
                        extraOrderObj[routeData.routeOrder[i].orderNumber] = true;
                      }

                    }
                  }

                  this.setState({
                    dir,
                    buffer: routeData.buffer,
                    currentBuffer: routeData.buffer,
                    orderToShow: routeData.currentOrder,
                    routeStarted: routeData.routeStarted,
                    orderedCustObjs: routeData.routeOrder,
                    routeTime: routeData.routeTime,
                    lastDest: routeData.lastDest ? routeData.lastDest : "",
                    mainOrderObj,
                    extraOrderObj,
                    infowindow
                  }, () => {

                    //If the route is already started, generate customer cards
                    if (this.state.routeStarted) {
                      this.startRoute();
                      this.generateMap();
                    }

                  })

                })
            })
          })
          .catch(error => console.log(error));

      }
    })
  }

  initAutocomplete() {
    var input = document.getElementById('autocomplete');
    var options = {
      types: ['geocode'],
      componentRestrictions: { country: 'ca' }
    };
    this.autocomplete = new google.maps.places.Autocomplete(input, options);
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);

  }

  handlePlaceSelect = () => {
    const addressObj = this.autocomplete.getPlace();
    const address = addressObj.address_components;
    if (address) {
      this.setState({ lastDest: addressObj.formatted_address });
    }
  }

  componentWillUnmount() {
    database.ref().off();
  }

  signOut = () => {
    firebase.auth().signOut()
      .then(() => this.props.history.push("/login"))
  }

  onTextChange = (e) => {
    const val = e.target.value;

    this.setState({ [e.target.name]: val, errMsg: "" });
  }

  createMapMarker = (map, latlng, label, html, title) => {

    const contentString = '<b>' + label + '</b><br/>' + html;
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: String.fromCharCode(title),
      label: String.fromCharCode(title),
      zIndex: 2
    });
    marker.myname = label;

    marker.addListener("click", () => {
      this.state.infowindow.setContent(contentString);
      this.state.infowindow.open(map, marker);
    })
  }

  //Generate route using spreadsheet data 
  getRouteTime = (e, origin = "5941 Leslie St, Toronto, ON M2H 1J8", handleClose) => {
    this.setState({ loading: true }, () => {

      let mainOrderObj = {};
      let extraOrderObj = {};

      //Request body for request to Google Maps API
      const reqBody = {
        origin,
        destination: (this.state.lastDest.length > 0 ? this.state.lastDest : this.state.defaultDest),
        waypoints: [],
        optimizeWaypoints: true,
        avoidTolls: true,
        travelMode: "DRIVING",
        drivingOptions: {
          departureTime: new Date(Date.now()),  // for the time N milliseconds from now.
          trafficModel: 'bestguess'
        }
      }

      //Only used if there are more than 22 orders in sheet 1 
      const reqBody2 = {
        origin,
        destination: (this.state.lastDest.length > 0 ? this.state.lastDest : this.state.defaultDest),
        waypoints: [],
        optimizeWaypoints: true,
        avoidTolls: true,
        travelMode: "DRIVING",
        drivingOptions: {
          departureTime: new Date(Date.now()),  // for the time N milliseconds from now.
          trafficModel: 'bestguess'
        }
      }

      //Fetch realtime data from database based on dir (east or west)
      trackPromise(database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/${this.state.dir}`).once("value")
        .then((snapshot) => {

          //Customers from main spreadsheet
          const allCustomers = snapshot.val();

          //Fetch data from second sheet
          database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/${this.state.dir}2`).once("value")
            .then((snapshot2) => {


              //Customer list fetched from second database
              let lastCustomers = snapshot2.val();
              let lastLengthIsOne = false;

              let processedList = [];

              //If there is only one extra order add it to the first array 
              //Need this because I set the destination of the first route to the first address in the extra array 
              //*FIRST ARRAY CAN ONLY HAVE 22 ADDRESSES MAX 
              if (lastCustomers !== null && lastCustomers.length === 1) {
                allCustomers.push(lastCustomers[0]);
                lastLengthIsOne = true;
              }


              //Parse addresses from main spreadsheet 
              for (let i = 0; i < allCustomers.length; ++i) {

                if (lastLengthIsOne && i === allCustomers.length - 1) {
                  extraOrderObj[allCustomers[i].orderNumber.toString()] = true;
                  allCustomers[i].sheet = "extra";
                } else {
                  mainOrderObj[allCustomers[i].orderNumber.toString()] = true;
                  allCustomers[i].sheet = "main";
                }

                //Check for empty object
                if (allCustomers[i].address.length > 0 && allCustomers[i].status === "Processed") {

                 allCustomers[i].address = this.parseAddress(allCustomers[i].address);

                  //Waypoint for google maps request body
                  const waypointObj = {
                    location: allCustomers[i].address,
                    stopover: true
                  }

                  reqBody.waypoints.push(waypointObj);

                  //Push customer object with parsed address into processed list 
                  processedList.push(allCustomers[i]);

                }
              }

              //If there are orders in the extra spreadsheet, parse those and add to processed list
              if (lastCustomers !== null && lastCustomers.length > 1) {

                let firstIndexOfProcessed;

                //Need this to track the first extra order in case of re-route 
                //Since I filter the list I need the actual order to find the index in the full order list
                let firstExtraOrder;

                //Add the customer addresses to the API request body
                for (let i = 0; i < lastCustomers.length; ++i) {

                  extraOrderObj[lastCustomers[i].orderNumber.toString()] = true;
                  lastCustomers[i].sheet = "extra";

                  //Check for empty object
                  if (lastCustomers[i].address.length > 0 && lastCustomers[i].status === "Processed") {

                    //Parse address to format it for API 
                    lastCustomers[i].address = this.parseAddress(lastCustomers[i].address);

                    //Google maps waypoint object
                    const waypointObj = {
                      location: lastCustomers[i].address,
                      stopover: true
                    }

                    //If it is the first order in the backup, set the destination of the first route
                    //To the origin of the second route 
                    //Push the address into the processed list and then save the index for use later 
                    if (i === 0) {

                      reqBody.destination = waypointObj.location;
                      reqBody2.origin = waypointObj.location;
                      processedList.push(lastCustomers[i]);
                      firstIndexOfProcessed = processedList.indexOf(lastCustomers[i]);
                      firstExtraOrder = lastCustomers[i];

                    } else {
                      reqBody2.waypoints.push(waypointObj);
                      processedList.push(lastCustomers[i]);
                    }
                  }
                }

                //Needed for reroute 
                //If origin is not default, filter out the waypoint from the list 
                if (origin !== this.state.defaultDest) {
                  reqBody.waypoints = reqBody.waypoints.filter((waypoint) => {
                    return waypoint.location !== origin;
                  })
                  reqBody2.waypoints = reqBody2.waypoints.filter((waypoint) => {
                    return waypoint.location !== origin;
                  })
                }


                //If there are more than 22 orders in the main sheet,
                //we have to generate 2 different routes and stich them together 
                //google maps only allows 25 different locations per route 
                const directionsService = new google.maps.DirectionsService();

                const center = new google.maps.LatLng(43.7984647, -87.6500523);
                const mapOptions = {
                  zoom: 7,
                  center: center,
                  supressMarkers: true,
                  preserveViewport: true
                }
                var map = new google.maps.Map(this.map.current, mapOptions);

                let orderedCustObjs = [];
                let totalDuration = 0;

                //If re-routing using order, push the order into the ordered list and filter the processedList
                //Need it out so that the route information can be accurate since 
                  //Route info contains waypoint orders which is the same order in processedList
                if (origin !== this.state.defaultDest) {

                  for (let i = 0; i < processedList.length; i++) {
                    if (processedList[i].address === origin) {
                      orderedCustObjs.push(processedList[i]);
                    }
                  }

                  processedList = processedList.filter( order => order.address !== origin);
                  firstIndexOfProcessed = processedList.indexOf(firstExtraOrder);
                }
                

                //generate route for main sheet
                directionsService.route(reqBody, (result, status) => {

                  //To track which letter the first route ended on so the second route can be labelled correctly
                  let endMarker;

                  if (status === "OK") {

                    for (let n = 0; n < result.routes[0].waypoint_order.length; ++n) {

                      totalDuration += result.routes[0].legs[n].duration.value

                      //Save latitude, longitude, and formatted address string for android or iOS address links
                      const geoString = `geo:${result.routes[0].legs[n].end_location.lat()},${result.routes[0].legs[n].end_location.lng()}`;
                      processedList[result.routes[0].waypoint_order[n]].lat = result.routes[0].legs[n].end_location.lat();
                      processedList[result.routes[0].waypoint_order[n]].lng = result.routes[0].legs[n].end_location.lng();
                      processedList[result.routes[0].waypoint_order[n]].geoString = geoString;
                      processedList[result.routes[0].waypoint_order[n]].formattedTime = result.routes[0].legs[n].duration.value;

                      processedList[result.routes[0].waypoint_order[n]].formattedTime = result.routes[0].legs[n].duration.value;
                      orderedCustObjs.push(processedList[result.routes[0].waypoint_order[n]]);
                    }

                    for (var i = 0; i < result.routes[0].legs.length; i++) {
                      let orderNumStr;

                      if (origin !== this.state.defaultDest) {
                        orderNumStr = orderedCustObjs[i].orderNumber.toString();
                      } else if (orderedCustObjs[i - 1]) {
                        orderNumStr = orderedCustObjs[i - 1].orderNumber.toString();
                      }

                      const infoBoxContent = `${result.routes[0].legs[i].start_address}<br>`;
                      let markerLetter = "A".charCodeAt(0);
                      markerLetter += i;
                      console.log(String.fromCharCode(markerLetter), ": ", orderNumStr);
                      this.createMapMarker(map, result.routes[0].legs[i].start_location, orderNumStr, infoBoxContent, markerLetter);
                    }

                    const infoBoxContent = result.routes[0].legs[i - 1].end_address;
                    let markerLetter = "A".charCodeAt(0);
                    markerLetter += i;
                    const title = processedList[firstIndexOfProcessed].orderNumber.toString();
                    this.createMapMarker(map, result.routes[0].legs[i - 1].end_location, title, infoBoxContent, markerLetter);
                    endMarker = i;


                    //Need this block because the destination in the first request is the first order in the second array 
                    //The destination of a request is not contained inside the waypoint_order array in the response 
                    //So it has to be manually added into the order list 

                    processedList[firstIndexOfProcessed].formattedTime = result.routes[0].legs[result.routes[0].waypoint_order.length].duration.value;
                    orderedCustObjs.push(processedList[firstIndexOfProcessed]);

                    const directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });

                    directionsRenderer.setMap(map);
                    directionsRenderer.setDirections(result);

                    //generate route for second sheet
                    directionsService.route(reqBody2, (result, status) => {

                      if (status === "OK") {

                        //The point in the full array where the second route starts
                        //Needed for correct orderNumber in map markers
                        let secondStart = allCustomers.length;

                        //Remove first element which was used as destination for first route
                        lastCustomers = lastCustomers.slice(1);

                        for (let n = 0; n < result.routes[0].waypoint_order.length; ++n) {

                          totalDuration += result.routes[0].legs[n].duration.value

                          lastCustomers[result.routes[0].waypoint_order[n]].formattedTime = result.routes[0].legs[n].duration.value;
                          orderedCustObjs.push(lastCustomers[result.routes[0].waypoint_order[n]]);
                        }

                        //Create custom marker for waypoints
                        //i = 1 because the order[0] in second route = destination of first route
                        for (var i = 1; i < result.routes[0].legs.length; i++) {
                          const orderNumStr = orderedCustObjs[secondStart + i] ? orderedCustObjs[secondStart + i].orderNumber.toString() : "";
                          const infoBoxContent = `${result.routes[0].legs[i].start_address}<br>`;
                          let markerLetter = "A".charCodeAt(0);
                          endMarker++;
                          markerLetter += endMarker;
                          console.log(String.fromCharCode(markerLetter), ": ", orderNumStr);
                          this.createMapMarker(map, result.routes[0].legs[i].start_location, orderNumStr, infoBoxContent, markerLetter);
                        }

                        //Create marker for final destination
                        const infoBoxContent = this.state.lastDest;
                        let markerLetter = "A".charCodeAt(0);
                        endMarker++;
                        markerLetter += endMarker;
                        const title = "END";
                        this.createMapMarker(map, result.routes[0].legs[i - 1].end_location, title, infoBoxContent, markerLetter);

                        const routeTime = dayjs().add(totalDuration, "seconds").format("h:mm A");

                        //update route time in the database
                        database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/routeInfo/${this.state.dir}`).update({ routeTime, lastDest: this.state.lastDest })
                          .then(() => {

                            //set the map with both routes stiched together
                            const directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });

                            directionsRenderer.setOptions({
                              polylineOptions: {
                                strokeColor: 'red'
                              }
                            });

                            directionsRenderer.setMap(map);
                            directionsRenderer.setDirections(result);

                            this.setState({
                              orderedCustObjs,
                              loading: false,
                              startDisplay: "block",
                              mainOrderObj,
                              extraOrderObj,
                              routeTime
                            }, () => {
                              if (handleClose) {
                                handleClose();
                              }
                            });
                          })
                      } else {
                        console.log(status);
                      }
                    })
                  } else {
                    console.log(status);
                  }
                })
              } else {

                let orderedCustObjs = [];
                let totalDuration = 0;

                //If no extra orders, generate a single route
                const directionsService = new google.maps.DirectionsService();
                const directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });
                const center = new google.maps.LatLng(43.7984647, -87.6500523);
                const mapOptions = {
                  zoom: 7,
                  center: center,
                  supressMarkers: true,
                  preserveViewport: true
                }

                //Needed for reroute 
                //If origin is not default, filter out the waypoint from the list and grab first ETA
                if (origin !== "5941 Leslie St, Toronto, ON M2H 1J8") {

                  reqBody.waypoints = reqBody.waypoints.filter((waypoint) => {
                    return waypoint.location !== origin;
                  })

                  let firstOrder;

                  for (let i = 0; i < processedList.length; i++) {
                    if (processedList[i].address === origin) {  
                      firstOrder = processedList[i];
                    }
                  }

                  this.reRouteFirstETA(directionsService, firstOrder)
                  .then( (order) => {
                    orderedCustObjs.push(order)
                  })
                  .catch( err => console.log(err));

                  processedList = processedList.filter( order => order.address !== origin);
                }

                

                let map = new google.maps.Map(this.map.current, mapOptions);
                directionsRenderer.setMap(map);

                directionsService.route(reqBody, (result, status) => {
                  if (status === "OK") {

                    for (let i = 0; i < result.routes[0].waypoint_order.length; ++i) {

                      totalDuration += result.routes[0].legs[i].duration.value;

                      if (i === result.routes[0].waypoint_order.length - 1) {
                        totalDuration += result.routes[0].legs[result.routes[0].waypoint_order.length].duration.value;
                      }

                      //Save latitude, longitude, and formatted address string for android or iOS address links
                      const geoString = `geo:${result.routes[0].legs[i].end_location.lat()},${result.routes[0].legs[i].end_location.lng()}`;
                      processedList[result.routes[0].waypoint_order[i]].lat = result.routes[0].legs[i].end_location.lat();
                      processedList[result.routes[0].waypoint_order[i]].lng = result.routes[0].legs[i].end_location.lng();
                      processedList[result.routes[0].waypoint_order[i]].geoString = geoString;
                      processedList[result.routes[0].waypoint_order[i]].formattedTime = result.routes[0].legs[i].duration.value;

                      //Save the ordered objects 
                      orderedCustObjs.push(processedList[result.routes[0].waypoint_order[i]]);

                    }

                    for (var i = 0; i < result.routes[0].legs.length; i++) {

                      let orderNumStr;

                      if (origin !== this.state.defaultDest) {
                        orderNumStr = orderedCustObjs[i].orderNumber.toString()
                      } else if (orderedCustObjs[i - 1]) {
                        orderNumStr = orderedCustObjs[i - 1].orderNumber.toString()
                      }

                      const infoBoxContent = `${result.routes[0].legs[i].start_address}<br>`;
                      let markerletter = "A".charCodeAt(0);
                      markerletter += i;
                      this.createMapMarker(map, result.routes[0].legs[i].start_location, orderNumStr, infoBoxContent, markerletter);
                    }

                    const infoBoxContent = this.state.lastDest;
                    let markerLetter = "A".charCodeAt(0);
                    markerLetter += i;
                    const title = "END";
                    this.createMapMarker(map, result.routes[0].legs[i - 1].end_location, title, infoBoxContent, markerLetter);


                    const routeTime = dayjs().add(totalDuration, "seconds").format("h:mm A");

                    database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/routeInfo/${this.state.dir}`).update({ routeTime, lastDest: this.state.lastDest })
                      .then(() => {
                        this.setState({ orderedCustObjs, loading: false, startDisplay: "block", routeTime, mainOrderObj, extraOrderObj }, () => {
                          directionsRenderer.setDirections(result);
                          if (handleClose) {
                            handleClose();
                          }
                        });
                      })

                  } else {
                    console.log(status);
                  }
                })
              }
            })
        })
      )
    })
  }

  reRouteFirstETA = (directionsService, order) => {
    return new Promise( (resolve, reject) => {
      //Need to get ETA for first order
      const reRouteRequest = {
        origin: this.state.defaultDest,
        destination: order.address,
        avoidTolls: true,
        travelMode: "DRIVING",
        drivingOptions: {
          departureTime: new Date(Date.now()),  // for the time N milliseconds from now.
          trafficModel: 'bestguess'
        }
      }

      directionsService.route(reRouteRequest, (result, status) => {
        if (status === "OK") {
          const geoString = `geo:${result.routes[0].legs[0].end_location.lat()},${result.routes[0].legs[0].end_location.lng()}`;
          order.lat = result.routes[0].legs[0].end_location.lat();
          order.lng = result.routes[0].legs[0].end_location.lng();
          order.geoString = geoString;
          order.formattedTime = result.routes[0].legs[0].duration.value;

          resolve(order);

        } else {
          reject("request failed")
        }
        
      })
    })
  }

  parseAddress = (addressStr) => {

    let address = addressStr;

    /*
      To check if ON has a space before and after it, we need to make sure
      the city is not spelled TORONTO
    */
    const indexOfTORONTO = address.indexOf("TORONTO");

    if (indexOfTORONTO > 0) {
      address = address.replace("TORONTO", "Toronto");
      //console.log(allCustomers[i].address);
    }

    //Need to check if there is a space before "ON"
    //The address will be wrong (and so will the route) is there is
    let provIndex = address.indexOf("ON");

    if (address.charAt(provIndex - 1) !== " ") {

      //If it is, add a space before it
      address = address.substring(0, provIndex) +
        " " +
        address.substring(provIndex, address.length);
    }

    //Check if there is a space after "ON"

    //Need to fetch the index again if it was changed above
    provIndex = address.indexOf("ON");

    if (address.charAt(provIndex + 2) !== " ") {

      address = address.substring(0, provIndex + 2) +
        " " +
        address.substring(provIndex + 2, address.length);
    }

    return address;

  }

  generateMap = () => {
    //Request body for request to Google Maps API
    const reqBody = {
      origin: "5941 Leslie St, Toronto, ON M2H 1J8",
      destination: (this.state.lastDest.length > 0 ? this.state.lastDest : this.state.defaultDest),
      waypoints: [],
      optimizeWaypoints: true,
      avoidTolls: true,
      travelMode: "DRIVING",
      drivingOptions: {
        departureTime: new Date(Date.now()),  // for the time N milliseconds from now.
        trafficModel: 'bestguess'
      }
    }

    //Only used if there are more than 22 orders in sheet 1 
    const reqBody2 = {
      origin: "5941 Leslie St, Toronto, ON M2H 1J8",
      destination: (this.state.lastDest.length > 0 ? this.state.lastDest : this.state.defaultDest),
      waypoints: [],
      optimizeWaypoints: true,
      avoidTolls: true,
      travelMode: "DRIVING",
      drivingOptions: {
        departureTime: new Date(Date.now()),  // for the time N milliseconds from now.
        trafficModel: 'bestguess'
      }
    }

    if (this.state.orderedCustObjs.length > 0 && this.state.routeStarted) {

      for (let i = 0; i < this.state.orderedCustObjs.length; i++) {

        if (this.state.orderedCustObjs[i].sheet === "extra" && this.state.orderedCustObjs[i - 1].sheet === "main") {
          reqBody.destination = this.state.orderedCustObjs[i].address;
          reqBody2.origin = this.state.orderedCustObjs[i].address;
        }

        const waypoint = {
          location: this.state.orderedCustObjs[i].address,
          stopover: true
        }

        this.state.orderedCustObjs[i].sheet === "main" ? reqBody.waypoints.push(waypoint) : reqBody2.waypoints.push(waypoint);
      }

      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      const center = new google.maps.LatLng(43.7984647, -87.6500523);
      const mapOptions = {
        zoom: 7,
        center: center,
        supressMarkers: true,
        preserveViewport: true
      }
      var map = new google.maps.Map(this.map.current, mapOptions);
      directionsRenderer.setMap(map);

      directionsService.route(reqBody, (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);

          //If extra orders, render second route 
          if (reqBody2.waypoints.length > 0) {
            directionsService.route(reqBody2, (result, status) => {

              if (status === "OK") {
                //set the map with both routes stiched together
                const directionsRenderer = new google.maps.DirectionsRenderer();

                directionsRenderer.setOptions({
                  polylineOptions: {
                    strokeColor: 'red'
                  }
                });

                directionsRenderer.setMap(map);
                directionsRenderer.setDirections(result);
              } else {
                console.log(status);
              }

            })
          }
        }
      })


    }
  }

  updateOrderInSheet = async (orderData) => {

    const sheetToUpdate = this.state.mainOrderObj[orderData.orderNumber] ? "orderSheet" : "extraOrderSheet";

    await this.state[sheetToUpdate].loadCells('A1:M99'); // loads a range of cells

    const rowNum = orderData.orderID + 2;
    const completedCell = "M" + rowNum.toString();

    const cell = this.state[sheetToUpdate].getCellByA1(completedCell);

    cell.value = orderData.status;
    await this.state[sheetToUpdate].saveUpdatedCells(); // save all updates in one call
  }

  addToCompletedSheet = async (orderData) => {
    await this.state.completedSheet.addRows([orderData]);
  }

  updateETAInSheet = async (orderID, eta) => {
    await this.state.orderSheet.loadCells('A1:M99'); // loads a range of cells

    const rowNum = orderID + 2;
    const completedCell = "L" + rowNum.toString();

    const cell = this.state.orderSheet.getCellByA1(completedCell);

    cell.value = eta;
    await this.state.orderSheet.saveUpdatedCells(); // save all updates in one call
  }

  onComplete = (orderData) => {
    dayjs.extend(utc);

    //Update order to show in array
    const orderToShow = this.state.orderToShow + 1;
    console.log(orderData);
    const completedData = {
      date: dayjs().format("DD/MM/YYYY"),
      orderNumber: orderData.orderNumber,
      fullName: orderData.fullName,
      driver: orderData.driver,
      completed: orderData.status,
      eta: orderData.eta,
      endTime: dayjs().format('hh:mm A')
    };

    //Update ordersheet and completed sheet
    Promise.all([this.updateOrderInSheet(orderData), this.addToCompletedSheet(completedData)]).then( () => {

      //If not on the last order, display the next one and reset the buffer
      if (orderToShow < this.state.allCustomerCards.length) {

        database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/routeInfo/${this.state.dir}`).update({ buffer: 0, currentOrder: orderToShow })
          .then(() => {

            //Recalculate ETA for remaining orders
            this.setState({ orderToShow }, () => this.startRoute());

          })
      } else {

        //If route is complete, reset database values
        database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/routeInfo/${this.state.dir}`).update({
          buffer: 0,
          currentOrder: 0,
          routeOrder: [],
          routeTime: "",
          lastDest: "",
          routeStarted: false
        })
          .then(() => {
            this.setState({ orderToShow, routeCompleted: true })
          })
      }
    })
  }

  addBuffer = () => {
    //Update buffer in sheet and component
    const buffer = this.state.buffer + 5;

    //Update buffer in database and then recalculate the ETA for the current
    database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/routeInfo/${this.state.dir}`).update({ buffer })
      .then(() => {
        this.startRoute();
      })
  }

  subtractBuffer = () => {
    //Update buffer in sheet and component

    const buffer = this.state.buffer - 5;

    database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/routeInfo/${this.state.dir}`).update({ buffer })
      .then(() => {
        this.startRoute();
      })
  }

  startRoute = () => {
    dayjs.extend(utc);

    const startTime = dayjs();

    //Store startTime object in state
    this.setState({ startTime }, () => {

      //Create CustomerBlock components and push them into array
      let allCustomerCards = [];
      let totalDuration = 0;

      let ordersCpy = this.state.orderedCustObjs;

      for (let i = 0; i < ordersCpy.length; ++i) {

        let startTimeCpy = dayjs();


        //If the route has already started, update the eta for the current order 
        //Otherwise calculate the initial ETAs for all the orders
        if (this.state.routeStarted && this.state.orderToShow === i) {
          totalDuration = ordersCpy[i].formattedTime;
        } else {
          totalDuration += ordersCpy[i].formattedTime;
        }

        const bufferInSecs = this.state.orderToShow === i ? this.state.buffer * 60 : 0;

        startTimeCpy = startTimeCpy.add(totalDuration + bufferInSecs, "second");
        const etaStr = startTimeCpy.utc().local().format("h:mm A");

        ordersCpy[i].eta = etaStr;

        const cust = (<CustomerBlock
          key={i}
          duration={ordersCpy[i].formattedTime}
          data={ordersCpy[i]}
          eta={etaStr}
          onComplete={this.onComplete}
          updateETAInSheet={this.updateETAInSheet}
        />);

        allCustomerCards.push(cust);

        //Set initial ETAs, if route already started then update ETA of the current order
        if (!this.state.routeStarted || this.state.orderToShow === i) {
          this.updateETAInSheet(ordersCpy[i].id, etaStr);
        }


      }

      if (!this.state.routeStarted) {
        database.ref(
          `${process.env.REACT_APP_SPREADSHEET_ID}/routeInfo/${this.state.dir}`).update({ routeOrder: ordersCpy, routeStarted: true },
            (err) => {

              if (err) {
                console.log(err)
              } else {
                //Show the first order, render the map, and hide start button
                this.setState({ routeStarted: true, startDisplay: "none", allCustomerCards });
              }

            })
      } else {
        this.setState({ allCustomerCards });
      }
    })
  }

  parseFormattedTime = (time) => {

    const hoursInSec = parseInt(time.slice(0, 2)) * 60 * 60;

    //Slice and substring weren't working for some reason....
    const minStr = time[time.indexOf(":") + 1] + time[time.indexOf(":") + 2];
    const minutesInSec = parseInt(minStr) * 60;

    const secondsStr = time[time.lastIndexOf(":") + 1] + time[time.lastIndexOf(":") + 2];
    const seconds = parseInt(secondsStr) + minutesInSec + hoursInSec;

    return seconds;
  }

  resetRoute = () => {
    database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/routeInfo/${this.state.dir}`).update({
      routeTime: "",
      lastDest: "",
      buffer: 0,
      currentOrder: 0,
      routeStarted: false,
      routeOrder: []
    }).then(() => {
      window.location.reload();
    })
  }

  render() {
    return (
      <div id='homebg' ref={this.wrapper}>
        {
          this.state.errorState ?
            (<div>
              <h1>{this.state.errorMsg}</h1>
              <Button variant="contained" onClick={() => { this.props.history.push("/login") }}>Go to login page</Button>
            </div>
            ) :
            (<div>
              <Row mt={1} alignItems={'left'}>
                <Button id="signoutbtn" startIcon={<ExitToApp />} variant="outlined" onClick={this.signOut}>sign out</Button>
              </Row>
              <Row mt={1} alignItems={'left'}>
                <Button variant="outlined" onClick={this.resetRoute}>RESET ROUTE</Button>
              </Row>
              <Row mt={3} alignItems={'center'}>
                <Item position={'center'}>
                  <Alert severity="info">
                    <b id='upper'>CURRENT REGION: {this.state.dir}</b> <br />
                      ENTER YOUR ENDING DESTINATION
                    </Alert>
                </Item>
              </Row>
              <Row mt={4} alignItems={'center'}>
                <Item position={'center'}>
                  <form noValidate onSubmit={(e) => e.preventDefault()}>
                    <TextField
                      label="ENDING ADDRESS"
                      id="autocomplete"
                      name="lastDest"
                      value={this.state.lastDest}
                      variant="outlined"
                      onChange={this.onTextChange}
                    />
                      &nbsp;&nbsp;&nbsp;
                      <Button disabled={this.state.disableGetRoute || this.state.lastDest.length === 0} id="routebtn" variant="contained" onClick={this.getRouteTime}><DirectionsCar /></Button>
                  </form>
                </Item>
              </Row>
              <Row mt={2} alignItems={'center'}>
                <Item position={'center'}>
                  <Alert severity="error">EST. FINISH TIME: {this.state.routeTime}</Alert>
                </Item>
              </Row>
              {this.state.routeCompleted ? <Row mt={2} alignItems={'center'}>
                <Item position={'center'}>
                  <Alert severity="error">ROUTE COMPLETED</Alert>
                </Item>
              </Row> : ""}
              <Row mt={6} alignItems={'center'}>
                <Item position={'center'}>
                  <BufferBox
                    buffertime={this.state.currentBuffer}
                    addfn={this.addBuffer}
                    subfn={this.subtractBuffer}
                  />
                </Item>
              </Row>
              <Row mt={4} alignItems={'center'}>
                <Item position={'center'}>
                  <Button id="startbtn" variant="contained" style={{ display: this.state.startDisplay }} onClick={this.startRoute}>START ROUTE</Button>

                  {this.state.routeStarted ? this.state.allCustomerCards[this.state.orderToShow] : ""}
                </Item>
              </Row>
              <Backdrop id='backdrop' open={this.state.loading}>
                <LoadingThing />
              </Backdrop>
              <Row mt={4} alignItems={'center'}>
                <Item position={'center'}>
                  {/* CUSTOMER LIST CARD */}
                  <CustomerListCard
                    orders={this.state.orderedCustObjs}
                    getRouteTime={this.getRouteTime}
                  />
                </Item>
              </Row>

              <Row mt={4} alignItems={'center'}>
                <Item position={'center'}>
                  <div ref={this.map} id="map"></div>
                </Item>
              </Row>
            </div>
            )
        }
      </div>
    )
  }
}

export default withRouter(DriverHome);
