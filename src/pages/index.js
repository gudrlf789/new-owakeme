import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useRouter from '../utils/use-router';
import '../assets/css/style.css';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const routerCtx = useRouter();

  const [channelName, setChannelName] = useState('')
  const [userName, setUserName] = useState('')

  const onChanelName = (e) => {
    e.preventDefault();

    setChannelName(e.currentTarget.value)
  }

  const onUserName = (e) => {
    e.preventDefault();

    setUserName(e.currentTarget.value)
  }

  const onEnterChanel = () => {
    routerCtx.history.push({ pathname: `/meeting/${channelName}/${userName}` })
  }

  return (
    <div class="container">
        <div class="row_container">
            <div id="logo">
                <h1 class="title">OWAKE</h1>
            </div>

            <div id="title_copyright">
                <span>Hyper Augmented Omni <br />Communication Chnnel_OWAKE</span>
            </div>

            <div class="btn_container">
                <div class="row">

                    <div id="Name_Your_Channel">
                        <input id="Name_Your_Channel_input" placeholder="Name Your Channel" onChange={onChanelName} />
                    </div>
                    <div>
                        <input id="Name_Your_Channel_input" placeholder="User Name" onChange={onUserName} />
                    </div>
                    <div id="Create_Channel">
                        <Button style={{ width: '35vw', height: '5vh' }} onClick={onEnterChanel}>Create Channel</Button>
                    </div>
                    <div id="Channel_ID_URL">
                        <span>Channel ID or URL</span>
                    </div>
                </div>
            </div>

            <footer id="footer">
                <span id="left">@Copyright 2021 build by Owakeme.com
                </span>
                <span id="right">Sponsored by Kronosa.org</span>
            </footer>
        </div>
    </div>
  );
}