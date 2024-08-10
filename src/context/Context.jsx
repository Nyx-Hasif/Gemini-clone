import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState(""); // use to save input data in input field
  const [recentPrompt, setRecentPrompt] = useState(""); //when click input send button save recent and will display in main component
  const [prevPrompts, setPrevPrompts] = useState([]); //declare as array to store previous prompt and save in recent tab (sidebar)
  const [showResult, setShowResult] = useState(false); //show result on main..right now false because state in false..when true it will display the result
  const [loading, setLoading] = useState(false); // if this true it will show loading animation on main component
  const [resultData, setResultData] = useState(""); // display our result on on main component

  const delayPara = (index, nextword) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextword);
    }, 75 * index);
  };

  // new chat button
  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setInput(""); // rezet input field
    setResultData(""); //reset data
    setLoading(true);
    setShowResult(true);
    let response;
    if (prompt !== undefined) {
      response = await run(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await run(input);
    }
    // setRecentPrompt(input)
    // setPrevPrompts(prev=>[...prev,input])//everytime we click send button save input in array in sidebar
    // const response = await run(input); //store input result into response
    let responseArray = response.split("**");
    let newResponse = " "; //remove undefined
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse2 = newResponse.split("*").join("<br/>");
    // setResultData(newResponse2); //show output result into main component
    //making typing effect text result
    let newResponseArray = newResponse2.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextword = newResponseArray[i];
      delayPara(i, nextword + " ");
    }
    setLoading(false); // will hide loading animation
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  /* eslint-disable */

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
