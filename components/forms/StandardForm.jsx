import React, { useState, useEffect } from "react";
import useSanitizedInput from "@/hooks/useSanitizedInput";

export default function StandardForm() {
    const [csrfToken, setCsrfToken] = useState("");
    const [name, setName] = useSanitizedInput("");
    const [email, setEmail] = useSanitizedInput("");
    const [message, setMessage] = useSanitizedInput("");

    const serverUrl = process.env.DEV_SERVER_URL;// needs to account for prod as well
    function handleChange(event, setChange) {
        setChange(event.target.value);
    }
    useEffect(() => {
        // Fetch the CSRF token when the component mounts
        fetch(`${serverUrl}/csrf-token`)
          .then(res => res.json())
          .then(data => setCsrfToken(data.csrfToken));
    }, []);

  return (
    <div className="form-standard">
        <form className="form-standard-form flex flex-col gap-4">
            {/* Include the CSRF token as a hidden field */}
            <input type="hidden" name="_csrf" value={csrfToken} />
            <div className="form-standard-form-group flex gap-2">
                <label htmlFor="form-standard-name">Name</label>
                <input id="form-standard-name" type="text" className="text-slate-950" value={name} onChange={(e)=> handleChange(e, setName)} />
            </div>
            <div className="form-standard-form-group flex gap-2">
                <label htmlFor="form-standard-email">Email</label>
                <input id="form-standard-email" type="email" className="text-slate-950" value={email} onChange={(e)=> handleChange(e, setEmail)} />
            </div>
            <div className="form-standard-form-group flex gap-2">
                <label htmlFor="form-standard-message">Message</label>
                <textarea id="form-standard-message"  className="text-slate-950" value={message} onChange={(e)=> handleChange(e, setMessage)} />
            </div>
            <div className="form-standard-form-group flex gap-2">
                <button type="submit">Submit</button>
            </div>
        </form>
    </div>
  );
}