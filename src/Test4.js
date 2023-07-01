import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://192.168.18.159:9090');
console.log(socket)
socket.on('error', (error) => {
  console.error('WebSocket error:', error);
});
const RoverControlApp = () => {
  const [linearSpeed, setLinearSpeed] = useState(0);
  const [angularSpeed, setAngularSpeed] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Capture keyboard inputs and set the corresponding speeds
      switch (event.key) {
        case 'ArrowUp':
          setLinearSpeed(1); // Increase linear speed
          break;
        case 'ArrowDown':
          setLinearSpeed(-1); // Decrease linear speed (reverse)
          break;
        case 'ArrowLeft':
          setAngularSpeed(1); // Increase angular speed (turn left)
          break;
        case 'ArrowRight':
          setAngularSpeed(-1); // Decrease angular speed (turn right)
          break;
        default:
          break;
      }
    };

    const handleKeyUp = () => {
      // Stop the rover when the key is released
      setLinearSpeed(0);
      setAngularSpeed(0);
    };

    // Add event listeners for keydown and keyup
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Clean up the event listeners on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Publish the command to the cmd_vel topic in ROS
  useEffect(() => {
    socket.emit('roverCommand', { linearSpeed, angularSpeed });
  }, [linearSpeed, angularSpeed]);

  return (
    <div>
      <h1>Rover Control</h1>
      <p>Use arrow keys to control the rover.</p>
    </div>
  );
};

export default RoverControlApp;
