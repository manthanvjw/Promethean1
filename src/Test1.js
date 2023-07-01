import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './style.css';

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

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        handleRoverDirectionChange('Forward');
        break;
      case 'ArrowDown':
        handleRoverDirectionChange('Backward');
        break;
      case 'ArrowLeft':
        handleRoverDirectionChange('Left');
        break;
      case 'ArrowRight':
        handleRoverDirectionChange('Right');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((error) => {
          // console.error('Error accessing camera:', error);
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
        <video ref={videoRef} autoPlay playsInline className="video-feed" />
      </div>
    </div>
  );
};

export default App;
