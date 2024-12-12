import { RxCross1 } from "react-icons/rx";
import ReactDOM from "react-dom";
import { useDarkMode } from "../DarkModeContext";

export default function HistoryModal({onclose,disease,percentage,leaf}){
    const { isDarkMode, setDarkMode } = useDarkMode();
    return ReactDOM.createPortal(
        <div className="HistoryModalWrapper">
            <div className="HistoryModalContainer" style={isDarkMode ? { color: "white", backgroundColor: "#242a23" } : { color: "black" }}>
                <div className="crossMarkicon" onClick={onclose}>
                    <RxCross1 />
                </div>
                <div className="HistoryimageContainer">
                    <img src={leaf} alt="" />
                </div>
                <div className="HistoryDiseaseContainer">
                    <h5>Disease Name: <span>{disease}</span></h5>
                    <h5>Confidence Level: <span>{percentage}</span></h5>
                    <div className="confidenceParent" style={{ width: "200px", backgroundColor: "grey", borderRadius: "20px" }}>
                        <div className="confidenceindicator" style={{ borderRadius: "20px", width: `${(parseFloat(percentage) / 100) * 200}px`, border: percentage > "90" ? "3px solid green" : percentage > "70" ? "3px solid rgb(252, 211, 3)" : "3px solid red" }}></div>
                    </div>
                </div>
                <div className="HistoryLine" style={isDarkMode ? { border: "1px solid grey" } : {}}></div>
            </div> 
        </div>,
        document.getElementById("historyPortal")
    );
}