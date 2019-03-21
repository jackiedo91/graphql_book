import React from 'react';

export default ({ color, size }) => {
  var style = {
    backgroundColor: '#6ca6fd',
    width: 100,
    height: 100,
  };

  if(typeof color !== typeof undefined) {
    style.color = color;
  }
  if(typeof size !== typeof undefined) {
    style.width = size;
    style.height = size;
  }

  return <div className="bouncer" style={style}></div>
}
