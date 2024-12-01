import React from 'react';

const styles = {
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  },
  text: {
    fontSize: '20px',
    color: '#2563eb'
  }
};

function LoadingSpinner() {
  return (
    <div style={styles.spinner}>
      <p style={styles.text}>Loading...</p>
    </div>
  );
}

export default LoadingSpinner;