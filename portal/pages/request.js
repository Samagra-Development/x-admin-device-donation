import Image from 'next/image'
import { useSession } from 'next-auth/client'
import Layout from '../components/layout'
import Login from '../components/login/login'
import styles from '../styles/Request.module.css'

export default function Request() {
    const [session, loading] = useSession()

    if(loading) return null

    if (!loading && !session) { 
        // signIn("fusionauth")            
        return (<Layout>
            <Login applicationId={process.env.NEXT_PUBLIC_FUSIONAUTH_STATE_APP_ID} />
        </Layout>)        
    }    
    if(session) {
    return (
        <Layout>
            <div className={styles.grid}>
                <div className='card pointer'>
                <h2>Welcome, UDISE {session.username}</h2>
                <p className='center'>Fill request form &#47; निवेदन कीजिए &rarr;</p>
                </div>   
            </div>    
        </Layout>
        )   
    }
    return null;
}