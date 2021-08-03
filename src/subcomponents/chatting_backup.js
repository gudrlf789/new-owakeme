import React from "react";
import "../assets/css/chat.css";

import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
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
import ChattingUsersAndMessage from './chattingUsersAndMessage';
import { useDropzone } from 'react-dropzone'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '30vw',
    height: '100%'
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

const Chatting = (props) => {
  const classes = useStyles();
  const [chattingMessage, setChattingMessage] = useState('')
  const [messageStorage, setMessageStorage] = useState([]);
  const [userStorage, setUserStorage] = useState([]);
  const [location, setLocation] = useState(["right"]);

  const test = useSelector(state => state.userReducer.userName)

  const localClient = useMemo(() => {
    const client = new RTMClient();
    return client
  }, [])

  useEffect(() => {
    localClient.init("bccb6064412c4823a4c725e997eb80fa");
    localClient.login(props.userName, "", props.channelName);
  }, [localClient])

  ///////테스트
  const onDrop = useCallback((acceptedFiles) => {
    debugger;
    acceptedFiles.map((files) => {
       localClient.sendChannelMediaMessage(files, props.channelName, files).then(() => {
           alert('파일 업로드 완료')
       });
    })
  }, [])
  
  const { getRootProps } = useDropzone({ onDrop });
  ////////////

  const onSendMessage = useCallback((e) => {
    localClient.sendChannelMessage(chattingMessage, props.channelName).then(() => {
        setChattingMessage('')

        /*if(location[location.length - 1] == "right"){
            setLocation([...location, "left"])
        }else{
            setLocation([...location, "right"])
        }*/
        setLocation([...location, "right"])

        setMessageStorage([...messageStorage, chattingMessage]);
        setUserStorage([...userStorage, props.userName]);
    })
  }, [chattingMessage])

  const onChattingMessage = useCallback((e) => {
      e.preventDefault();

      setChattingMessage(e.currentTarget.value)
  }, [])

  localClient.on('ConnectionStateChanged', (newState, reason) => {
      
  })

  localClient.on('MessageFromPeer', async (message, peerId) => {
      
  })

  localClient.on('MemberJoined', ({ channelName, args }) => {
      
  })

  localClient.on('MemberLeft', ({ channelName, args }) => {
      
  })

  localClient.on('ChannelMessage', async ({ channelName, args }) => {
      switch (args[0].messageType) {
        case 'IMAGE':
            localClient.downloadChannelMedia(args[0].mediaId).then((r) => {
                console.log(r)
            })
        break;
        case 'FILE':

        break;
        default:
            const message = args[0].text;
            const user = args[1];  

            //if(location[location.length - 1] == "right" && test !== args[1]){
            if(test !== user){
                setLocation([...location, "left"])
            }else{
                setLocation([...location, "right"])
            }
            setMessageStorage([...messageStorage, message]);
            setUserStorage([...userStorage, user]);
        break;
      }
      
  })
>>>>>>> upstream/main:src/subcomponents/chatting.js

function chatting() {
  return (
<<<<<<< HEAD:src/components/chatting.js
    <div className="chat__container">
      <div className="top__groupbar">
        <h3>GroupBar</h3>
      </div>

      <div className="chat__message">
        <h3>chat__message</h3>
      </div>

      <div className="chat__footer">
        <input type="text" placeholder="input to text" />
      </div>
    </div>
  );
}

export default chatting;
=======
      <>
        <Grid container component={Paper} className={classes.chatSection}>
            <Grid item xs={9}>
                <List className={classes.messageArea}>
                    <div {...getRootProps()} className={classes.messageArea}>
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
                    </div>
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

export default Chatting;
>>>>>>> upstream/main:src/subcomponents/chatting.js
