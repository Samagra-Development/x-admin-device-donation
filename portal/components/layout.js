import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react';
import styles from '../styles/layout.module.css'


export default function layout ({ children, home })  {
    const transitionStages = {
        FADE_OUT: 'fadeOut',
        FADE_IN: 'fadeIn'
    }

    const [activeChildren, setActiveChildren] = useState(children);
    const [transitionStage, setTransitionStage] = useState(transitionStages.FADE_OUT);

    const compareElem = (a, b) => {
        return a.type.name === b.type.name
    }

    const transitionEnd = () => {
        if(transitionStage === transitionStages.FADE_OUT) {
            setActiveChildren(children);
            setTransitionStage(transitionStages.FADE_IN);
        }
    }

    useEffect(() => {
        setTransitionStage(transitionStages.FADE_IN);
      }, []);

    useEffect( () => {
        if(!compareElem(children, activeChildren)) setTransitionStage(transitionStages.FADE_OUT);
    }, [children, activeChildren])
    
    return (
        <>
        <Head>
            <title>समर्थ हिमाचल</title>
        </Head>
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>
            बच्चों का सहारा, <br/>फ़ोन हमारा
                </h1>
            </header>
            <main onTransitionEnd={() => { transitionEnd(); }} className={`${styles.main} ${styles[transitionStage]}`}>{activeChildren}</main>
            <footer className={styles.footer}>      
                <span className={styles.logo}>
                    <Image src="/govt_of_hp_logo.png" alt="HP Govt Logo" width={120} height={80} />
                </span>        
            </footer>            
        </div>
        </>
    )
}