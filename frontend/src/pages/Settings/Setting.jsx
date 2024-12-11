import ReactDOM from "react-dom";
import { RxCross1 } from "react-icons/rx";
import { useState } from "react";
import {FaEye, FaEyeSlash } from "react-icons/fa";
import pass from './password.gif';
import "./setting.css";

export default function Setting({ onclose }) {
  const [curPass,setCurPass] = useState("");
  const [passVerify,setPassVerify] = useState(false);
  const [newPass,setNewPass] = useState("");
  const [confirmPass,setConfirmPass] =useState("");
  const [showCurrPassword, setshowCurrPassword] = useState(false);
  const [showNewPassword, setshowNewPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);

  const handleVerifyPassword = async () => {
    try {
        const response = await fetch("/api/verify-Currpass", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({curPass}),  // Join OTP array into a single string
        });
        if (response.ok) {
            setPassVerify(true);
        }
    } catch (error) {
        console.error(error);
    }
};
  return ReactDOM.createPortal(
    <div className="SettingOuterWrapper">
      <div className="Settingmodal">
        <div className="icon" onClick={onclose}>
          <RxCross1 className="crossmark" style={{ color: "black" }} />
        </div>
        <div className="ChangePassword">
          <img src={pass} alt="" width={180} />
          <h2>Change your Password</h2>
          {!passVerify && 
            <form className="newpasswordContainer" onSubmit={(e)=>{
              e.preventDefault();
              handleVerifyPassword();
            }}>
              <div className="curpass passchange">
                  <input className="CurrentInput cInput"
                  type={showCurrPassword ? "text" : "password"}  
                  value={curPass}
                  onChange={(e) => setCurPass(e.target.value)}
                  placeholder="Old Password "
                  required
                />
                 <button className="showbut" type="button" onClick={() => setshowCurrPassword((prev) => !prev)}>
                  {showCurrPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            <button type="submit" className="button">Enter</button>
            </form>
          }
        
          {
            passVerify && 
            <form className="newpasswordContainer" onSubmit={(e)=>{
              e.preventDefault();
            }}>
               <div className="newPass passchange">
               <input className="CurrentInput cInput"
                  type={showNewPassword ? "text" : "password"}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="New Password "
                  required
                />
                 <button className="showbut" type="button" onClick={() => setshowNewPassword((prev) => !prev)}>
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
               </div>
                <div className="confirmPass passchange">
                <input className="CurrentInput cInput"
                      type={showConfirmPassword ? "text" : "password"}  
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="Re-Enter Password "
                      required
                />
                 <button className="showbut" type="button" onClick={() => setshowConfirmPassword((prev) => !prev)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                </div>
                <button type="submit" className="button">Set Password</button>
            </form>
          }
        </div>

      </div>
    
    </div>,
    document.getElementById("Settings")
  );
}
