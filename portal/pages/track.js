import Image from 'next/image'
import { useState, useEffect } from 'react'
import Layout from '../components/layout'
import Track from '../components/track/track'

export default function TrackWrapper(props) {  
        
    return (                                   
            <Layout>
                <Track></Track>
            </Layout>             
        )                   
}
