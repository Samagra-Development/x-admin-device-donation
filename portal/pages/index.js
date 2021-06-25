import Image from 'next/image'
import Link from 'next/link'
import Layout from '../components/layout'
import styles from '../styles/Home.module.css'
import config from '../components/config';

export default function Home() {
  return (
    <Layout>
        <div className={styles.grid}>
          {/* <a href={process.env.NEXT_PUBLIC_DONATE_DEVICE_FORM_URL} target="_blank" rel="noopener noreferrer" className='card'>
            <h2>Donate your smartphone &#47; <br/> अपना स्मार्टफ़ोन दान करें  &#10230;</h2>            
          </a> */}
          {config.homepageCards.map((card) => {

          return ( <Link href={card.target}>     
            <div className='card'>     
              <span className={`material-icons ${styles.icon} ${styles[card.colour]}`}>{card.icon}</span>           
              <h2> {card.title.en} &#47;<br/> {card.title.hi}  &#10230;</h2>                      
            </div>
          </Link>)
          })
        }
               
        </div>      
    </Layout>
  )
}
