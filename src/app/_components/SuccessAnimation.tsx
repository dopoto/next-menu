"use client";

import React from 'react'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

export const SuccessAnimation = () => {
  const { width, height } = useWindowSize()
  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={180}
      recycle={false}
    />
  )
};
