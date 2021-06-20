import Image from 'next/image'
import Link from 'next/link'
import Layout from '../components/layout'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <Layout>
        <div className={styles.grid}>
          <a href={process.env.NEXT_PUBLIC_DONATE_DEVICE_FORM_URL} target="_blank" rel="noopener noreferrer" className='card'>
            <h2>Donate &#47; दान &rarr;</h2>
            <p>I want to donate a smart phone <br/> मुझे स्मार्ट फ़ोन दान करना है </p>
          </a>
               
          <a
            href="#"
            className='card'
          >            
            <h2>Track &#47; ट्रैक &rarr;</h2>
            <p>I want to track my donated device<br/> मुझे दान किया हुआ फ़ोन ट्रैक करना है </p>
          </a>

          <Link href="/login">
            <div className='card center'>
              <h2>Login &#47; लॉग इन &rarr;</h2>
              <p>I am a state functionary <br/> मैं राज्य में प्रभारी हूँ  </p>
            </div>
          </Link>
       
        </div>      
    </Layout>
  )
}
