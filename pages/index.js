import { useState, useMemo, useContext } from "react";
import StarField from "@/components/StarField";
import Tagline from "@/components/Tagline";
import { IoPencilOutline } from "react-icons/io5";
import { MdClear, MdMenu, MdClose } from "react-icons/md";
import { BsClipboard2Fill, BsClipboard2CheckFill } from "react-icons/bs";
import Sidebar from "@/components/SideBar";
import { ToneContext, ToneProvider } from "@/helpers/tonecontext";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [outputVisible, setOutputVisible] = useState(false);
  const [copiedIconVisible, setCopiedIconVisible] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const { tone } = useContext(ToneContext);

  const handleSubmit = useMemo(
    () => async (event) => {
      event.preventDefault();
      setError("");
      setIsLoading(true);

      try {
        const response = await fetch("/api/rewrite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: inputText, tone: tone }),
        });

        if (!response.ok) {
          throw new Error(
            `Please input a valid sentence. The provided text cannot be rewritten.`
          );
        }

        const data = await response.json();
        const { output } = data;
        setApiOutput(output);
        setOutputVisible(true);
      } catch (error) {
        console.error("Error: ", error);
        setError(
          "Please input a valid sentence. The provided text cannot be rewritten."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [inputText, tone]
  );

  const clearInputText = useMemo(
    () => () => {
      setInputText("");
      setIsInputEmpty(true);
    },
    []
  );

  const handleRewrite = useMemo(
    () => () => {
      setApiOutput("");
      setOutputVisible(false);
    },
    []
  );

  const copyToClipboard = useMemo(
    () => () => {
      navigator.clipboard
        .writeText(apiOutput)
        .then(() => {
          setCopiedIconVisible(true);
          setTimeout(() => {
            setCopiedIconVisible(false);
          }, 5000);
        })
        .catch((error) => console.error("Failed to copy:", error));
    },
    [apiOutput]
  );

  return (
    <div>
      <StarField />
      <div className="flex flex-col items-center">
        {showSidebar ? (
          <MdClose
            className="bg-inherit text-slate-400 size-9 absolute right-0 top-0 z-10 mr-2 mt-2"
            onClick={() => setShowSidebar(!showSidebar)}
          />
        ) : (
          <MdMenu
            className="bg-inherit text-slate-400 size-9 absolute right-0 top-0 z-10 mr-2 mt-2"
            onClick={() => setShowSidebar(!showSidebar)}
          />
        )}

        {showSidebar && <Sidebar />}
        <div className="header">ClearSpeech</div>
        <Tagline />
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            width: "100%",
          }}
        >
          <div className="input-container">
            <textarea
              placeholder="start typing here....."
              className="input-content"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setIsInputEmpty(e.target.value === "");
              }}
              disabled={isLoading}
            />
            {!isLoading && !isInputEmpty && (
              <MdClear
                className="absolute top-3 right-3 text-white text-sm xs:text-lg cursor-pointer"
                onClick={clearInputText}
              />
            )}
          </div>
          <div className="rewrite-btn">
            <button
              type="submit"
              disabled={isLoading || isInputEmpty}
              onClick={handleRewrite}
            >
              {isLoading ? (
                <div>
                  <div className="la-line-scale-pulse-out la-dark la-sm">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <IoPencilOutline className="text-lg mr-2" />
                  <p>Rewrite</p>
                </div>
              )}
            </button>
          </div>
          {outputVisible && (
            <div>
              <div className="flex justify-center mb-3">
                <div className="output-header">Output</div>
              </div>
              <div className="output-container relative">
                <textarea
                  placeholder="start typing here....."
                  className="output-content"
                  value={apiOutput}
                  disabled={true}
                />
                {copiedIconVisible ? (
                  <BsClipboard2CheckFill
                    className="absolute top-3 right-3 text-green-500 text-[10px] xs:text-xs cursor-pointer"
                    onClick={copyToClipboard}
                  />
                ) : (
                  <BsClipboard2Fill
                    className="absolute top-3 right-3 text-white text-[10px] xs:text-xs cursor-pointer"
                    onClick={copyToClipboard}
                  />
                )}
              </div>
            </div>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
