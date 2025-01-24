'use client'

import React from 'react'
import ShareButton from '../components/ShareButton'
import { Facebook, Twitter, Linkedin, MessageCircleMore } from 'lucide-react';

const page = () => {
  return (
    <>
    <div className='bg-[#48176E] gap-3 min-h-screen w-full flex items-center justify-center text-white'>
    
     <ShareButton />
      <ShareButton label='Facebook' Icon = {Facebook} url={'www.facebook.com'} />
      <ShareButton label='Twitter' Icon = {Twitter} url={'www.x.com'} />
      <ShareButton label='Linkedin' Icon = {Linkedin} url={'www.linkedin.com'} />
      <ShareButton label='WhatsApp' Icon = {MessageCircleMore} url={'web.whatsapp.com/'} />
      </div>
    </>
  )
}

export default page