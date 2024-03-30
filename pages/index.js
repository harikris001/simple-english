import StarField from "@/components/StarField";
import Tagline from "@/components/Tagline";
import { useState } from "react";
import { IoPencilOutline } from "react-icons/io5";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [apiOutput, setApiOutput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to track loading state of button

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    console.log("Calling Mistral API...");
    setIsLoading(true); // Set loading state to true when submitting form

    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error("Failed to rewrite text");
      }

      const data = await response.json();
      const { output } = data;
      // console.log(output)
      console.log("Mistral replied: ", output);
      setApiOutput(`${output}`);
    } catch (error) {
      console.error("Error from the CODE: ", error);
      setError("Failed to rewrite text. Please try again.");
    } finally {
      setIsLoading(false); // Set loading state back to false when request is completed
    }
  };

  return (
    <div>
      <StarField />
      <div className="flex flex-col items-center">
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
          <div className="prompt-container">
            <textarea
              placeholder="start typing here"
              className="prompt-box"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="flex gap-1 items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="button-content">
                <div class="la-line-scale-pulse-out la-dark la-sm">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            ) : (
              <div className="button-content flex gap-2 items-center">
                <IoPencilOutline className="text-sm" />
                <p>Rewrite</p>
              </div>
            )}
          </button>
          {/* New code I added here */}
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
          {/* <div className="output-content">
          <p>{apiOutput}</p>
        </div> */}
          {error && <p style={{ color: "red" }}>{error}</p>}{" "}
          {/* Displaying errors to the user */}
        </form>
      </div>
    </div>
  );
}
