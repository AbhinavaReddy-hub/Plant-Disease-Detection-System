import "./History.css";
import leaf from "./download.jpeg";
import { Link } from "react-router-dom";
import History from "./History";

export default function SendHistory(){
    const history=[
        {
            id:1,
            disease:"tomato early blight",
            percentage:"92%",
            date:"20-09-2024",
            leaf:leaf,
        },
        {
            id:2,
            disease:"potato early blight",
            percentage:"95%",
            date:"20-09-2024",
            leaf:leaf,
        },
        {
            id:3,
            disease:"tomato late blight",
            percentage:"99%",
            date:"20-09-2024",
            leaf:leaf,
        },
        {
            id:4,
            disease:"tomato early blight",
            percentage:"59%",
            date:"20-09-2024",
            leaf:leaf,
        },
        {
            id:5,
            disease:"apple scab",
            percentage:"89%",
            date:"20-09-2024",
            leaf:leaf,
        },
    ]
    return(
        <div className="SendHistoryWrapper">
             <section className="headerAndGotoInsights">
                <h2>History</h2>
                <Link to="/insights" className="button">Check out Your Insights</Link>
            </section>
            <div className="monthSectioin">
                <h3>October</h3>
            </div>
            <section className="containingDetails">
                {history.map(({id,disease,percentage,date,leaf})=>(
                    <div id={id}>
                        <History disease={disease} percentage={percentage} date={date} leaf={leaf}/>
                    </div>
                ))}
            </section>
        </div>
    );
}