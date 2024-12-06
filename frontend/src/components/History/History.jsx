import { useState } from "react";
import HistoryModal from "./HistoryModal";
import { useDarkMode } from "../DarkModeContext";
import "../../styles/history.css";
export default function History({disease,percentage,date,leaf}){
    const{isDarkMode,setDarkMode}=useDarkMode();
    const[viewClicked,setViewClicked]=useState(false);
    return (
        <div className="Historywrapper">
            <section className="HistoryContainerwithDetails" style={isDarkMode?{color:"white",backgroundColor:"#2e302f"}:{color:"black"}}>
                <div className="leftsideHistoryDetails">
                    <h5>Disease Name: <span>{disease}</span></h5>
                    <h5>Confidence Level: <span>{percentage}</span></h5>
                    <div className="confidenceParent" style={{width:"200px", backgroundColor:"grey" , borderRadius:"20px"}}>
                        <div className="confidenceindicator" style={{borderRadius:"20px", width: `${(parseFloat(percentage) / 100) * 200}px`,border:percentage>"90"?"3px solid green":percentage>"70"?"3px solid rgb(252, 211, 3)":"3px solid red"}}></div>
                    </div>
                    <h5>Date: <span>{date}</span></h5>
                    <div className="viewMoreHistoryButton">
                    <div className="button" onClick={()=>setViewClicked(true)}>View More</div>
                    {viewClicked && <HistoryModal onclose={()=>setViewClicked(false)}  disease={disease} percentage={percentage} leaf={leaf}/>}
                </div>
                </div>
                <div className="rigthsideHistoryDetails">
                    <img draggable="false" src={leaf} alt=""/>
                </div>
            </section>
        </div>
    );
}