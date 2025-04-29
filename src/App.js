import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BsArrowLeft, BsArrowRight, BsClipboard2 } from "react-icons/bs";
import Machine from './case1/components/Machine';

function Menu() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white">
      <h1>Escolha seu case:</h1>
      <Link to="/elevador" className="btn btn-primary m-2">Elevador</Link>
      <Link to="/machine" className="btn btn-secondary m-2">Candy Machine</Link>
    </div>
  );
}

function Elevador() {
  const [andar, setAndar] = useState(0);
  const [emMovimento, setEmMovimento] = useState(false);
  const [portaAberta, setPortaAberta] = useState(false);
  const [elevadorChamado, setElevadorChamado] = useState(false);
  const [historicoAndares, setHistoricoAndares] = useState([]);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(0);

  const cenarios = [
    { nome: "Andar 0", objeto: "mesa" },
    { nome: "Andar 1", objeto: "sofa" },
    { nome: "Andar 2", objeto: "cadeira" },
    { nome: "Andar 3", objeto: "tapete" },
  ];

  const itensPorPagina = 2;
  const totalPaginas = Math.ceil(historicoAndares.length / itensPorPagina);

  const andaresPaginaAtual = historicoAndares.slice(
    paginaAtual * itensPorPagina,
    (paginaAtual + 1) * itensPorPagina
  );

  const irParaAndar = async (destino) => {
    if (emMovimento || destino === andar || !elevadorChamado) return;

    setEmMovimento(true);
    setPortaAberta(false);

    const passo = destino > andar ? 1 : -1;

    for (let i = andar + passo; passo > 0 ? i <= destino : i >= destino; i += passo) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setAndar(i);
      setHistoricoAndares(prev => [...prev, i]);
    }

    setPortaAberta(true);
    setEmMovimento(false);
  };

  const chamarElevador = () => {
    if (emMovimento) return;
    setPortaAberta(true);
    setElevadorChamado(true);
  };

  const renderObjeto = (objeto) => {
    switch (objeto) {
      case "mesa": return <div className="objeto mesa"></div>;
      case "sofa": return <div className="objeto sofa"></div>;
      case "cadeira": return <div className="objeto cadeira"></div>;
      case "tapete": return <div className="objeto tapete"></div>;
      default: return null;
    }
  };

  const { objeto } = cenarios[andar];

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div className="roomContainer">
        <div className="room">
          <div className="wall back">
            <button className="map-toggle" onClick={() => setMostrarMapa(!mostrarMapa)}>
              <BsClipboard2 className='btnMap' />
            </button>
            {mostrarMapa && (
              <div className="map-overlay">
                <h5>Andares Visitados</h5>
                <ul>
                  {andaresPaginaAtual.map((andar, index) => (
                    <li key={index}>Andar {andar}</li>
                  ))}
                </ul>
                <div className="paginacao">
                  <button onClick={() => setPaginaAtual(p => Math.max(p - 1, 0))} disabled={paginaAtual === 0}>
                    <BsArrowLeft />
                  </button>
                  <span>Página {paginaAtual + 1} de {totalPaginas}</span>
                  <button onClick={() => setPaginaAtual(p => Math.min(p + 1, totalPaginas - 1))} disabled={paginaAtual >= totalPaginas - 1}>
                    <BsArrowRight />
                  </button>
                </div>
              </div>
            )}

            <div className="panelCall">
              <div className="buttonsCall">
                <button className="btn btn-sm btn-light" onClick={() => chamarElevador()}>↑</button>
                <button className="btn btn-sm btn-light" onClick={() => chamarElevador()}>↓</button>
              </div>
            </div>

            <div className="elevator-screen">{andar}</div>

            <div className="elevator">
              <div className={`doors ${portaAberta ? 'open' : 'closed'}`}></div>
            </div>

            <div className="panel">
              <div className="screen">{andar}</div>
              <div className="buttons">
                {[0, 1, 2, 3].map((num) => (
                  <button
                    key={num}
                    className="btn btn-sm btn-light"
                    onClick={() => irParaAndar(num)}
                    disabled={emMovimento || num === andar || !elevadorChamado}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="wall left"></div>
          <div className="wall right"></div>
          <div className="wall floor">
            <div className="objeto-container">{renderObjeto(objeto)}</div>
          </div>
          <div className="wall roof"></div>
        </div>
      </div>
      <Link to="/" className="btn btn-dark position-absolute top-0 start-0 m-3">
        <BsArrowLeft/>
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/elevador" element={<Elevador />} />
        <Route path="/machine" element={<Machine />} />
      </Routes>
    </Router>
  );
}

export default App;
