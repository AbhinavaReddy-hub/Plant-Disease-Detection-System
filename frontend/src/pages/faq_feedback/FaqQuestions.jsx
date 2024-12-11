import { useDarkMode } from "../../DarkModeContext";
export default function FaqQuestions({ question, setClicked }) {
    const{isDarkMode,setDarkmode}=useDarkMode();
    return (
        <div className="faqQuestion" onClick={setClicked} style={isDarkMode?{borderBottom:"1x solid white"}:{}}>
            <div className="question">{question}</div>
            <span className="plus">+</span>
        </div>
    );
}
