import React from 'react'

export default function ErrorMessage({message}: {message: string | undefined}) {
  if(!message)  return <></>;

  return (
    <span className='text-red-500 -mt-2 mb-1'>{message}</span>
  )
}
