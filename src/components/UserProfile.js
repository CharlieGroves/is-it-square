import React from 'react';

export default function UserProfile({
    match: {
      params: { id },
    },
  }) {
    return (
        <div className='text-white'>
            <h1>User Profile id: {id}</h1>
        </div>
    );
}