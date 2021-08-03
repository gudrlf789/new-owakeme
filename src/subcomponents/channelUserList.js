import React from 'react'
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';

function channelUserList() {
    return (
        <>
            <ListItemAvatar align="left">
                <Avatar>
                    테스트
                </Avatar>
            </ListItemAvatar>
            <ListItemText align="left">테스트</ListItemText>
        </>
    )
}

export default channelUserList
