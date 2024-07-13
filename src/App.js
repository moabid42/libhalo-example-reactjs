import React, {useState} from 'react';
import './App.css';
import {execHaloCmdWeb} from "@arx-research/libhalo/api/web.js";
import {Buffer} from 'buffer/index.js';

function App() {
    const [statusText, setStatusText] = useState('Click on the button');

    async function btnClick() {
        let msg = "hello world";
        console.log(Buffer.from(msg, 'utf8').toString('hex'))
        // let messageBuf = Buffer.from(msg, "hex");
        // console.log(messageBuf);
        let command = {
            name: "sign",
            keyNo: 1,
            message: "010203",
            // legacySignCommand: true,
        };
        let res;
        try {
            res = await execHaloCmdWeb(command, {
                statusCallback: (cause) => {
                    if (cause === "init") {
                        setStatusText("Please tap the tag to the back of your smartphone and hold it...");
                    } else if (cause === "retry") {
                        setStatusText("Something went wrong, please try to tap the tag again...");
                    } else if (cause === "scanned") {
                        setStatusText("Tag scanned successfully, post-processing the result...");
                    } else {
                        setStatusText(cause);
                    }
                }
            });
            setStatusText(JSON.stringify(res, null, 4));
        } catch (e) {
            // the command has failed, display error to the user
            setStatusText('Scanning failed, click on the button again to retry. Details: ' + String(e));
        }
    }

    return (
        <div className="App">
            <pre style={{fontSize: 12, textAlign: "left", whiteSpace: "pre-wrap", wordWrap: "break-word"}}>
                {statusText}
            </pre>
            <button onClick={() => btnClick()}>Sign message 010203 using key #1</button>
        </div>
    );
}

export default App;
