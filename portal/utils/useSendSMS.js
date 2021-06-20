import { useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import axios from 'axios';

export const useSendSMS = (msg, contactNumber) => {    
    const { addToast } = useToasts();
    useEffect(() => {
      async function send() {
        try {
            const response = await axios({
                method: 'POST',
                url: `${process.env.NEXT_PUBLIC_API_URL}/sms`,
                data: {
                    contactNumber: contactNumber,
                    msg: msg
                    }
                });
                    
            if(response.data?.error) addToast(response.data.error, { appearance: 'error'})
            else if(response.data?.success) addToast(response.data.success, { appearance: 'success'});   
        } 
        catch (err) {
            addToast(err.message, { appearance: 'error'})
        }   
    }
        
    send();    
    }, []);
}