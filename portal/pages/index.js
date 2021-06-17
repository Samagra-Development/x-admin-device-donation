import Image from 'next/image'
import Link from 'next/link'
import Layout from '../components/layout'
import styles from '../styles/Home.module.css'
import config from '../config';

export default function Home() {
  return (
    <Layout>
        <div className={styles.grid}>
          <a href={config.donate_device_form} target="_blank" rel="noopener noreferrer" className='card'>
            <h2>Donate &#47; दान &rarr;</h2>
            <p>I want to donate a device &#47;<br/> मुझे फ़ोन दान करना है </p>
          </a>

          <Link href="/request">
            <div className='card'>
              <h2>Request &#47; निवेदन &rarr;</h2>
              <p>I want to request a device via UDISE &#47;<br/> मुझे UDISE के द्वारा फ़ोन का निवेदन करना है </p>
            </div>
          </Link>
                  
          <a
            href="#"
            className='card'
          >            
            <h2>Track &#47; ट्रैक &rarr;</h2>
            <p>I want to track my device &#47;<br/> मुझे फ़ोन ट्रैक करना है </p>
          </a>

          <Link href="/admin">
            <div className='card'>
              <h2>Login &#47; लॉग इन &rarr;</h2>
              <p>I am a state official &#47;<br/> मैं राज्य में प्रभारी हूँ  </p>
            </div>
          </Link>
       
        </div>      
    </Layout>
  )
}
