import useWebSocket from "react-use-websocket";

function Toast() {
  useWebSocket(import.meta.env.VITE_WS_URL, {
    onOpen: () => console.log("Connected to App WS"),
    onMessage: (message) => {
      if (!message) return;
      const data = JSON.parse(message.data);
      if (data && data.notification && data.notification.text) {
        const notyf = new window.Notyf({
          position: { x: "right", y: "top" },
          duration: 0,
          types: [
            {
              type: "success",
              background: "green",
              dismissible: true,
            },
            {
              type: "error",
              background: "red",
              dismissible: true,
            },
          ],
        });

        notyf.open({
          type: data.notification.type,
          message: data.notification.text,
        });
      }
    },
    queryParams: { token: localStorage.getItem("token") },
    onError: (err) => console.error(err),
    shouldReconnect: () => true,
    reconnectInterval: 60000,
  });

  return <></>;
}

export default Toast;
