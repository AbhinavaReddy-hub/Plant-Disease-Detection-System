import { useState } from 'react';
import chatbotpic from '../../images/ChatBot/chatbot.png';
import ChatBot from './ChatBot';
export default function ChatBotImage() {
    const [chatbotClicked, setChatbotClicked] = useState(false);
    return (
        <div
            className="chatbotimagesection"
        >
            <div
                className="imageSection"
                onClick={() => setChatbotClicked(true)}
                style={{ cursor: "pointer" }}
                            >
                {!chatbotClicked && <img
                    src={chatbotpic}
                    alt="Open Chatbot"
                    width={60}
                    aria-label="Click to open chatbot"
                />}
            </div>
            {chatbotClicked && (
                <ChatBot onclose={() => setChatbotClicked(false)} />
            )}
        </div>
    );
}
