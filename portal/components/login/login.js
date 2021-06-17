import { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import { signIn } from 'next-auth/client'
import controls from './form.config';
import styles from '../../styles/Login.module.css'

export default function Login(props) {
    const { applicationId } = props;
    const [input, setInput] = useState({});
    const [inputValidity, setInputValidity] = useState(controls.map(control => { 
        return { 
            [control.name]: false}
        }
    ));
    const [formValidity, setFormValidity] = useState(false);
        
    const handleInput = (e) => {   
        setInput({ ...input, [e.target.name]: e.target.value });        
        setInputValidity({...inputValidity, [e.target.name]: e.target.validity.valid});        
    }

    useEffect(() => {        
        let validity = controls.reduce(
                (acc, control) => acc = acc && inputValidity[control.name],
                true
            );
        setFormValidity(validity)            
        }, 
    [inputValidity])

    const { addToast } = useToasts();

    const signUserIn = async (e) => {
        e.preventDefault();                            
        const { error } = await 
            signIn('fusionauth', 
                {
                    loginId: input.username, 
                    password: input.password,
                    applicationId,
                    redirect: false
                })
        if(error) {
            addToast(error, { appearance: 'error'})
        }
    } 

    return (                                    
            <div className={styles.grid}>                
                <h2> Log in &#47; लॉग इन &rarr;</h2>
                <form className={`card ${styles.form}`} >
                    {controls.map((control) => <input 
                        key={control.name}
                        type={control.type} 
                        name={control.name} 
                        autoComplete={control.autocomplete}
                        required={control.required}
                        placeholder={control.placeholder} 
                        onChange={handleInput} />)}
                    <button disabled={!formValidity} 
                        onClick={signUserIn}
                    >
                          Fill request form / निवेदन
                    </button>                
                </form>   
            </div>           
        )   
}