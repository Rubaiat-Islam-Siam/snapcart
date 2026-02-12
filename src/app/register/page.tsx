"use client"
import RegistrationForm from '@/src/Components/RegistrationForm'
import Welcome from '@/src/Components/Welcome'
import React, { useState } from 'react'

const Register = () => {
  const [step,setStep] = useState(1)
  return (
    <div>
      {step==1 ?<Welcome nextStep={setStep}/> : <RegistrationForm prevStep={setStep}/> }
      
    </div>
  )
}

export default Register
