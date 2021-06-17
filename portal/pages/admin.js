import Image from 'next/image'
import dynamic from 'next/dynamic'
import styles from '../styles/Home.module.css'
import { signIn, useSession } from 'next-auth/client'

const ReactAdmin = dynamic( () => import('../components/react-admin/app'), {
  ssr: false
})

const Admin = () => { 
  const [session, loading] = useSession();
  if(loading) return null;
  if(!loading && !session) {
    signIn("fusionauth");
    return null;
  }
  return <ReactAdmin />
}

export default Admin