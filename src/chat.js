import React from 'react';

export default function Chat(props) {
  return (
    <div className="chat" style={{color: props.userName === props.message.user ? '#3767c0' : 'grey'}}>
      <div>{props.message.user}: {props.message.msg}</div>
    </div>
  )
}