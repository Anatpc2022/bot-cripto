import { Agent, webSearchTool, run, tool } from "@openai/agents";
import { z } from "zod";
import RiberBot from "./riberBot.js";
import logger from "./utils/logger.js";
import jwt from "jsonwebtoken";

const LOGS = process.env.AI_LOGS === "true";

const AGENT_INSTRUCTIONS = `
    Você é um analista profissional de investimentos e trader de criptomoedas, especializado no mercado Binance Spot. 
    
    Suas tarefas são:
    - fornecer conselhos de investimentos e de trading em criptoativos;
    - ensinar sobre indicadores técnicos de mercado e como juntá-los para ter bons resultados em compras e vendas;
    - fazer análise fundamentalista com base nos ativos que o usuário solicitar, pode usar sites como CoinMarketCap.com e CoinGecko.com;
    - fazer análise técnica com base em dados de mercado, pode usar o site TradingView.com;
    - fazer análise gráfica com base nas imagens fornecidas pelo usuário (solicitar imagem do gráfico sempre que ele quiser que você analise o gráfico de um ativo);
    - na análise gráfica, sempre confirme o ativo que está analisando e sugira melhores pontos de entrada e saída, valores de suporte e resistência e se há tendência de baixa ou de alta no curto e médio prazos;
    - quando o usuário lhe enviar mais de uma imagem e pedir que as compare, veja qual criptoativo possui as melhores oportunidades e então retorne para ele sua escolha e porquê;
    
    Suas regras de seleção de criptoativos são:
    - diversificar a carteira através de investimentos, mas mantendo sempre a dominância do Bitcoin como principal criptoativo de longo prazo;
    - sempre que na relação risco-retorno o risco estiver muito alto, avisar e priorizar ganhos menores, mas mais seguros;
    - memecoins devem ter baixa prioridade na seleção de ativos;
    
    O formato de saída das suas recomendações deve ser objetivo e limpo, com até 30 palavras em cada recomendação e organizando o resultado em listas (bullet points), sempre que os dados forem propícios a isso. Não usar HTML, apenas Markdown.
    Não use linguajar exagerado ou emocionado, sem interjeições, seja profissional.
`;

const getTickerTool = tool({
  name: "get_ticker",
  description: `
Obtém dados de mercado de um ticker da Binance Spot.

Sempre utilize esta ferramenta antes de buscar informações na Internet quando o usuário solicitar:
- preço atual;
- abertura, fechamento, máxima ou mínima;
- volume;
- variação de preço ou percentual.

A Internet deve ser utilizada apenas para informações que esta ferramenta não fornece, como notícias, análise fundamentalista, projetos, regulamentação ou eventos do mercado.

Quando uma linha começar com "Token:", extraia o token e desconsidere essa linha na análise.

O usuário deve informar um par de moedas, por exemplo:
BTCUSDT, BTC-USDT ou BTC/USDT.

Se houver dúvida sobre o símbolo correto do par, solicite esclarecimento.

Campos retornados:
- priceChange: variação de preço em 24h;
- percentChange: variação percentual em 24h;
- averagePrice: preço médio em 24h;
- close: preço atual;
- open: preço de abertura;
- high: máxima em 24h;
- low: mínima em 24h;
- volume: volume da moeda base;
- quoteVolume: volume da moeda de cotação.
`,
  parameters: z.object({ symbol: z.string(), token: z.string() }),
  async execute({ symbol, token }) {
    symbol = symbol.toUpperCase().replace("-", "").replace("/", "").trim();
    const memory = await RiberBot.getInstance().getMemory(symbol, "TICKER");
    if (LOGS)
      logger("RiberBotAI", `get_ticker: ${JSON.stringify(memory.current)}`);
    return memory.current;
  },
});

const getCoinTool = tool({
  name: "get_coin",
  description: `
        Obtém saldo de uma criptomoeda (coin) na carteira do usuário. 
        Quando iniciar uma linha da instrução com a descrição "Token:", pegue o token. Descarte essa primeira linha do seu raciocínio após pegar a informação do token.
        Usuário deve preferencialmente informar a sigla da criptomoeda. Exemplo: BTC
        Se o usuário informar o nome da moeda por extenso e você ficar na dúvida sobre a sigla para ela, pergunte ao usuário.
        Se você não conseguir identificar o token logo na primeira linha, peça ao usuário.
    `,
  parameters: z.object({ coin: z.string(), token: z.string() }),
  async execute({ coin, token }) {
    const decoded = jwt.decode(token.trim());
    const memory = await RiberBot.getInstance().getMemory(
      coin.toUpperCase().trim(),
      "WALLET_" + decoded.id,
    );
    if (LOGS) logger("RiberBotAI", `get_coin: ${memory}`);
    return parseFloat(memory);
  },
});

const analyzeChartTool = tool({
  name: "analyze_chart",
  description: `
        Analisa anexos de imagens de gráfico de velas enviadas pelo usuário.
        Quando iniciar uma linha da instrução com a descrição "Token:", pegue o token para uso futuro em tools que precisem de um token. Desconsidere esta linha para análise restante.
        Quando iniciar uma linha da instrução com a descrição "Imagens:", pegue o array de imagens e use ele como campo filePaths da função. Desconsidere esta linha para análise restante.
        A imagem enviada é sempre de um gráfico de velas para uma criptomoeda, você deve analisá-lo buscando as seguintes informações:
        
        - symbol: par de moedas do gráfico;
        - interval: tempo gráfico das velas;
        - support: suporte;
        - resistance: resistência;
        - high: valor máximo no período;
        - low: valor mínimo no período;
        - trend: tendência de baixa, de alta ou de seguir lateral (estável) no curto prazo;
        - misc: outras informações e oportunidades que julgar relevantes;
        
        Se o usuário não informar nenhuma instrução adicional, apenas devolva as informações coletadas acima.
        Se o usuário solicitar mais alguma coisa nas instruções, realizar elas em cima dos dados obtidos na imagem (principalmente os dados citados acima).
        Se o usuário fornecer mais de uma imagem, busque nas instruções o comparativo que deve fazer. Se ele não passar outras instruções, peça a ele.
        Na sua resposta, você sempre deve incluir a informação de qual par de moedas está sendo apresentado na imagem e o tempo gráfico, para o usuário ter certeza que você compreendeu a imagem.
    `,
  parameters: z.object({
    text: z.string(),
    filePaths: z.array(z.string()),
    token: z.string(),
  }),
  async execute({ text, filePaths, token }) {
    if (LOGS) logger("RiberBotAI", `analyze_chart: "${text}", ${filePaths}`);
  },
});

let thread = [{ role: "system", content: AGENT_INSTRUCTIONS }];

const agent = new Agent({
  name: "RiberBot AI",
  model: process.env.AI_MODEL,
  tools: [webSearchTool(), getTickerTool, getCoinTool],
});

async function chat(text, token, filePaths) {
  if (filePaths && filePaths.length)
    thread.push({
      role: "user",
      content: `Token: ${token}\n\nImagens: ${filePaths}\n\n${text}`,
    });
  else thread.push({ role: "user", content: `Token: ${token}\n\n${text}` });

  const result = await run(agent, thread);
  thread = result.history;

  return result.finalOutput;
}

async function cleanChat() {
  thread = [{ role: "system", content: AGENT_INSTRUCTIONS }];
}

export default {
  chat,
  cleanChat,
};
