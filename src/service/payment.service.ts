import axios from 'axios'
import configuration from '../config/config'
import {CustomError} from '../exceptions/customError.error'

// define the structure of response returned by paystack's initialize payment endpoint

export interface PaymentIntializationResponse {
    authorization_url: string;
    reference: string;
};

export interface PaymentService{
    initializePayment(email:string, amount:number, metadata?:object):Promise<PaymentIntializationResponse>
}

// Implementation of paystack service using paystack api
export class PaymentServiceImple implements PaymentService{
    async initializePayment(email: string, amount: number, metadata: object = {}): Promise<PaymentIntializationResponse> {
        try {
            const response = await axios.post('https://api.paystack.co/transaction/initialize',
                {
                    email,
                    amount:amount * 100, // to convert to kobo if currency is in naira
                    callback_url: configuration.paystack.callbackUrl,
                    metadata,
                },
                {
                    headers:{
                        Authorization:`Bearer ${configuration.paystack.secretKey}`,
                        "Content-Type": "application/json"
                    },
                },
            )

            // check response status
            if(!response.data.status){
                throw new CustomError(400, response.data.message || 'Failed to intialize response')
            }

            return response.data.data as PaymentIntializationResponse;
        } catch (error:any) {
            console.error('Error in PaymentService.initializePayment: ', error.response?.data || error.message);
            throw new CustomError(400, 'failed to initialize payment ' )
            
        }
    }
    
}