
const CLIENT_ID = import.meta.env.VITE_CAKTO_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CAKTO_CLIENT_SECRET;

// Use proxy in development to avoid CORS errors
const BASE_URL = import.meta.env.DEV 
  ? '/cakto-proxy' 
  : (import.meta.env.VITE_CAKTO_API_URL || 'https://api.cakto.com.br');

const API_URL = `${BASE_URL}/public_api`; 

// --- Debug Helper ---
const log = (msg: string, data?: any) => {
  console.log(`[Cakto Service] ${msg}`, data || '');
};

interface CaktoAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface CreateOrderParams {
  customer: {
    name: string;
    email: string;
    document?: string;
    phone?: string;
  };
  items: Array<{
    title: string;
    unit_price: number;
    quantity: number;
    tangible: boolean;
  }>;
}

interface GenerateCheckoutLinkParams {
  offerId: string; // The code from the offer (e.g. from listOffers)
  customer: {
    name: string;
    email: string;
    document?: string; // CPF/CNPJ
    phone?: string;
  };
  coupon?: string;
}

export const caktoService = {
  // 1. Authenticate and get Access Token
  async authenticate(): Promise<string> {
    log("Iniciando autenticação...");
    
    if (!CLIENT_ID || !CLIENT_SECRET) {
      log("ERRO: Credenciais não encontradas no .env");
      throw new Error("Credenciais da Cakto não configuradas (CLIENT_ID/SECRET)");
    }

    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);

    try {
      log(`Fazendo POST em ${BASE_URL}/public_api/token/`);
      const response = await fetch(`${BASE_URL}/public_api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: params,
      });

      if (!response.ok) {
        const errorText = await response.text();
        log("Falha na autenticação", { status: response.status, body: errorText });
        throw new Error(`Cakto Auth failed (${response.status}): ${errorText}`);
      }

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        log("Erro: Resposta não é JSON (possível erro de proxy)", text.substring(0, 100));
        throw new Error("API retornou HTML em vez de JSON. Verifique se o servidor foi reiniciado.");
      }

      const data: CaktoAuthResponse = await response.json();
      log("Autenticação com sucesso!");
      return data.access_token;
    } catch (error) {
      console.error('Cakto Auth Error:', error);
      throw error;
    }
  },

  // 2. List Products (helps finding the Product ID)
  async listProducts() {
    log("Listando produtos...");
    try {
      const token = await this.authenticate();
      const response = await fetch(`${API_URL}/products/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      log("Produtos encontrados:", data);
      return data;
    } catch (error) {
      console.error('Cakto List Products Error:', error);
      throw error;
    }
  },

  // 3. List Offers (helps finding the Offer ID for the checkout link)
  async listOffers(params?: { productId?: string; search?: string }) {
    log("Listando ofertas...", params);
    try {
      const token = await this.authenticate();
      
      // Handle relative URLs (proxy) by adding window.location.origin
      const baseUrl = API_URL.startsWith('http') ? API_URL : `${window.location.origin}${API_URL}`;
      const url = new URL(`${baseUrl}/offers/`);
      
      if (params?.productId) url.searchParams.append('product', params.productId);
      if (params?.search) url.searchParams.append('search', params.search);
      
      const response = await fetch(url.toString(), {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      log("Ofertas encontradas:", data);
      return data;
    } catch (error) {
      console.error('Cakto List Offers Error:', error);
      throw error;
    }
  },

  // 4. Generate Checkout Link (No API call needed if you have the ID)
  generateCheckoutLink(params: GenerateCheckoutLinkParams): string {
    const { offerId, customer, coupon } = params;
    
    // Base checkout URL
    const baseUrl = `https://pay.cakto.com.br/${offerId}`;
    const url = new URL(baseUrl);

    // Append pre-fill parameters
    if (customer.name) url.searchParams.append('name', customer.name);
    if (customer.email) {
      url.searchParams.append('email', customer.email);
      url.searchParams.append('confirmEmail', customer.email);
    }
    if (customer.document) url.searchParams.append('cpf', customer.document);
    if (customer.phone) url.searchParams.append('phone', customer.phone);
    if (coupon) url.searchParams.append('coupon', coupon);

    log("Link de checkout gerado:", url.toString());
    return url.toString();
  },

  // 5. Adapter for AuthDialog compatibility
  async createCheckout(params: CreateOrderParams) {
    // Get Offer ID from environment or use a placeholder
    let offerId = import.meta.env.VITE_CAKTO_OFFER_ID;
    
    if (!offerId) {
       log("VITE_CAKTO_OFFER_ID não definido. Buscando oferta 'Vision' na API...");
       try {
         const offers = await this.listOffers({ search: "Vision" });
         if (offers.results && offers.results.length > 0) {
            // Tenta pegar o código da oferta (code) ou id
            const bestOffer = offers.results[0];
            offerId = bestOffer.code || bestOffer.id;
            log(`Oferta encontrada automaticamente: ${bestOffer.name} (Code: ${offerId})`);
            console.warn(`SUGESTÃO: Adicione VITE_CAKTO_OFFER_ID=${offerId} no seu arquivo .env`);
         }
       } catch (err) {
         log("Falha ao buscar oferta automaticamente.", err);
       }
    }

    if (!offerId) {
       throw new Error("ID da oferta não configurado e não encontrado automaticamente. Adicione VITE_CAKTO_OFFER_ID no .env");
    }

    const link = this.generateCheckoutLink({
      offerId,
      customer: params.customer
    });

    // Return structure expected by AuthDialog
    return { checkout_url: link, link, status: 'pending' };
  }
};
