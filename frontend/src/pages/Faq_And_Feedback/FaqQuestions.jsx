export default function FaqQuestions({ question, setClicked }) {
    return (
        <div className="faqQuestion" onClick={setClicked}>
            <div className="question">{question}</div>
            <span className="plus">+</span>
        </div>
    );
}
