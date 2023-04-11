import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import "./index.css";
import katex from "katex";
import "katex/dist/katex.min.css";
import "katex/contrib/mhchem/mhchem.js";
import { app, database as db } from "./database";
import { off, onValue, ref, set } from "firebase/database";

function Creator() {
  const viewerRef = useRef(null);
  const [name, setName] = useState("");
  const [formula, setFormula] = useState("");
  const [compounds, setCompounds] = useState<
    { name: string; formula: string }[]
  >([]);

  const chemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!viewerRef.current) return;
    katex.render("\\ce{" + formula + "}", viewerRef.current, {
      displayMode: true,
    });
  }, [formula]);

  useEffect(() => {
    if (!chemRefs.current) return;
    chemRefs.current.forEach((ref, i) => {
      if (!ref) return;
      katex.render("\\ce{" + compounds[i].formula + "}", ref, {
        displayMode: true,
      });
    });
  }, [compounds]);

  useEffect(() => {
    const compoundsRef = ref(db, "chemguessr");
    const unsub = onValue(compoundsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCompounds(Object.values(data));
      }
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <div className="App">
      <h1>ChemGuessr Composer</h1>

      <form>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Formula:
          <textarea
            name="formula"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
          />
        </label>
        <div ref={viewerRef} className="composer"></div>

        <input
          type="submit"
          value="Submit"
          disabled={name === "" || formula === ""}
          onClick={(e) => {
            e.preventDefault();
            // push to chemguessr 'array'
            const compoundsRef = ref(db, "chemguessr");
            set(compoundsRef, [...compounds, { name, formula }]);
            // reset form
            setName("");
            setFormula("");
          }}
        />
      </form>

      <div>
        <h2>Compound List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Formula</th>
            </tr>
          </thead>
          <tbody>
            {compounds.map((c, i) => (
              <tr>
                <td>{c.name}</td>
                <td>
                  <div ref={(e) => (chemRefs.current[i] = e)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Creator;
