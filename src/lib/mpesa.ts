// M-Pesa STK Push Integration
export interface MPesaConfig {
  consumerKey: string;
  consumerSecret: string;
  shortcode: string;
  passkey: string;
  environment: 'sandbox' | 'production';
}

export interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
  callbackURL: string;
}

export interface STKPushResponse {
  success: boolean;
  checkoutRequestID?: string;
  merchantRequestID?: string;
  responseCode?: string;
  responseDescription?: string;
  customerMessage?: string;
  error?: string;
}

export class MPesaService {
  private config: MPesaConfig;
  private baseURL: string;

  constructor(config: MPesaConfig) {
    this.config = config;
    this.baseURL = config.environment === 'sandbox' 
      ? 'https://sandbox.safaricom.co.ke'
      : 'https://api.safaricom.co.ke';
  }

  // Generate OAuth token
  private async getAccessToken(): Promise<string> {
    const credentials = btoa(`${this.config.consumerKey}:${this.config.consumerSecret}`);
    
    const response = await fetch(`${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`OAuth error: ${data.errorMessage || 'Failed to get access token'}`);
    }

    return data.access_token;
  }

  // Generate password for STK Push
  private generatePassword(): { password: string; timestamp: string } {
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const password = btoa(`${this.config.shortcode}${this.config.passkey}${timestamp}`);
    
    return { password, timestamp };
  }

  // Initiate STK Push
  async initiateSTKPush(request: STKPushRequest): Promise<STKPushResponse> {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();
      
      // Format phone number (remove + and ensure it starts with 254)
      const formattedPhone = request.phoneNumber.replace(/^\+/, '').replace(/^0/, '254');
      
      const payload = {
        BusinessShortCode: this.config.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: request.amount,
        PartyA: formattedPhone,
        PartyB: this.config.shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: request.callbackURL,
        AccountReference: request.accountReference,
        TransactionDesc: request.transactionDesc,
      };

      const response = await fetch(`${this.baseURL}/mpesa/stkpush/v1/processrequest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`STK Push error: ${data.errorMessage || data.ResponseDescription || 'Unknown error'}`);
      }

      return {
        success: true,
        checkoutRequestID: data.CheckoutRequestID,
        merchantRequestID: data.MerchantRequestID,
        responseCode: data.ResponseCode,
        responseDescription: data.ResponseDescription,
        customerMessage: data.CustomerMessage
      };
    } catch (error) {
      console.error('STK Push error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Query STK Push status
  async querySTKPushStatus(checkoutRequestID: string) {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();

      const payload = {
        BusinessShortCode: this.config.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID,
      };

      const response = await fetch(`${this.baseURL}/mpesa/stkpushquery/v1/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      return {
        success: response.ok,
        resultCode: data.ResultCode,
        resultDesc: data.ResultDesc,
        merchantRequestID: data.MerchantRequestID,
        checkoutRequestID: data.CheckoutRequestID,
        data: data
      };
    } catch (error) {
      console.error('STK Push query error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Helper functions
export const formatKenyanPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Handle different formats
  if (digits.startsWith('254')) {
    return `+${digits}`;
  } else if (digits.startsWith('0')) {
    return `+254${digits.slice(1)}`;
  } else if (digits.length === 9) {
    return `+254${digits}`;
  }
  
  return phoneNumber; // Return original if can't format
};

export const isValidKenyanPhoneNumber = (phoneNumber: string): boolean => {
  const formatted = formatKenyanPhoneNumber(phoneNumber);
  const kenyanPhoneRegex = /^\+2547[0-9]{8}$/;
  return kenyanPhoneRegex.test(formatted);
};

export const calculateExpiryDate = (plan: string): string => {
  const now = new Date();
  
  switch (plan.toLowerCase()) {
    case 'weekly':
    case 'weekly plan':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    case 'monthly':
    case 'monthly premium':
      return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString();
    
    case 'free':
    case 'free trial':
      return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
    
    default:
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  }
};

// Plan pricing configuration
export const planPricing = {
  'Free Trial': { amount: 0, duration: 3, period: 'days' },
  'Weekly Plan': { amount: 50, duration: 1, period: 'week' },
  'Monthly Premium': { amount: 150, duration: 1, period: 'month' }
};

export const getPlanAmount = (planName: string): number => {
  return planPricing[planName as keyof typeof planPricing]?.amount || 0;
};