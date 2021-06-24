import Image from 'next/image'
import Link from 'next/link'
import Layout from '../components/layout'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <Layout>
        <div className={styles.grid}>
          <a href={process.env.NEXT_PUBLIC_DONATE_DEVICE_FORM_URL} target="_blank" rel="noopener noreferrer" className='card'>
            <h2>Donate your smartphone &#47; <br/> अपना स्मार्टफ़ोन दान करें  &#10230;</h2>            
          </a>

          <Link href="/track" passHref>     
            <div className='card'>            
              <h2>Track your smartphone and get your Digi Saathi certificate &#47;<br/> अपने स्मर्टफ़ोने को ट्रैक करें और अपना Digi साथी प्रशंसा पत्र लें  &#10230;</h2>              
            </div>
          </Link>

          <Link href="/#" passHref>
            <div className='card'>
              <h2>Frequently Asked Questions &#47; <br/> जानकारी &#10230;</h2>              
            </div>
          </Link>

          <Link href="/login" passHref>
            <div className='card'>
              <h2>Login for state officials &#47; <br/> राज्य के अधिकारियों के लिए लॉग इन &#10230;</h2>              
            </div>
          </Link>
       
        </div>      
    </Layout>
  )
}
