import Image from 'next/image'
import { useState } from 'react'
import Layout from '../components/layout'
import Login from '../components/login/login'
import styles from '../styles/Login.module.css'

export default function LoginWrapper() {    
    const [selectedPersona, setSelectedPersona] = useState(null);
    const personas = [        
        { consonant: true, en: 'school head', hi: 'स्कूल प्रमुख', applicationId: process.env.NEXT_PUBLIC_FUSIONAUTH_SCHOOL_APP_ID, redirectUrl: process.env.NEXT_PUBLIC_REQUEST_DEVICE_FORM_URL },
        { consonant: false, en: 'official', hi: 'अधिकारी', applicationId: process.env.NEXT_PUBLIC_FUSIONAUTH_STATE_APP_ID, redirectUrl: `admin#/${process.env.NEXT_PUBLIC_DONATE_DEVICE_ADMIN_PATH}`}
        // { consonant: false, en: 'operator', hi: 'संचालक', applicationId: process.env.NEXT_PUBLIC_FUSIONAUTH_OPERATOR_APP_ID, redirectUrl: `admin#/${process.env.NEXT_PUBLIC_DONATE_DEVICE_ADMIN_PATH}`}        
    ]  
    if(selectedPersona) {
        return <Layout>
                    <Login persona={selectedPersona}></Login>
                </Layout>             
    }     

    return (
        <Layout>
        <>                    
        <h2 className='text-center'>Login &#47; लॉग इन</h2>
        <div className={`${styles.grid} ${styles['grid-two']}`}>
            {personas.map((persona, index) => 
            <div onClick={() => { setSelectedPersona(persona) }} key={index} className={`card`}>
                <h2 className={'capitalize'}>{persona.en} &#47; <br/>{persona.hi}&rarr;</h2>
                <p>I am a{persona.consonant ? '' : 'n'} {persona.en}<br/> मैं राज्य में {persona.hi} हूँ </p>
            </div>                                                          
            )}
        </div>
        </>
    </Layout>
        )                   
}