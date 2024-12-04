import ReactDOM from "react-dom";
import '../../styles/ChatBot.css';
import { RxCross1 } from "react-icons/rx";
import { IoMdSend } from "react-icons/io";
import { useEffect, useState } from "react";
import { useDarkMode } from "../DarkModeContext";
export default function ChatBot({ onclose }) {
    const { isDarkMode, setDarkMode } = useDarkMode();
    const [botChat, setBotChat] = useState("");
    const [inputFiled, setinputField] = useState("");
    const [UserChat, setUserChat] = useState("");
    const [isSubmitted, setSubmitted] = useState(false);
    //default chatbot
    useEffect(() => {
        setBotChat("Hi! How can I help you today?");
    }, []);

    // calling chatbot
    useEffect(() => {
        const fetchBotResponse = async () => {
            try {
                const response = await fetch(
                    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
                    {
                        headers: {
                            Authorization: "Bearer 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",
                            "Content-Type": "application/json",
                        },
                        method: "POST",
                        body: JSON.stringify({ inputs: UserChat, max_token: 1500 }),
                    }
                );

                const result = await response.json();
                console.log(result);
                setBotChat(() => result[0].generated_text || "No response from the bot.");
            } catch (e) {
                console.error("Error:", e);
                setBotChat(() => "An error occurred. Please try again.");
            }
        };

        if (isSubmitted) fetchBotResponse();
    }, [UserChat]);


    return ReactDOM.createPortal(
        <div className="OuterContainer">
            <div className="ChatbotContainer" style={isDarkMode ? { color: "white", backgroundColor: "#242a23" } : { color: "black" }}>
                <header className="HeaderSection" style={{ backgroundColor: isDarkMode ? "rgb(28, 46, 23)" : "" }} onClick={onclose}><RxCross1 className="cross" /></header>
                <div className="ChatSection" >
                    {isSubmitted && <div style={{ backgroundColor: isDarkMode ? "rgb(28, 46, 23)" : "" }} className="userMessage" >{UserChat}</div>}
                    {botChat && <div style={{ backgroundColor: isDarkMode ? "rgb(28, 46, 23)" : "" }} className="botMessage">{botChat}</div>}
                </div>

                <div className="userSection" >
                    <form style={{ backgroundColor: isDarkMode ? "rgb(28, 46, 23)" : "" }} onSubmit={(e) => {
                        e.preventDefault();
                        const f = new FormData(e.target);
                        setUserChat(f.get("user"));
                        setinputField("");

                    }}>
                        <input type="text" name="user" value={inputFiled} onChange={(e) => (setinputField(e.target.value))} placeholder="Type your query here..." required />
                        <button type="submit" onClick={() => (setSubmitted(true))}><IoMdSend className="but" /></button>

                    </form>

                </div>
            </div>
        </div>,
        document.getElementById("ChatbotSection")
    );
}