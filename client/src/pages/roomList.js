import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/roomList.css';
import RoomCard from '../components/roomCard';
import new_owake_logo_white from "../assets/img/new_owake_logo_white.svg";

function RoomList() {
  const [roomList, setRoomList] = useState([]);

  useEffect(() => {
    axios.get('/api/room/roomList').then(res => {
      setRoomList(res.data.roomList);
    })
  }, [])

  return (
    <>
      <div className="container">
        <div className="inner__container">
          <div className="header__container">
            <div className="roomList_logo">
              <img src={new_owake_logo_white} alt="" />
            </div>
          </div>

          <div className="body__container">
            <div className="body__channel__container">
              {
                 roomList.map((obj, index) => {
                   return (
                    <RoomCard 
                      roomName={obj.roomName}
                      roomNumber={obj.roomNumber}
                      makeUserName={obj.makeUserName}
                      photoURL={obj.photoURL}
                      key={index}
                    />
                   )
                 })
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RoomList
