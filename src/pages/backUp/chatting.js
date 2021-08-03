import React, { useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import RTMClient from '../rtm-client';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    }
});

const Chat = () => {
    const classes = useStyles();

    const [messageStorage, setMessageStorage] = useState([]);
    const [location, setLocation] = useState(["right"]);
    const { user } = useParams();

    const localClient = useMemo(() => {
        const client = new RTMClient();
        return client
    }, [])

    useEffect(() => {
        localClient.init("bccb6064412c4823a4c725e997eb80fa");
        localClient.login(`${user}`, "");
    }, [localClient])

    const onSendMessage = () => {
        const message = document.getElementById("chattingMessage").value;

        localClient.sendChannelMessage(message, "owake").then((e) => {
            if (location[location.length - 1] == "right") {
                setLocation([...location, "left"])
            } else {
                setLocation([...location, "right"])
            }
            setMessageStorage([...messageStorage, message]);
        })
    }

    localClient.on('ConnectionStateChanged', (newState, reason) => {

    })

    localClient.on('MessageFromPeer', async (message, peerId) => {

    })

    localClient.on('MemberJoined', ({ channelName, args }) => {

    })

    localClient.on('MemberLeft', ({ channelName, args }) => {

    })

    localClient.on('ChannelMessage', async ({ channelName, args }) => {
        const message = args[0].text;

        if (location[location.length - 1] == "right") {
            setLocation([...location, "left"])
        } else {
            setLocation([...location, "right"])
        }
        setMessageStorage([...messageStorage, message]);
    })

    return (
        <div>
            <Grid container>
                <Grid item xs={12} >
                    <Typography variant="h5" className="header-message">Chat</Typography>
                </Grid>
            </Grid>
            <Grid container component={Paper} className={classes.chatSection}>
                <Grid item xs={3} className={classes.borderRight500}>
                    <List>
                        <ListItem button key="RemySharp">
                            <ListItemIcon>
                                <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
                            </ListItemIcon>
                            <ListItemText primary="John Wick"></ListItemText>
                        </ListItem>
                    </List>
                    <Divider />
                    <Grid item xs={12} style={{ padding: '10px' }}>
                        <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                    </Grid>
                    <Divider />
                    <List>
                        <ListItem button key="RemySharp">
                            <ListItemIcon>
                                <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
                            </ListItemIcon>
                            <ListItemText primary="Remy Sharp">Remy Sharp</ListItemText>
                            <ListItemText secondary="online" align="right"></ListItemText>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={9}>
                    <List className={classes.messageArea}>
                        {messageStorage.length ?
                            messageStorage.map((message, index) => {
                                return (
                                    <ListItem key={index}>
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <ListItemText align={location[index]}>{message}</ListItemText>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <ListItemText align={location[index]} secondary="09:30"></ListItemText>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                )
                            })
                            :
                            <></>
                        }

                    </List>
                    <Divider />
                    <Grid container style={{ padding: '20px' }}>
                        <Grid item xs={11}>
                            <TextField id="chattingMessage" label="Type Something" fullWidth />
                        </Grid>
                        <Grid xs={1} align="right">
                            <Fab color="primary" aria-label="add" onClick={onSendMessage}>Send</Fab>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default Chat;