import ReactDOM from "react-dom";
import { RxCross1 } from "react-icons/rx";
import { useState } from "react";
import "../../styles/Setting.css";

export default function Setting({ onclose }) {

  return ReactDOM.createPortal(
    <div className="SettingOuterWrapper">
      <div className="Settingmodal">
        <div className="icon" onClick={onclose}>
          <RxCross1 className="crossmark" style={{ color: "black" }} />
        </div>
        <div className="ChangePassword">
          <button className="ChangePassword">Change your Password</button>
        </div>

      </div>
    
    </div>,
    document.getElementById("Settings")
  );
}
