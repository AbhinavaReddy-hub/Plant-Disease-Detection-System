import { useState } from 'react';
import chatbotpic from '../../images/ChatBot/chatbot.png';
import ChatBot from './ChatBot';
export default function ChatBotImage() {
    const [chatbotClicked, setChatbotClicked] = useState(false);
 console.log(chatbotClicked)
    return (
        <div
            className="chatbotimagesection"
            style={{
                height: "80vh",
                right: "2em",
                position: "fixed",
                display: "flex",
                flexDirection: "column-reverse",
            }}
        >
            <div
                className="imageSection"
                onClick={() => setChatbotClicked(true)}
                style={{ cursor: "pointer" }}
                            >
                <img
                    src={chatbotpic}
                    alt="Open Chatbot"
                    width={80}
                    aria-label="Click to open chatbot"
                />
            </div>
            {chatbotClicked && (
                <ChatBot onclose={() => setChatbotClicked(false)} />
            )}
        </div>
    );
}
