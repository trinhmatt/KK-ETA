import React from "react";
import { withRouter } from "react-router";
import { firebase } from "../firebase/firebase";
import database from "../firebase/firebase";
import { GoogleSpreadsheet } from "google-spreadsheet";

import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

import ExpressCustBlock from "./ExpressCustBlock";
import { Row, Item } from '@mui-treasury/components/flex';
import { ContactMailOutlined, ExitToApp } from '@material-ui/icons';
import Button from '@material-ui/core/Button';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} varient="filled" {...props} />;
}

class ExpressHome extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            customerCards: [],
            errorMsg: "",
            dir: "",
        }
    }
    componentDidMount() {

        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
              this.setState({ errorMsg: "You are not logged in!", errorState: true })
            } else {
      
                const sheetName = user.email.substring(0, user.email.indexOf("@"));
                const dir = sheetName.indexOf("east") > -1 ? "EAST" : "WEST";

                database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/${sheetName}`).on("value", (snapshot) => {
                    dayjs.extend(customParseFormat);

                    const orders = snapshot.val();

                    const orderNumbers = Object.keys(orders);

                    let ordersToSort = [];
                    let customerCards = [];
        
                    for (let i = 0; i<orderNumbers.length; i++) {
                        if (orders[orderNumbers[i]].completed.length === 0) {
                            ordersToSort.push(orders[orderNumbers[i]]);
                        }
                        
                    }

                    ordersToSort.sort( (a, b) => {
                        let returnNumber = 0;

                        if (a.startTime.length > 0 && b.startTime.length > 0) {
                            const timeForA = dayjs(a.startTime, "hh:mm A");
                            const timeForB = dayjs(b.startTime, "hh:mm A");

                            returnNumber = timeForA.isBefore(timeForB) ? -1 : 1;
                        } else if (a.startTime && a.startTime.length > 0) {
                            returnNumber = -1;
                        } else {
                            returnNumber = 1;
                        }

                        return returnNumber;
                        
                    })

                    for (let i = 0; i<ordersToSort.length; i++) {
                        const customerCard = <ExpressCustBlock key={`${ordersToSort[i].orderNumber}/${ordersToSort[i].startTime}`} data={ordersToSort[i]} onComplete={this.onComplete} index={i}/>
                        customerCards.push(customerCard);
                    }
                    
                    this.setState({customerCards, sheetName, dir}, () => {
                        this.loadSheet(this.state.sheetName);
                    });
                    
        
                })
      
            }
          })
    }
    loadSheet = async (sheetName) => {

        const doc = new GoogleSpreadsheet(process.env.REACT_APP_SPREADSHEET_ID);

        const privateKey = process.env.REACT_APP_PRIVATE_KEY.replace(/\\n/g, '\n');

        await doc.useServiceAccountAuth({
            client_email: process.env.REACT_APP_CLIENT_EMAIL,
            private_key: privateKey,
        });

        await doc.loadInfo(); // loads document properties and worksheets

        const orderSheet = doc.sheetsByTitle[sheetName];
        const completedSheet = doc.sheetsByTitle["completed"];


        this.setState({ orderSheet, completedSheet });
    
    }

    updateOrderInSheet = async (orderData) => {
        
        //Find row that matches the order
        const rows = await this.state.orderSheet.getRows(); 

        let orderRow = -1;

        for (let i = 0; i<rows.length; i++) {

            if (rows[i].orderNumber === orderData.orderNumber.toString()) {
                orderRow = i+2;
            }
        }

        await this.state.orderSheet.loadCells('A1:M99'); // loads a range of cells

        const completedCell = "M" + orderRow.toString();

        const cell = this.state.orderSheet.getCellByA1(completedCell);

        cell.value = orderData.completed;

        await this.state.orderSheet.saveUpdatedCells(); // save all updates in one call
    }
    
    addToCompletedSheet = async (orderData) => {
        await this.state.completedSheet.addRows([orderData]);
    }

    onComplete = (orderData) => {
        
        const completedObj = {
            orderNumber: orderData.orderNumber,
            fullName: orderData.fullName,
            driver: orderData.driver,
            completed: orderData.completed,
            date: dayjs().format("DD/MM/YYYY"),
            startTime: orderData.startTime,
            endTime: dayjs().format('hh:mm A')
        }

        this.addToCompletedSheet(completedObj)
            .then( () => {
                this.updateOrderInSheet(orderData)
                    .then( () => {
                        try {
                            database.ref(`${process.env.REACT_APP_SPREADSHEET_ID}/${this.state.sheetName}/${orderData.orderNumber}`).update(orderData);
                        } catch {
                            console.log("db update fail");
                        }
                        
                    })
            })
        
    }

    signOut = () => {
        firebase.auth().signOut()
          .then(() => this.props.history.push("/login"))
    }

    render() {
        return (
            <div id='expbg' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {
                    this.state.errorMsg.length > 0 ? 
                        <div>
                            <h1>You are not logged in.</h1>
                            <button onClick={() => this.props.history.push("/login")}>Login Page</button>
                        </div> 
                        : 

                        <div>
                            <Row mt={1} alignItems={'left'}>
                                <Button id="signoutbtn" startIcon={<ExitToApp />} variant="contained" onClick={this.signOut}>sign out</Button>
                            </Row>
                            <Row mt={2} alignItems={'center'}>
                                <Item position={'center'}>
                                    <Alert severity="error">
                                        <b>CURRENT REGION: {this.state.dir}</b>
                                    </Alert>
                                </Item>
                            </Row>
                            <br />
                            {this.state.customerCards}
                        </div>
                }
                
            </div>
        )
    }
}

export default withRouter(ExpressHome);