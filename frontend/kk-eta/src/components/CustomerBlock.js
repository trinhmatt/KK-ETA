import React from 'react';
import '../index.css';

import cx from 'clsx';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import { Room, Mail, CheckCircle, Cancel, Phone, Replay } from '@material-ui/icons';
import { Row, Item } from '@mui-treasury/components/flex';
import { CardContent, CardMedia, CardActionArea, Modal, Typography, CardActions } from '@material-ui/core';
import TextInfoContent from '@mui-treasury/components/content/textInfo';
import { useBlogTextInfoContentStyles } from '@mui-treasury/styles/textInfoContent/blog';
import { useOverShadowStyles } from '@mui-treasury/styles/shadow/over';
import { useCoverCardMediaStyles } from '@mui-treasury/styles/cardMedia/cover';
import { useStyles } from '../styles';


const CustomerBlock = (props) => {
  //Styles
  const styles = useStyles();
  const {
    button: buttonStyles,
    ...contentStyles
  } = useBlogTextInfoContentStyles();
  const shadowStyles = useOverShadowStyles();
  const mediaStyles = useCoverCardMediaStyles();
  //Modal
  const [open, setOpen] = React.useState(false);
  //Set value of modal's button based on button click
  const [val, setVal] = React.useState('');

  //Only show first name
  const firstName = props.data.fullName.substring(0, props.data.fullName.indexOf(" "));

  //Text messages for drivers
  const msg_10 = encodeURI(`Hey I'm 10 minutes away. See you soon!`);
  const msg_5 = encodeURI(`Hey I'm 5 minutes away. See you soon!`);
  const msg_15 = encodeURI(`Hey I'm 15 minutes away. See you soon!`);
  const msg_next = encodeURI(`Hi ${firstName}, this is your driver from KK. You're the next customer on my route. Please be ready to receive your order. I will text you once again when I am nearby!`);
  const msg_here = encodeURI(`Hi I'm here. Please come out to meet me!`);
  const msg_safedrop = encodeURI(`Your order has been safe dropped! Have a great night.`);

  //Convert SMS and address string for android phones
  let SMSString = "&";
  let geoString = props.data.geoString;
  const userEnv = navigator.userAgent.toLowerCase();
  if (userEnv.indexOf("android") > -1) {
    SMSString = "?";
  } else {
    //Current geostring is for android, if apple change it
    geoString = `maps://maps.google.com/maps?daddr=${props.data.lat},${props.data.lng}&amp;ll=`
  }

  const handleComplete = (e) => {
    const returnObj = {
      status: e.currentTarget.value,
      orderID: props.data.id,
      fullName: props.data.fullName,
      orderNumber: props.data.orderNumber,
      driver: props.data.driver
    }

    props.onComplete(returnObj);
    handleClose();
  }
  const handleOpen = (e) => {
    setVal(e.currentTarget.value);

    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }
  
  return (

    <Card className={cx(styles.cbox, shadowStyles.root)}>
      <CardMedia
        classes={mediaStyles}
        image={
          'https://i.pinimg.com/originals/0c/08/f4/0c08f43d2f75f061d0142ca519e16478.gif'
        }
      />
      <CardActions>
        <Modal
          open={open}
          onClose={handleClose}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card className={cx(styles.popup, shadowStyles.root)}>
              <CardMedia
                classes={mediaStyles}
                image={
                  'https://i.pinimg.com/originals/ac/1c/b3/ac1cb3d2baa33b1bbba1e409fbfb70b1.gif'
                }
              />
              <CardActionArea>
                <CardContent>
                  <Row mt={10} alignItems={'center'}>
                    <Typography className={styles.h5}>
                      are u sure u want <b>{val}</b>
                    </Typography>
                  </Row>
                  <Row mt={1} alignItems={'center'}>
                    <Item position={'center'}>
                      <Button id='canbtn' size='small' variant='contained' onClick={handleClose}>no</Button>
                    </Item>
                    <Item position={'center'}>
                      <Button color='secondary' size='small' variant='contained' onClick={handleComplete} value={val}>{val}</Button>
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
            overline={<><span className={styles.errmsg}>{(props.data.eta ? `ETA: ${props.eta}` : "")}</span></>}
            heading={<><b className={styles.defaultBigger}>#{props.data.orderNumber}</b></>}
            body={
              <>
                <span className={styles.defaultBigger}>
                  {firstName} <br />
                  <b>{props.data.address}</b> <br /><br />
                  <b>{props.data.payment === 'Interact E-Transfer' ? 'EMT' : ("$" + props.data.orderTotal)}</b> <br /><br />
                  {props.data.note}
                </span>
              </>
            }
          />
        </CardContent>
      </CardActionArea>

      <CardActions >
        <CardContent >
          <Row alignItems={'center'}>
            <Item position={'center'}>
            {/* http://maps.google.com/?q=${props.data.address} */}
              <Button size='small' variant='contained' color='primary' target="_blank" href={geoString}>
                <Room /> {props.data.address}
              </Button>
            </Item>
            </Row>
            <Row mt={2} alignItems={'center'}>
            <Item position={'center'}>
              <Button size='medium' startIcon={<Mail />} variant='contained' color='secondary' href={`sms://${props.data.number}${SMSString}body=${msg_next}`}>next order</Button>
            </Item>
            &nbsp;
            <Item position={'center'}>
              <Button size='medium' startIcon={<Mail />} variant='contained' color='secondary' href={`sms://${props.data.number}${SMSString}body=${msg_here}`}>i'm here</Button>
            </Item>
          </Row>
          <Row mt={2} alignItems={'center'}>
          <Item position={'center'}>
              <Button size='medium' startIcon={<Mail />} variant='contained' color='secondary' href={`sms://${props.data.number}${SMSString}body=${msg_5}`}>5min</Button>
            </Item>
            &nbsp;
            <Item position={'center'}>
              <Button size='medium' startIcon={<Mail />} variant='contained' color='secondary' href={`sms://${props.data.number}${SMSString}body=${msg_10}`}>10min</Button>
            </Item>
            &nbsp;
            <Item position={'center'}>
              <Button size='medium' startIcon={<Mail />} variant='contained' color='secondary' href={`sms://${props.data.number}${SMSString}body=${msg_15}`}>15min</Button>
            </Item>
          </Row>
          <Row mt={2} alignItems={'center'}>
            <Item position={'center'}>
              <Button size='medium' startIcon={<Mail />} variant='contained' color='secondary' href={`sms://${props.data.number}${SMSString}body=${msg_safedrop}`}>safedrop</Button>
            </Item>
          </Row>
          <Row mt={2} alignItems={'center'}>
            <Item position={'center'}>
              <Button startIcon={<Phone />} variant='contained' color='secondary' href={`tel:${props.data.number}`}>{props.data.number}</Button>
            </Item>
          </Row>
          <Row mt={3} alignItems={'center'}>
            <Item position={'center'}>
              <Button id='donebtn' startIcon={<CheckCircle />} variant='contained' onClick={handleOpen} value={"done"}>done</Button>
            </Item>
            <Item position={'center'}>
              <Button id='canbtn' startIcon={<Cancel />} variant='contained' onClick={handleOpen} value={"cancel"}>cancel</Button>
            </Item>
          </Row>
          <Row mt={2} alignItems={'center'}>
            <Item position={'center'}>
              <Button id='rebtn' startIcon={<Replay />} variant='contained' onClick={handleOpen} value={"redeliver"}>redeliver</Button>
            </Item>
          </Row>
        </CardContent>
      </CardActions>
    </Card>
  )
}

export default CustomerBlock;
