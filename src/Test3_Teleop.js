import React, { useEffect } from 'react';
import ROSLIB from 'roslib';

const RoverControl = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ros = new ROSLIB.Ros({
        url: 'wss://fb44-106-195-67-231.ngrok-free.app/',
      });

      const cmdVelTopic = new ROSLIB.Topic({
        ros: ros,
        name: '/cmd_vel',
        messageType: 'geometry_msgs/Twist',
      });

      const handleKeyDown = (event) => {
        let linear = { x: 0, y: 0, z: 0 };
        let angular = { x: 0, y: 0, z: 0 };

        switch (event.key) {
          case 'ArrowUp':
            linear.x = 0.269;
            break;
          case 'ArrowDown':
            linear.x = -0.269;
            break;
          case 'ArrowLeft':
            angular.z = 0.269;
            break;
          case 'ArrowRight':
            angular.z = -0.269;
            break;
          default:
            break;
        }

        const twist = new ROSLIB.Message({
          linear: linear,
          angular: angular,
        });
        console.log(twist);
        cmdVelTopic.publish(twist);
      };

      const handleKeyUp = (event) => {
        // Stop the rover when a key is released
        const twist = new ROSLIB.Message({
          linear: { x: 0, y: 0, z: 0 },
          angular: { x: 0, y: 0, z: 0 },
        });

        cmdVelTopic.publish(twist);
      };

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keyup', handleKeyUp);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, []);

  return (
    <div>
      <h1>Rover Control</h1>
      <p>Use arrow keys to control the rover.</p>
    </div>
  );
};

export default RoverControl;
