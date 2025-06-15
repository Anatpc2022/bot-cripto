import useWebSocket from "react-use-websocket";

function Toast() {
    const { lastJsonMessage } = useWebSocket(import.meta.env.VITE_WS_URL, {
        onOpen: () => console.log("Connected to App WS"),
        onMessage: () => {
            if (lastJsonMessage && lastJsonMessage.notification && lastJsonMessage.notification.text) {
                const notyf = new window.Notyf({
                    position: { x: "right", y: "top" },
                    duration: 0,
                    types: [{
                        type: "sucesso",
                        background: "green",
                        dismissible: true
                    }, {
                        type: "erro",
                        background: "red",
                        dismissible: true
                    }]
                })

                notyf.open({
                    type: lastJsonMessage.notification.type,
                    message: lastJsonMessage.notification.text
                })
            }
        },
        queryParams: { token: localStorage.getItem("token") },
        onError: (err) => console.error(err),
        shouldReconnect: () => true,
        reconnectInterval: 60000
    })

    return (<></>);
}

export default Toast;