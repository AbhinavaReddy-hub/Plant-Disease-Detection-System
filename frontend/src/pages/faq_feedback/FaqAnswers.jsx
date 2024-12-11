import { useDarkMode } from "../../DarkModeContext";
export default function FaqAnswers({ question, answer, setClicked }) {
   const {isDarkMode,setDarkmode}=useDarkMode();
    return (
        <div className="faqQuestionAnswer">
            <div className="questioncontainer" onClick={setClicked} style={isDarkMode?{borderBottom:"1x solid white"}:{}}>
                <div className="question">{question}</div>
                <span className="minus">-</span>
            </div>
            <div className="answercontainer">
                <div className="answer">{answer}</div>
            </div>
        </div>
    );
}
