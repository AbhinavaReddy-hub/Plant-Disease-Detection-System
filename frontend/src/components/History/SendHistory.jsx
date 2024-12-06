import leaf from "../../images/History/download.jpeg";
import { Link } from "react-router-dom";
import History from "./History";
import { useState } from "react";
import {useDarkMode} from "../DarkModeContext";
import "../../styles/History.css";
export default function SendHistory(){
    const{isDarkMode,setDarkMode}=useDarkMode();
    const [countClicked,setCountClick]=useState(false)
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
        <div className="SendHistoryWrapper" style={isDarkMode?{color:"white",backgroundColor:"#242a23"}:{color:"black"}}>
             <section className="headerAndGotoInsights">
                <h2>History</h2>
                <Link to="/insights" className="button">Check out Your Insights</Link>
            </section>
            <section className="containingDetails"style={isDarkMode?{color:"white"}:{color:"black"}}>
                <div className="monthSectioinAndCount" style={{color:isDarkMode?"white":"black"}}>
                    <h3 style={{fontSize:"20px"}}>October</h3>
                    <button >Diagnosis Count : <span style={{color:"blue",fontWeight:"bolder", fontSize:"18px"}}>{history.length}</span></button>
                </div>
                {history.map(({id,disease,percentage,date,leaf})=>(
                    <div key={id}>
                        <History disease={disease} percentage={percentage} date={date} leaf={leaf}/>
                    </div>
                ))}
            </section>
        </div>
    );
}