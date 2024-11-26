export default function FaqAnswers({ question, answer, setClicked }) {
    return (
        <div className="faqQuestionAnswer">
            <div className="questioncontainer" onClick={setClicked}>
                <div className="question">{question}</div>
                <span className="minus">-</span>
            </div>
            <div className="answercontainer">
                <div className="answer">{answer}</div>
            </div>
        </div>
    );
}
