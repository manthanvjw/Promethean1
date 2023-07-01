import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import ROSLIB from 'roslib';

// Create ROS instance and connect to the ROS Master
const ros = new ROSLIB.Ros({
  url: 'ws://localhost:9090', // Replace with the actual ROS Master URL
});

// Create a topic publisher for the vehicle's channel overrides
const channelOverridePublisher = new ROSLIB.Topic({
  ros: ros,
  name: '/mavros/rc/override',
  messageType: 'mavros_msgs/OverrideRCIn',
});

const handleKeyDown = (event) => {
  switch (event.key) {
    case 'ArrowUp':
      sendRoverMovement(1500, 1500); // Move forward
      break;
    case 'ArrowDown':
      sendRoverMovement(1500, 1500); // Move backward
      break;
    case 'ArrowLeft':
      sendRoverMovement(1400, 1600); // Turn left
      break;
    case 'ArrowRight':
      sendRoverMovement(1600, 1400); // Turn right
      break;
    default:
      break;
  }
};

const sendRoverMovement = (leftSpeed, rightSpeed) => {
  const message = new ROSLIB.Message({
    channels: [0, 0, 0, 0, leftSpeed, rightSpeed, 0, 0], // Adjust the indices of the left and right wheel channels according to your configuration
  });

  channelOverridePublisher.publish(message);
};

const App = () => {
  const [roverDirection, setRoverDirection] = useState('');
  const [armPositions, setArmPositions] = useState([0, 0, 0, 0, 0, 0]);
  const videoRef = useRef(null);

  const handleRoverDirectionChange = (direction) => {
    setRoverDirection(direction);
  };

  const handleArmPositionChange = (index, position) => {
    setArmPositions((prevPositions) => {
      const updatedPositions = [...prevPositions];
      updatedPositions[index] = position;
      return updatedPositions;
    });
  };

  const handleForceStop = () => {
    setRoverDirection('');
  };

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
        });
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="container">
      <div className="controls">
        <h1 className="title">Rover Control</h1>
        <div className="rover-direction">
          <h2>Rover Direction</h2>
          <div className="button-group">
            <button className="rover-button" onClick={() => handleRoverDirectionChange('Forward')}>Forward</button>
            <button className="rover-button" onClick={() => handleRoverDirectionChange('Backward')}>Backward</button>
            <button className="rover-button" onClick={() => handleRoverDirectionChange('Left')}>Left</button>
            <button className="rover-button" onClick={() => handleRoverDirectionChange('Right')}>Right</button>
            <button className="rover-button force-stop" onClick={handleForceStop}>Force Stop</button>
          </div>
          <p>Current direction: {roverDirection}</p>
        </div>
        <div className="arm-positions">
          <h2>Robotic Arm Positions</h2>
          <div className="button-group">
            <button className="arm-button" onClick={() => handleArmPositionChange(0, 0)}>Position 0</button>
            <button className="arm-button" onClick={() => handleArmPositionChange(0, 1)}>Position 1</button>
            <button className="arm-button" onClick={() => handleArmPositionChange(0, 2)}>Position 2</button>
            {/* ... repeat for positions 3, 4, 5 */}
          </div>
          <p>Current positions:</p>
          <ul>
            {armPositions.map((position, index) => (
              <li key={index}>Joint {index + 1}: {position}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="camera-feed">
        <h2>Camera Feed</h2>
        <div className="remote-desktop">
          <iframe src="http://49.37.154.9:3398" title="Remote Desktop" className="remote-desktop-iframe" />
        </div>
        <video ref={videoRef} autoPlay playsInline className="video-feed" />
      </div>
    </div>
  );
};

export default App;
