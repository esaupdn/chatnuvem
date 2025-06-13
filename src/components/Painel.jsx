import React, { useState } from "react";
import "./Painel.css";
import getApiData from "../config/apigemini";

// CORREÇÃO: Adicionei o "FaFileCode" que estava faltando na linha abaixo.
import {
  FaDocker,
  FaTerminal,
  FaServer,
  FaCode,
  FaFileCode, // Estava faltando este!
  FaPaperPlane,
  FaUserCircle,
} from "react-icons/fa";

const Painel = () => {
  const handleCardClick = (text) => {
    setInput(text);
    onSentApi(text);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSentApi();
    }
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };
  
  const onSentApi = async (prompt) => {
    const promptToSend = prompt || input;
    if (!promptToSend) {
      return;
    }

    setResultData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(promptToSend);
    const response = await getApiData(promptToSend);
    
    let responseArray = response.split("**");
    let formatedResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 === 0) {
        formatedResponse += responseArray[i];
      } else {
        formatedResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let finalResponse = formatedResponse.replace(/\*/g, "").replace(/\n/g, "<br />");

    setResultData(finalResponse);
    setLoading(false);
    setInput("");
  };

  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  return (
    <div className="main">
      <div className="nav">
        <p onClick={() => newChat()} data-alt="Novo chat">
          Nuvem
        </p>
        <FaUserCircle size={32} />
      </div>
      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Olá, Dev.</span>
              </p>
              <p>Como posso lhe ajudar hoje?</p>
            </div>
            <div className="cards">
              <div
                className="card"
                onClick={() => handleCardClick("O que é Docker?")}
              >
                <p>O que é Docker e para que serve?</p>
                <div className="card-icon">
                  <FaDocker />
                </div>
              </div>
              <div
                className="card"
                onClick={() =>
                  handleCardClick("Comandos básicos do Dockerfile")
                }
              >
                <p>Comandos básicos do Dockerfile</p>
                <div className="card-icon">
                  <FaFileCode />
                </div>
              </div>
              <div
                className="card"
                onClick={() =>
                  handleCardClick("Docker vs. VM: Qual a diferença?")
                }
              >
                <p>Docker vs. VM: Qual a diferença?</p>
                <div className="card-icon">
                  <FaServer />
                </div>
              </div>
              <div
                className="card"
                onClick={() => handleCardClick("Como subir um contêiner Nginx?")}
              >
                <p>Como subir um contêiner Nginx?</p>
                <div className="card-icon">
                  <FaTerminal />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <FaUserCircle size={32} />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <FaDocker size={40} style={{ minWidth: "40px" }} />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}
        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              value={input}
              type="text"
              placeholder="Pergunte sobre Docker, VMs, Kubernetes..."
            />
            <div>
              <FaPaperPlane
                onClick={() => onSentApi()}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
          <p className="bottom-info">
            Nuvem é um assistente que utiliza uma base de dados própria com
            pesquisa gerada através de embeddings do Gemini. Algumas informações
            podem ser incorretas, sempre verifique as fontes recomendadas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Painel;