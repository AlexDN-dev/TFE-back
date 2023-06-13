// websocket.js
const WebSocket = require('ws');

class WebSocketManager {
    static userConnections = new Map();

    static handleWebSocketConnection(server) {
        const wss = new WebSocket.Server({ server });

        wss.on('connection', (socket) => {

            socket.on('message', async (message) => {

                try {
                    const data = JSON.parse(message);
                    const userId = data.userId;

                    WebSocketManager.userConnections.set(userId, socket);
                } catch (error) {
                    console.error('Erreur lors du traitement du message:', error);
                }
            });

            socket.on('close', () => {
                // Gérer la suppression de l'association utilisateur-connexion lorsque la connexion est fermée
                WebSocketManager.userConnections.forEach((value, key) => {
                    if (value === socket) {
                        WebSocketManager.userConnections.delete(key);
                    }
                });
            });
        });
    }

    static async sendNotificationToUser(userId, message) {
        const socket = WebSocketManager.userConnections.get(userId);
        if (socket) {
            await new Promise((resolve) => {
                socket.send(message, (error) => {
                    if (error) {
                        console.error('Erreur lors de l\'envoi de la notification:', error);
                    } else {
                        console.log('Notification envoyée avec succès');
                    }
                    resolve();
                });
            });
        }
    }
}

module.exports = WebSocketManager;