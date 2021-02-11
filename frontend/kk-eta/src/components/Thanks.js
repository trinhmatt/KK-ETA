import React from "react";
import { withRouter } from "react-router";
// style imports
import cx from 'clsx';
import Card from '@material-ui/core/Card';
import { CardContent, Avatar, CardMedia, CardActionArea, Box, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useLightTopShadowStyles } from '@mui-treasury/styles/shadow/lightTop';
import { useCoverCardMediaStyles } from '@mui-treasury/styles/cardMedia/cover';
import { useStyles } from '../styles';

function Thxbox({ pushhome }) {
    const classes = useStyles();
    const shadowStyles = useLightTopShadowStyles();
    const mediaStyles = useCoverCardMediaStyles();
    return (
        <Card className={cx(classes.homebox,shadowStyles.root)}>
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
                    
                        <br />
                        <Avatar className={classes.icon} src={'https://i.imgur.com/mP3XMz6.png'} />
                        <br />
                        <Typography className={classes.h4} variant={'overline'}>
                            thanks for helping us improve! :)
                        </Typography>
                        <br /><br />
                        
                    
                </CardContent>
            </CardActionArea>
            <Button id="etabtn" variant="contained" onClick={pushhome}>go home</Button>
                    </Box>
        </Card>
    )
}

class Thanks extends React.Component {
    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Thxbox
                    pushhome={() => { this.props.history.push("/") }}
                />
            </div>
        )
    }
}

export default withRouter(Thanks);