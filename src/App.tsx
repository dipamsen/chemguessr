import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import "./index.css";
import katex from "katex";
import "katex/dist/katex.min.css";
import "katex/contrib/mhchem/mhchem.js";
import { app, database as db } from "./database";
import { get, ref } from "firebase/database";

function App() {
  const viewerRef = useRef(null);
  const [questions, setQuestions] = useState<
    { name: string; formula: string }[]
  >([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [options, setOptions] = useState<{ name: string; class?: string }[]>(
    []
  );
  const [answer, setAnswer] = useState(1);
  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    const compoundsRef = ref(db, "chemguessr");
    // read once
    get(compoundsRef).then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        setQuestions(Object.values(data));
      }
    });
  }, []);

  useEffect(() => {
    createNewQuestion();
  }, [questions]);

  const createNewQuestion = () => {
    if (!viewerRef.current) return;
    if (questions.length === 0) return;
    setSelected(-1);
    console.log(questions);
    const current = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(current);
    const opt = [questions[current].name];
    while (opt.length < 4) {
      const i = Math.floor(Math.random() * questions.length);
      if (i !== current && !opt.includes(questions[i].name)) {
        opt.push(questions[i].name);
      }
    }
    for (let i = opt.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opt[i], opt[j]] = [opt[j], opt[i]];
    }
    // console.log(opt);
    setAnswer(opt.indexOf(questions[current].name));
    setOptions(
      opt.map((o) => ({
        name: o,
      }))
    );
    katex.render(`\\ce{${questions[current].formula}}`, viewerRef.current, {
      displayMode: true,
    });
  };

  const handleOptionSelect = (i: number) => {
    setSelected(i);
    if (i === answer) {
      setOptions((prev) => {
        const newOptions = [...prev];
        newOptions[i].class = "correct";
        return newOptions;
      });
    } else {
      setOptions((prev) => {
        const newOptions = [...prev];
        newOptions[i].class = "incorrect";
        newOptions[answer].class = "correct";
        return newOptions;
      });
    }
  };

  return (
    <div className="App">
      <h1>ChemGuessr</h1>
      {/* next btn */}
      <div className="right">
        <button className="next" onClick={createNewQuestion}>
          Next
        </button>
      </div>

      <div ref={viewerRef} className="viewer" />
      <div className="options">
        {options.map((option, i) => (
          <button
            className={`opt ${option.class || ""}`}
            disabled={selected >= 0}
            key={i}
            onClick={() => handleOptionSelect(i)}
          >
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
