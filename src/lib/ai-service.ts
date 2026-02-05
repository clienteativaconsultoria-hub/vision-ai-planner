export interface Tactic {
  title: string;
  description: string;
}

export interface StrategicPlan {
  goal: string;
  quarters: {
    q1: string[];
    q2: string[];
    q3: string[];
    q4: string[];
  };
  monthlyFocus: string[];
  weeklyTactics: Tactic[];
}

export interface OnboardingData {
  businessModel: string;
  niche: string;
  currentStage: string;
  teamSize: string;
  mainBottleneck: string[];
  monthlyRevenue: string;
  goal2026: string;
  targetAudience: string;
  keyStrengths: string;
  marketingChannels: string;
  investmentCapacity: string;
  timeAvailability: string;
  competitors: string;
  values: string;
}

export async function generatePlan(userGoal: string, context?: OnboardingData): Promise<StrategicPlan> {
  const apiKey = import.meta.env.VITE_COHERE_API_KEY;

  if (!apiKey) {
    console.warn("VITE_COHERE_API_KEY not found. Using mock response.");
    // Simulate delay for mock
    await new Promise(resolve => setTimeout(resolve, 3000));
    return {
      goal: userGoal,
      quarters: {
        q1: ["Fundação e Pesquisa", "MVP", "Primeiros Clientes"],
        q2: ["Otimização", "Escala Inicial", "Contratação"],
        q3: ["Expansão de Canais", "Novos Produtos", "Parcerias"],
        q4: ["Consolidação", "Retenção", "Planejamento 2027"]
      },
      monthlyFocus: Array(12).fill("Foco do Mês"),
      weeklyTactics: Array(52).fill({ title: "Ação Tática da Semana", description: "Descrição detalhada da ação tática para esta semana." })
    };
  }

  const contextString = context ? `
    CONTEXTO DO USUÁRIO:
    - Modelo de Negócio: ${context.businessModel}
    - Nicho: ${context.niche}
    - Estágio Atual: ${context.currentStage}
    - Tamanho do Time: ${context.teamSize}
    - Faturamento Atual: ${context.monthlyRevenue}
    - Principais Gargalos: ${Array.isArray(context.mainBottleneck) ? context.mainBottleneck.join(", ") : context.mainBottleneck}
    - Público Alvo: ${context.targetAudience}
    - Diferenciais: ${context.keyStrengths}
    - Canais de Marketing: ${context.marketingChannels}
    - Capacidade de Investimento: ${context.investmentCapacity}
    - Disponibilidade de Tempo: ${context.timeAvailability}
    - Concorrentes: ${context.competitors}
    - Valores/Não-Negociáveis: ${context.values}
  ` : "";

  const systemPrompt = `
    Você é um estrategista de negócios de elite.
    ${contextString}
    O usuário fornecerá uma meta para 2026.
    Você deve retornar um JSON ESTRITO com a seguinte estrutura:
    {
      "goal": "A meta do usuário",
      "quarters": {
        "q1": ["Foco 1", "Foco 2", "Foco 3"],
        "q2": ["...", ...],
        "q3": ["...", ...],
        "q4": ["...", ...]
      },
      "monthlyFocus": ["Jan: ...", "Fev: ...", ...],
      "weeklyTactics": [
        { "title": "Semana 1: ...", "description": "Detalhes práticos de como executar..." },
        { "title": "Semana 2: ...", "description": "..." },
        ...
      ] (52 itens)
    }
    Não retorne nada além do JSON. Sem markdown, sem explicações.
  `;

  try {
    const response = await fetch('https://api.cohere.com/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Client-Name': 'Vision2026'
      },
      body: JSON.stringify({
        model: 'command-r-08-2024',
        message: userGoal,
        preamble: systemPrompt,
        temperature: 0.3,
        max_tokens: 4000, // Aumentado para garantir resposta completa
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.text;
    
    // Extract JSON from text (in case of markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : text;

    return JSON.parse(jsonString) as StrategicPlan;

  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendChatMessage(message: string, history: ChatMessage[]): Promise<string> {
  const apiKey = import.meta.env.VITE_COHERE_API_KEY;

  if (!apiKey) {
    console.warn("VITE_COHERE_API_KEY not found. Using mock response.");
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "Estou operando em modo de demonstração (sem chave de API). Como posso ajudar com sua estratégia hoje?";
  }

  const chatHistory = history.map(msg => ({
    role: msg.role === 'user' ? 'USER' : 'CHATBOT',
    message: msg.content
  }));

  try {
    const response = await fetch('https://api.cohere.com/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Client-Name': 'Vision2026'
      },
      body: JSON.stringify({
        model: 'command-r-08-2024',
        message: message,
        chat_history: chatHistory,
        preamble: "Você é um consultor de negócios experiente e focado em execução. Ajude o usuário a alcançar suas metas de 2026. Seja direto, prático e motivador.",
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.text;

  } catch (error) {
    console.error("Error sending message:", error);
    return "Desculpe, tive um problema ao processar sua mensagem. Tente novamente.";
  }
}

export async function recalculatePlan(
  currentPlan: StrategicPlan, 
  completedWeeks: number[], 
  context?: OnboardingData,
  newGoal?: string,
  contextUpdates?: string
): Promise<StrategicPlan> {
  const apiKey = import.meta.env.VITE_COHERE_API_KEY;

  if (!apiKey) {
    console.warn("VITE_COHERE_API_KEY not found. Using mock response.");
    await new Promise(resolve => setTimeout(resolve, 2000));
    return currentPlan; // Return same plan in mock
  }

  const goalToUse = newGoal || currentPlan.goal;
  
  const updatesString = contextUpdates ? `
    ATUALIZAÇÕES DE CONTEXTO (O QUE MUDOU):
    ${contextUpdates}
  ` : "";

  const contextString = context ? `
    CONTEXTO ORIGINAL DO USUÁRIO:
    - Modelo de Negócio: ${context.businessModel}
    - Nicho: ${context.niche}
    - Estágio Atual: ${context.currentStage}
    - Tamanho do Time: ${context.teamSize}
    - Faturamento Atual: ${context.monthlyRevenue}
    - Principais Gargalos: ${Array.isArray(context.mainBottleneck) ? context.mainBottleneck.join(", ") : context.mainBottleneck}
    - Público Alvo: ${context.targetAudience}
    - Diferenciais: ${context.keyStrengths}
    - Canais de Marketing: ${context.marketingChannels}
    - Capacidade de Investimento: ${context.investmentCapacity}
    - Disponibilidade de Tempo: ${context.timeAvailability}
    - Concorrentes: ${context.competitors}
    - Valores/Não-Negociáveis: ${context.values}
  ` : "";

  const systemPrompt = `
    Você é um estrategista de negócios de elite.
    ${contextString}
    
    ${updatesString}

    O usuário tem uma meta para 2026: "${goalToUse}".
    (Anteriormente era: "${currentPlan.goal}")
    
    SITUAÇÃO ATUAL:
    O usuário já completou ${completedWeeks.length} semanas de execução.
    Precisamos RECALCULAR a rota para as semanas restantes considerando o NOVO CONTEXTO e/ou NOVA META.
    
    Mantenha o histórico do que já passou (semanas concluídas), mas otimize agressivamente as próximas semanas.
    
    Você deve retornar um JSON ESTRITO com a estrutura completa do plano atualizado:
    {
      "goal": "${goalToUse}",
      "quarters": { ... },
      "monthlyFocus": [ ... ],
      "weeklyTactics": [ ... ] (52 itens)
    }
    
    IMPORTANTE:
    1. As semanas que já passaram (índices ${completedWeeks.join(', ')}) devem ser mantidas ou levemente ajustadas para consistência.
    2. As semanas futuras devem ser otimizadas para a nova meta/contexto.
    3. Não retorne nada além do JSON.
  `;

  try {
    const response = await fetch('https://api.cohere.com/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Client-Name': 'Vision2026'
      },
      body: JSON.stringify({
        model: 'command-r-08-2024',
        message: "Recalcular rota do plano estratégico.",
        preamble: systemPrompt,
        temperature: 0.4,
      }),
    });

    const data = await response.json();
    let jsonStr = data.text;
    
    // Limpeza básica do JSON
    jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Erro ao recalcular plano:", error);
    throw error;
  }
}
