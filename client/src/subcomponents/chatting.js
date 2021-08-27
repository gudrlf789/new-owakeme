import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Modal from '@material-ui/core/Modal';
import RTMClient from '../rtm-client';
import ChattingUsersAndMessage from './chattingUsersAndMessage';
import Dropzone from 'react-dropzone';
import { saveAs } from 'file-saver';
import "../assets/css/chat.css";
import SendOutlinedIcon from "@material-ui/icons/SendOutlined";
import moment from 'moment';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  messageArea: {
    height: '70vh',
    overflowY: 'auto'
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

const IMAGE_FORMAT = "\\.(bmp|gif|jpg|jpeg|png)$";

const Chatting = () => {
  const classes = useStyles();

  const [chattingMessage, setChattingMessage] = useState("");
  const [messageStorage, setMessageStorage] = useState([]);
  const [userStorage, setUserStorage] = useState([]);
  const [filesStorage, setFilesStorage] = useState([]);
  const [location, setLocation] = useState([]);
  const [filePath, setFilePath] = useState("");
  const [open, setOpen] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false);

  const channelName = useSelector((state) => state.channelReducer.channelName);
  const userName = useSelector((state) => state.userReducer.userName);

  const localClient = useMemo(() => {
    const client = new RTMClient();
    return client;
  }, []);

  useEffect(() => {
    localClient.init(process.env.REACT_APP_AGORA_APP_ID);
    localClient.login(userName, "", channelName);
  }, [localClient]);

  useEffect(() => {
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
        const messageType = args[0].messageType;
        const mediaId = args[0].mediaId;
        const fileName = args[0].fileName;
        const user = args[1];
        const today = moment();
        
        const reader = new FileReader();
        switch (messageType) {
          case 'IMAGE':
              setIsFileLoading(true);
              localClient.downloadChannelMedia(mediaId).then((r) => {
                  reader.readAsDataURL(r);
                  reader.onload = function(e) {
                      setFilePath(e.target.result)
                  }

                  setIsFileLoading(false);
                  saveAs(r, fileName);
              })
          break;
          case "FILE":
            setIsFileLoading(true);
            localClient.downloadChannelMedia(mediaId).then((r) => {
              setIsFileLoading(false);
              saveAs(r, fileName);
            });
            break;
          default:
            setLocation([...location, "left"]);
            setMessageStorage([...messageStorage, {message: message, messageTime: today.format("HH:mm")}]);
            setUserStorage([...userStorage, user]);
            break;
      }
    });
  }, [messageStorage, userStorage, location]);

  const onDrop = useCallback((acceptedFiles) => {
    setFilesStorage(acceptedFiles);
    setOpen(!open);
  }, []);

  const onDropRejected = useCallback((error) => {
    alert(error[0].errors[0].code);
  }, []);

  const onSendMessage = useCallback((e) => {
      const today = moment();

      localClient.sendChannelMessage(chattingMessage, channelName).then(() => {
        setChattingMessage("");
        setLocation([...location, "right"]);
        setMessageStorage([...messageStorage, {message: chattingMessage, messageTime: today.format("HH:mm")}]);
        setUserStorage([...userStorage, userName]);
    })
  }, [chattingMessage, location, userStorage])

  const onChattingMessage = useCallback((e) => {
      setChattingMessage(e.currentTarget.value);
  }, [chattingMessage])

  const uploadFile = useCallback(async () => {
    setOpen(false);

    await Promise.all(filesStorage.map((file) => {
      if (new RegExp(IMAGE_FORMAT, "i").test(file.name)) {
        localClient
          .sendChannelImageMediaMessage(file, channelName, file);
      } else {
        localClient
          .sendChannelFileMediaMessage(file, channelName, file);
      }
    }));

  }, [filesStorage]);

  const handleClose = useCallback(() => {
      setOpen(!open);
  }, [open]);

  const body = (
    <div>
        <h2>파일 전송</h2>
        <h3>다음 파일을 전송합니다.</h3>
        <ul>
        {
            filesStorage.map((file, index) => (
                <li key={index}>{file.name}</li>
            ))
        }
        </ul>
        <span>
            <button onClick={uploadFile}>확인</button>
            <button onClick={handleClose}>취소</button>
        </span>
    </div>
);

  return (
      <>
        <div className="chat__body">
            <div className="inner__body__container">
                {isFileLoading && <CircularProgress />}

                <List className={classes.messageArea}>
                    <Dropzone
                        onDrop={onDrop}
                        onDropRejected={onDropRejected}
                        maxSize={32000000}
                    >
                        {({getRootProps}) => (
                            <div {...getRootProps()} className={classes.messageArea}>
                                {messageStorage.length ?
                                    messageStorage.map((message, index) => 
                                        (
                                            <ListItem key={index}>
                                                <ChattingUsersAndMessage location={location[index]} userId={userStorage[index]} userMessage={message} />
                                            </ListItem>
                                        )
                                    )
                                :
                                    <></>
                                }
                                <div>
                                  {open && 
                                    <Modal
                                        open={open}
                                        onClose={handleClose}
                                        className={classes.paper}
                                    >
                                        {body}
                                    </Modal>
                                  }
                                </div>
                            </div>
                        )}
                    </Dropzone>
                </List>
            </div>
            <div className="inner__input__container">
                <TextField
                    label="Input Text"
                    fullWidth
                    onChange={onChattingMessage}
                    value={chattingMessage}
                />
                &nbsp;
                <SendOutlinedIcon
                    id="sendOutlinedIcon"
                    onClick={onSendMessage}
                ></SendOutlinedIcon>
            </div>
        </div>
    </>
  );
};

export default React.memo(Chatting);
