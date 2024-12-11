import { useState } from "react";
import FaqAnswers from "./faqanswers";
import FaqQuestions from "./faqquestions";
import { useDarkMode } from "../../DarkModeContext";
import "./faq.css";

export default function Faq() {
    const [activeQuestionId, setActiveQuestionId] = useState(null);
    const [feedbackData,setfeedbackData] = useState("");
    const{isDarkMode,setDarkmode}=useDarkMode();
    console.log(feedbackData)
    const questions = [
        {
            id: '1',
            question: "How to upload image through mobile?",
            answer: "Uploading through mobile is simple. Just take the photo of the affected leaf using the mobile camera, then upload it on Vriksharakshak's diagnose page from your gallery by clicking the 'Upload Image' button.",
        },
        {
            id: '2',
            question: "How to upload image through mobile?",
            answer: "Uploading through mobile is simple. Just take the photo of the affected leaf using the mobile camera, then upload it on Vriksharakshak's diagnose page from your gallery by clicking the 'Upload Image' button.",
        },
        {
            id: '3',
            question: "How to contact support?",
            answer: "You can contact support through the 'Contactus' section on the website, where you'll find contact options like email.",
        },
        {
            id: '4',
            question: "What image formats are supported?",
            answer: "We support common formats like JPEG, PNG, and SVG. Ensure your file size is below 5MB for smooth uploads.",
        },
    ];

    return (
        <div className="faqFeedbackContainer" >
            <div className="toplevelContainer">
                <div className="faqLeftSide">
                <div className="headingfaq">
                    <h2>Frequently Asked <span className="quest">Questions</span></h2>
                </div>
                <section className="AnswerQuestioncontainer" style={isDarkMode?{backgroundColor:"rgb(53, 102, 54)"}:{}}>
                    {questions.map((que) => (
                        activeQuestionId === que.id ? (
                            <FaqAnswers
                                key={que.id}
                                question={que.question}
                                answer={que.answer}
                                setClicked={() => setActiveQuestionId(null)}
                            />
                        ) : (
                            <FaqQuestions
                                key={que.id}
                                question={que.question}
                                setClicked={() => setActiveQuestionId(que.id)}
                            />
                        )
                    ))}
                </section>
                <div className="feedbackandQuestion">
                    <h2 className="asking">Have any Other Questions?</h2>
                    <p className="answeringquestion">Doesn't hesitate to post it in the feedback section</p>
                </div>
                </div>
                <div className="faqRightSide">
                    <div className="FeedbackSection">
                        <h2 className="feedbackheading">Write FeedBack</h2>
                        <form onSubmit={(e)=>{
                            e.preventDefault();
                            setfeedbackData("");
                            }}>
                            <textarea name="userFeedback" id="userfeedback" placeholder="Say something about our website or post your query" required maxLength={200} value={feedbackData} onChange={(e)=>{
                                setfeedbackData(e.target.value)
                            }} ></textarea>
                            <p className="indicator" style={isDarkMode?{color:"white"}:{color:"black"}}>{200-feedbackData.length}chars</p>
                            <button type="submit" className="button">Send Feedback</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
