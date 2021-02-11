import React from "react";
import { withRouter } from "react-router";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

// style imports
import cx from 'clsx';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import { Room, Mail, CheckCircle, Cancel, Phone, ArrowBack } from '@material-ui/icons';
import { Row, Item } from '@mui-treasury/components/flex';
import { CardContent, CardMedia, CardActionArea, Typography, CardActions, Modal } from '@material-ui/core';
import TextInfoContent from '@mui-treasury/components/content/textInfo';
import { useBlogTextInfoContentStyles } from '@mui-treasury/styles/textInfoContent/blog';
import { useOverShadowStyles } from '@mui-treasury/styles/shadow/over';
import { useCoverCardMediaStyles } from '@mui-treasury/styles/cardMedia/cover';
import { useStyles } from '../styles';

function ExpBox({ orderNum, timer, countdown, order, total, method, address, phone, done, name, open, val, handleClose, handleOpen, status }) {
    //Styles
    const classes = useStyles();
    const {
        button: buttonStyles,
        ...contentStyles
    } = useBlogTextInfoContentStyles();
    const shadowStyles = useOverShadowStyles();
    const mediaStyles = useCoverCardMediaStyles();

    //Text messages for drivers
    const msg_10 = encodeURI(`Hey I'm 10 minutes away. See you soon!`);
    const msg_received = encodeURI(`Hi, this is your driver from KExpress. I've received your order! Please be ready to receive your order. I will text you once again when I am nearby!`);
    const msg_here = encodeURI(`Hi I'm here. Please come out to meet me!`);

    //Convert SMS string for android phones
    let SMSString = "&";
    const userEnv = navigator.userAgent.toLowerCase();
    if (userEnv.indexOf("android") > -1) {
        SMSString = "?";
    }

    return (
        <Card className={cx(classes.cbox, shadowStyles.root)}>
            <CardMedia
                classes={mediaStyles}
                image={
                    'https://cdn.lowgif.com/small/3e4ae49653ac97d1-gif-kawaii-pastel-sailor-moon-runacream.gif'
                }
            />
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
                                            are u sure u want <b>{val}</b>
                                        </Typography>
                                    </Row>
                                    <Row mt={1} alignItems={'center'}>
                                        <Item position={'center'}>
                                            <Button id='canbtn' size='small' variant='contained' onClick={handleClose}>no</Button>
                                        </Item>
                                        <Item position={'center'}>
                                            <Button color='secondary' size='small' variant='contained' onClick={done} value={val}>{val}</Button>
                                        </Item>
                                    </Row>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </div>
                </Modal>
            </CardActions>
            <CardActionArea>
                <CardContent>
                    <TextInfoContent
                        classes={contentStyles}
                        overline={<span className={classes.h5}>#{orderNum}</span>}
                    />
                    <TextInfoContent
                        classes={contentStyles}
                        overline={<span className={classes.h5}>{status}</span>}
                    />
                    <Row mt={1} ref={timer} alignItems={'center'}>
                        <Typography className={classes.h5red} variant={'overline'}>
                            {countdown}
                        </Typography>
                    </Row>
                    <Row mt={2} alignItems={'center'}>
                        <Typography className={classes.defaultBigger} variant={'overline'}>
                            {name} <br />
                            {address} <br />
                            {phone}
                        </Typography>
                    </Row>
                    <Row mt={3} alignItems={'center'}>
                        <Typography className={classes.defaultBigger} variant={'overline'}>
                            <b>products:</b> <br />
                            {order}
                        </Typography>
                    </Row>
                    <Row mt={3} alignItems={'center'}>
                        <Typography className={classes.default} variant={'overline'}>
                            <b>{method}</b>
                        </Typography>
                    </Row>
                    <Row alignItems={'center'}>
                        <Typography style={{display: method === 'EMT' ? 'none' : 'block'}} className={classes.defaultBigger} variant={'overline'}>
                            {total}
                        </Typography>
                    </Row>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <CardContent>
                    <Row mt={1} alignItems={'center'}>
                        <Item position={'center'}>
                            <Button size='small' variant='contained' color='primary' href={`http://maps.google.com/?q=${address}`}>
                                <Room /> &#09; {address}
                            </Button>
                        </Item>
                    </Row>
                    <Row mt={3} alignItems={'center'}>
                        <Item position={'center'}>
                            <Button size='small' startIcon={<Phone />} variant='contained' color='secondary' href={`tel:${phone}`}>call</Button>
                        </Item>
                        &nbsp;
                        <Item position={'center'}>
                            <Button size='small' startIcon={<Mail />} variant='contained' color='secondary' href={`sms://${phone}${SMSString}body=${msg_10}`}>10mins</Button>
                        </Item>
                        &nbsp;
                        <Item position={'center'}>
                            <Button size='small' startIcon={<Mail />} variant='contained' color='secondary' href={`sms://${phone}${SMSString}body=${msg_here}`}>here</Button>
                        </Item>
                    </Row>
                    <Row mt={1} alignItems={'center'}>
                        <Item position={'center'}>
                            <Button size='small' startIcon={<Mail />} variant='contained' color='secondary' href={`sms://${phone}${SMSString}body=${msg_received}`}>received</Button>
                        </Item>
                    </Row>
                    <Row mt={4} alignItems={'center'}>
                        <Item position={'center'}>
                            <Button id='donebtn' startIcon={<CheckCircle />} variant='contained' onClick={handleOpen} value={"done"}>done</Button>
                        </Item>
                        <Item position={'center'}>
                            <Button id='canbtn' startIcon={<Cancel />} variant='contained' onClick={handleOpen} value={"cancel"}>cancel</Button>
                        </Item>
                    </Row>
                </CardContent>
            </CardActions>
        </Card>
    )
}

class ExpressCustBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: "block",
            newArr: "",
            isOpen: false,
            val: ""
        }
    }

    componentDidMount() {

        //If timer started, calculate the difference between current time and start time
        if (this.props.data.startTime.length > 0 && this.props.data.status === "Processed") {

            //Get difference between start and now in milliseconds
            dayjs.extend(customParseFormat);
            const start = dayjs(this.props.data.startTime, "hh:mm A")
            const current = dayjs();
            const diff = current.diff(start);
            const remaining = 7200000 - diff;

            //Set remaining time and start timer
            this.setState({ remaining }, () => {
                setInterval(() => {

                    const remaining = this.state.remaining - 1000;

                    if (remaining > 0) {
                        const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        let minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
                        let seconds = Math.floor((remaining % (1000 * 60)) / 1000);

                        if (seconds < 10) {
                            seconds = "0" + seconds;
                        }

                        if (minutes < 10) {
                            minutes = "0" + minutes;
                        }

                        const remainingTime = hours + ":" + minutes + ":" + seconds;

                        this.setState({ remainingTime, remaining });

                    } else if (this.props.data.completed.length > 0) {
                        this.setState({ display: "none" })
                    } else {
                        this.setState({ remainingTime: "free preroll!!!" })
                    }



                }, 1000)
            });
        }
        //Remove product price from order
        var count = 1;
        var newProducts = "";
        //Count how many products 
        for (let i = 0; i < this.props.data.order.length; ++i) {
            if (this.props.data.order[i] === '\n') {
                count++;
            }
        }
        //Get rid of product price
        var arrOfProducts = this.props.data.order.split("\n", count);
       
        for (let i = 0; i < arrOfProducts.length; ++i) {
            arrOfProducts[i] = arrOfProducts[i].substring(0, arrOfProducts[i].indexOf("$"));
        }
        for (var i = 0; i < arrOfProducts.length; ++i) {
            newProducts += i + 1 + '.' + arrOfProducts[i] + '\n';
        }
        this.setState({ newArr: newProducts });

    }

    //Handle open and close of modal
    handleOpen = (e) => {
        this.setState({val: e.currentTarget.value, isOpen: true});
        //setVal(e.currentTarget.value);
        
    }
    handleClose = () => {
        this.setState({isOpen: false});
    }

    handleComplete = (e) => {
        let order = this.props.data;
        order.completed = e.currentTarget.value;
        console.log(order.completed);
        this.handleClose();
        this.props.onComplete(order);

        this.setState({ display: "none"});

    }

    render() {
        return (
            <div style={{ display: this.state.display }}>
                <ExpBox
                    orderNum={this.props.data.orderNumber}
                    timer={this.timer}
                    status={this.props.data.status}
                    countdown={this.state.remainingTime}
                    custinfo={this.props.data.customerInfo}
                    order={this.state.newArr}
                    total={this.props.data.paymentMethod.indexOf("Interac") > -1 ? "" : this.props.data.total}
                    method={this.props.data.paymentMethod.indexOf("Interac") > -1 ? "EMT" : "Cash"}
                    address={this.props.data.address}
                    phone={this.props.data.phoneNumber}
                    done={this.handleComplete}
                    name={this.props.data.fullName}
                    open={this.state.isOpen}
                    val={this.state.val}
                    handleClose={this.handleClose}
                    handleOpen={this.handleOpen}
                />
                <br /><br />
            </div>
        )
    }
}

export default withRouter(ExpressCustBlock);

