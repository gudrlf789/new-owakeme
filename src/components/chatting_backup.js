import React, { useMemo, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Fab from '@material-ui/core/Fab';
import RTMClient from '../rtm-client';
import ChattingUsersAndMessage from '../subcomponents/chattingUsersAndMessage';

import '../assets/css/chat.css';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
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

const Chat = (props) => {
    const classes = useStyles();
    const [chattingMessage, setChattingMessage] = useState('')
    const [messageStorage, setMessageStorage] = useState([]);
    const [userStorage, setUserStorage] = useState([]);
    const [location, setLocation] = useState(["right"]);

    const currentDate = new Date();

    const localClient = useMemo(() => {
        const client = new RTMClient();
        return client
    }, [])

    useEffect(() => {
        localClient.init("bccb6064412c4823a4c725e997eb80fa");
        localClient.login(props.userName, "", props.channelName);
    }, [localClient])

    const onSendMessage = () => {

        localClient.sendChannelMessage(chattingMessage, props.channelName).then(() => {
            setChattingMessage('')

            if (location[location.length - 1] == "right") {
                setLocation([...location, "left"])
            } else {
                setLocation([...location, "right"])
            }
            setMessageStorage([...messageStorage, chattingMessage]);
            setUserStorage([...userStorage, props.userName]);
        })
    }

    const onChattingMessage = (e) => {
        e.preventDefault();
        setChattingMessage(e.currentTarget.value)
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
        const user = args[1];

        if (location[location.length - 1] == "right") {
            setLocation([...location, "left"])
        } else {
            setLocation([...location, "right"])
        }
        setMessageStorage([...messageStorage, message]);
        setUserStorage([...userStorage, user]);
    })

    return (
        <>
            <Grid container component={Paper} className={classes.chatSection}>
                <Grid item xs={9}>
                    <List className={classes.messageArea}>
                        {messageStorage.length ?
                            messageStorage.map((message, index) => {
                                return (
                                    <ListItem key={index}>
                                        <ChattingUsersAndMessage location={location[index]} userId={userStorage[index]} userMessage={message} messageTime="09:30" />
                                    </ListItem>
                                )
                            })
                            :
                            <></>
                        }
                    </List>
                    <Divider />
                    <Grid container>
                        <Grid item xs={11}>
                            <TextField label="Type Something" fullWidth onChange={onChattingMessage} value={chattingMessage} />
                        </Grid>
                        <Grid xs={1} align="right">
                            <Fab color="primary" aria-label="add" onClick={onSendMessage}>Send</Fab>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

export default Chat;