// websocket.js
const WebSocket = require('ws');

class WebSocketManager {
    static userConnections = new Map();

    static handleWebSocketConnection(server) {
        const wss = new WebSocket.Server({ server });

        wss.on('connection', (socket) => {
            console.log('Nouvelle connexion WebSocket');

            socket.on('message', async (message) => {
                console.log('Message reçu du client:', message);

                try {
                    const data = JSON.parse(message);
                    const userId = data.userId;

                    // Associer l'ID de l'utilisateur à la connexion WebSocket
                    console.log("userConnections avant ajout (connexion) : " + WebSocketManager.userConnections.size)
                    WebSocketManager.userConnections.set(userId, socket);
                    console.log("userConnections après ajout (connexion) : " + WebSocketManager.userConnections.size)
                } catch (error) {
                    console.error('Erreur lors du traitement du message:', error);
                }
            });

            socket.on('close', () => {
                console.log("userConnections avant supp (déco) : " + WebSocketManager.userConnections.size)
                // Gérer la suppression de l'association utilisateur-connexion lorsque la connexion est fermée
                WebSocketManager.userConnections.forEach((value, key) => {
                    if (value === socket) {
                        WebSocketManager.userConnections.delete(key);
                    }
                });
                console.log("userConnections après supp (déco) : " + WebSocketManager.userConnections.size)
            });
        });
    }

    static async sendNotificationToUser(userId, message) {
        console.log("Liste des userConnections : " + WebSocketManager.userConnections)
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