import { useEffect, useRef, memo } from 'react';

function TradingViewWidget() {
    const container = useRef();

    useEffect(
        () => {

            // Evitar múltiplas injeções
            const existingScript = container.current.querySelector("script");
            if (existingScript) return;

            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = `
        {
          "autosize": true,
          "symbol": "BINANCE:BTCUSDT",
          "interval": "60",
          "timezone": "America/Sao_Paulo",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "withdateranges": true,
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "details": true,
          "support_host": "https://www.tradingview.com"
        }`;

            container.current.appendChild(script);

            return () => {
                if (container.current) {
                    container.current.innerHTML = "";
                }
            };
        },
        []
    );

    return (
        <div className='row'>
            <div className='col-12 mb-4'>
                <div className='card cardDark border-0 shadow' style={{ height: 520 }}>
                    <div className='card-body p-2'>
                        <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
                            <div className="tradingview-widget-container__widget divTradingView" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(TradingViewWidget);