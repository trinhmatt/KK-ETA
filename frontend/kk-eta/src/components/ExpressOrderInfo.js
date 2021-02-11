import React from "react";
import { withRouter } from "react-router";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { GoogleSpreadsheet } from "google-spreadsheet";

import database from "../firebase/firebase";

// style imports
import cx from 'clsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { CardContent, Avatar, CardMedia, CardActionArea, CardActions, Typography, TextField, Button, IconButton, Box } from '@material-ui/core';
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

function ExpInfoBox({ name, done, ratingbool, ratingchg, comment, commentchg, submit, countdown, status, newstatus, pushhome, prevdef, msg }) {
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
            <CardActionArea>

                <CardContent className={classes.content}>
                    <Avatar className={classes.icon} src={'https://i.imgur.com/mP3XMz6.png'} />
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        alignItems={'center'}
                        justifyContent={'center'}
                        color={'common.black'}
                        textAlign={'center'}
                    >
                        <Typography className={classes.h3} variant={'overline'}>
                            hello {name}
                        </Typography>
                        <Typography className={classes.h4plain} variant={'overline'}>
                            thank you for your order!
                        </Typography>
                        <br />
                        <Typography className={classes.h6yellow} variant={'overline'}>
                            {(!!msg && msg.length > 0) ?
                                <Typography className={classes.h6yellow} variant={'overline'}>
                                    {msg}
                                </Typography>
                                : ''
                            }
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
            {
                (!done) ?
                    (
                        <Box
                            display={'flex'}
                            flexDirection={'column'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            color={'common.black'}
                            textAlign={'center'}
                        >
                            <CardActionArea>
                                <CardContent>
                                    {(!!countdown && countdown.length > 0) ?
                                        <div>
                                            <br /><br /><br /><br />
                                            <Typography className={classes.h4bold} variant={'overline'}>
                                                your driver is on his way:
                                            </Typography>
                                            <br /><br />
                                            <Typography className={classes.h4cool} variant={'overline'}>
                                                {countdown}
                                            </Typography>
                                            <br /><br />
                                            <Typography className={classes.h6plain} variant={'overline'}>
                                               *if we don't make it on time, enjoy a free gift on us
                                            </Typography>
                                            <br /><br /><br /><br /><br /><br /><br /><br />
                                            <Typography className={classes.h6yellow} variant={'overline'}>
                                               don't forget to rate your driver after you've received your order!
                                            </Typography>
                                        </div>
                                        :
                                        ''
                                    }
                                </CardContent>
                            </CardActionArea>
                        </Box>

                    ) : (
                        <Box
                            component="fieldset"
                            display={'flex'}
                            flexDirection={'column'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            textAlign={'center'}
                        >
                            <CardActions>
                                <CardContent>
                                    <CardActionArea>
                                        <CardContent className={classes.content}>
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
                        </Box>
                    )
            }

        </Card>
    )
}

class ExpressOrderInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            remainingTime: "",
            comment: "",
            rating: "0",
            order: {},
            ratingChanged: false,
            customMsg: "",
            newStatus: "",
        }
    }

    componentDidMount() {


        //If coming from home page there will be data passed to this component
        if (this.props.location.state) {

            //Set scroll to top of page
            window.scrollTo(0, 0);

            //Convert full name to just first name
            const name = this.props.location.state.data.fullName;
            this.props.location.state.data.fullName = name.substring(0, name.indexOf(" "));

            let customMsg = "";
            let newStatus = "";

            if (this.props.location.state.data.completed.length > 0) {

                //Check if they left a review already
                database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/${this.props.location.state.data.driver.toLowerCase()}`).once("value")
                    .then((snapshot) => {
                        const reviews = snapshot.val();
                        let didReview = false;

                        for (let i = 0; i < reviews.length; i++) {
                            if (reviews[i].orderNumber === this.props.location.state.data.orderNumber) {
                                didReview = true;
                            }
                        }

                        if (didReview) {
                            this.props.history.push("/thanks")
                        } else {
                            //Update status and custom msg
                            if (this.props.location.state.data.completed === 'done') {
                                customMsg = 'Thank you for ordering with us, hope to see you soon :)';
                                newStatus = 'done';
                            }
                            else if (this.props.location.state.data.completed === 'redeliver') {
                                customMsg = 'Your order will be out again tomorrow, see you soon :)';
                                newStatus = 'redeliver';
                            }
                            else if (this.props.location.state.data.completed === 'cancel') {
                                customMsg = 'Sorry your order has been cancelled. Hope to se you soon :)';
                                newStatus = 'cancel';
                            }
                        }
                    })


                this.setState({ isDone: true, order: this.props.location.state.data, customMsg, newStatus });
            } else if (this.props.location.state.data.startTime.length > 0) {
                this.getTimer(this.props.location.state.data);
            } else {
                this.setState({ order: this.props.location.state.data });
            }

            //Set custom messages for order status
            if (this.props.location.state.data.status === 'Processed') {
                customMsg = 'Your order is processed.\nYour driver will be in contact shortly!';
            }
            else if (this.props.location.state.data.status === 'Awaiting ID') {
                customMsg = 'Please refer to your invoice for further instructions';
            }
            else if (this.props.location.state.data.status === 'Awaiting EMT') {
                customMsg = `Dont forget to send in your EMT for ${this.props.location.state.data.total} to ensure you receive your order today`;
            }
            else if (this.props.location.state.data.status === 'Check back later') {
                customMsg = 'We are in the process of looking over your order';
            }
            else {
                customMsg = 'We are processing your order. Please check back later.';
            }

            this.setState({ customMsg });

        } else {

            database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/completed`).once("value")
                .then((snapshot) => {
                    const orders = snapshot.val();
                    let customMsg = "";
                    let newStatus = "";

                    if (!!orders[this.props.match.params.orderNum]) {

                        //Check if they left a review already
                        database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/${orders[this.props.match.params.orderNum].driver.toLowerCase()}`).once("value")
                            .then((snapshot) => {
                                const reviews = snapshot.val();
                                let didReview = false;

                                for (let i = 0; i < reviews.length; i++) {
                                    if (reviews[i].orderNumber === orders[this.props.match.params.orderNum].orderNumber) {
                                        didReview = true;
                                    }
                                }

                                if (didReview) {
                                    this.props.history.push("/thanks")
                                } else {
                                    const name = orders[this.props.match.params.orderNum].fullName;
                                    orders[this.props.match.params.orderNum].fullName = name.substring(0, name.indexOf(" "));
                                    const isDone = true;

                                    //Update status and custom msg
                                    if (orders[this.props.match.params.orderNum].completed === 'done') {
                                        customMsg = 'Thank you for ordering with us, hope to see you soon :)';
                                        newStatus = 'done';
                                    }
                                    else if (orders[this.props.match.params.orderNum].completed === 'redeliver') {
                                        customMsg = 'Your order will be out again tomorrow, see you soon :)';
                                        newStatus = 'redeliver';
                                    }
                                    else if (orders[this.props.match.params.orderNum].completed === 'cancel') {
                                        customMsg = 'Sorry your order has been cancelled. Hope to se you soon :)';
                                        newStatus = 'cancel';
                                    }

                                    this.setState({ isDone, order: orders[this.props.match.params.orderNum], customMsg, newStatus })
                                }
                            })


                    } else {

                        //If not coming from home, find the order in exp 
                        database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/exp_west`).once("value")
                            .then((snapshot) => {
                                const orders = snapshot.val();

                                if (!!orders[this.props.match.params.orderNum]) {

                                    //Convert full name to just first name
                                    const name = orders[this.props.match.params.orderNum].fullName;

                                    orders[this.props.match.params.orderNum].fullName = name.substring(0, name.indexOf(" "));



                                    //Set custom messages for order status
                                    const status = orders[this.props.match.params.orderNum].status;
                                    if (status === 'Processed') {
                                        customMsg = 'Your order is processed.\nYour driver will be in contact shortly!';
                                    }
                                    else if (status === 'Awaiting ID') {
                                        customMsg = 'Please refer to your invoice for further instructions';
                                    }
                                    else if (status === 'Awaiting EMT') {
                                        customMsg = `Dont forget to send in your EMT for ${orders[this.props.match.params.orderNum].total} to ensure you receive your order today`;
                                    }
                                    else if (status === 'Check back later') {
                                        customMsg = 'We are in the process of looking over your order';
                                    }

                                    if (orders[this.props.match.params.orderNum].completed.length > 0) {
                                        //Update status and custom msg
                                        if (orders[this.props.match.params.orderNum].completed === 'done') {
                                            customMsg = 'Thank you for ordering with us, hope to see you soon :)';
                                            newStatus = 'done';
                                        }
                                        else if (orders[this.props.match.params.orderNum].completed === 'redeliver') {
                                            customMsg = 'Your order will be out again tomorrow, see you soon :)';
                                            newStatus = 'redeliver';
                                        }
                                        else if (orders[this.props.match.params.orderNum].completed === 'cancel') {
                                            customMsg = 'Sorry your order has been cancelled. Hope to se you soon :)';
                                            newStatus = 'cancel';
                                        }

                                        this.setState({ isDone: true, order: orders[this.props.match.params.orderNum], customMsg, newStatus });
                                    } else if (orders[this.props.match.params.orderNum].startTime.length > 0) {
                                        this.getTimer(orders[this.props.match.params.orderNum]);
                                    } else {
                                        this.setState({ order: orders[this.props.match.params.orderNum], customMsg, newStatus });
                                    }

                                } else {
                                    database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/exp_east`).once("value")
                                        .then((snapshot) => {
                                            const orders = snapshot.val();

                                            if (!!orders[this.props.match.params.orderNum]) {

                                                //Convert full name to just first name
                                                const name = orders[this.props.match.params.orderNum].fullName;
                                                orders[this.props.match.params.orderNum].fullName = name.substring(0, name.indexOf(" "));

                                                let customMsg = "";
                                                let newStatus = "";

                                                //Set custom messages for order status
                                                const status = orders[this.props.match.params.orderNum].status;
                                                if (status === 'Processed') {
                                                    customMsg = 'Your order is processed.\nYour driver will be in contact shortly!';
                                                }
                                                else if (status === 'Awaiting ID') {
                                                    customMsg = 'Please refer to your invoice for further instructions';
                                                }
                                                else if (status === 'Awaiting EMT') {
                                                    customMsg = `Dont forget to send in your EMT for ${orders[this.props.match.params.orderNum].total} to ensure you receive your order today`;
                                                }
                                                else if (status === 'Check back later') {
                                                    customMsg = 'We are in the process of looking over your order';
                                                }

                                                if (orders[this.props.match.params.orderNum].completed.length > 0) {
                                                    //Update status and custom msg
                                                    if (orders[this.props.match.params.orderNum].completed === 'done') {
                                                        customMsg = 'Thank you for ordering with us, hope to see you soon :)';
                                                        newStatus = 'done';
                                                    }
                                                    else if (orders[this.props.match.params.orderNum].completed === 'redeliver') {
                                                        customMsg = 'Your order will be out again tomorrow, see you soon :)';
                                                        newStatus = 'redeliver';
                                                    }
                                                    else if (orders[this.props.match.params.orderNum].completed === 'cancel') {
                                                        customMsg = 'Sorry your order has been cancelled. Hope to se you soon :)';
                                                        newStatus = 'cancel';
                                                    }

                                                    this.setState({ isDone: true, order: orders[this.props.match.params.orderNum], customMsg, newStatus });
                                                } else if (orders[this.props.match.params.orderNum].startTime.length > 0) {
                                                    this.getTimer(orders[this.props.match.params.orderNum]);
                                                } else {
                                                    this.setState({ order: orders[this.props.match.params.orderNum], customMsg, newStatus });
                                                }

                                            }

                                        })
                                }
                            })

                    }
                })


        }
    }

    getTimer = (order, customMsg) => {
        //Get difference between start and now in milliseconds
        dayjs.extend(customParseFormat);
        const start = dayjs(order.startTime, "hh:mm A")
        const current = dayjs();
        const diff = current.diff(start);
        const remaining = 7200000 - diff;

        //Set remaining time and start timer
        this.setState({ remaining, order }, () => {
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

                    this.setState({ remainingTime, remaining, customMsg });

                } else {
                    this.setState({ remainingTime: "Sorry we did not make it in time. Enjoy your free cupcake!", customMsg })
                }

            }, 1000)
        });
    }

    loadDriverSheet = async (driver, feedback, callback) => {
        const doc = new GoogleSpreadsheet(process.env.REACT_APP_SPREADSHEET_ID);

        await doc.useServiceAccountAuth({
            client_email: process.env.REACT_APP_CLIENT_EMAIL,
            private_key: process.env.REACT_APP_PRIVATE_KEY,
        });

        await doc.loadInfo(); // loads document properties and worksheets

        const driverSheet = doc.sheetsByTitle[driver];

        this.setState({ driverSheet }, () => {
            callback(feedback)
                .then(() => {
                    this.props.history.push("/thanks");
                })
        });
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
            orderNumber: this.state.order.orderNumber,
            rating: this.state.rating,
            comment: (this.state.comment.length === 0 ? "No comment" : this.state.comment)
        };

        this.loadDriverSheet(this.state.order.driver.toLowerCase(), newRowData, this.updateFeedbackInSheet)
    }

    render() {
        return (
            <div>
                {
                    this.state.order.orderNumber ?
                        <ExpInfoBox
                        name={this.state.order.fullName}
                        done={this.state.isDone}
                        ratingbool={this.state.ratingChanged}
                        ratingchg={this.changeRating}
                        comment={this.state.comment}
                        commentchg={this.onCommentChange}
                        submit={this.submitFeedback}
                        countdown={this.state.remainingTime}
                        status={this.state.order.status}
                        newstatus={this.state.newStatus}
                        pushhome={() => { this.props.history.push("/") }}
                        prevdef={(e) => e.preventDefault()}
                        msg={this.state.customMsg}
                        /> : 
                        <div>
                            
                        </div>
                }
            </div>
        )
    }
}

export default withRouter(ExpressOrderInfo);