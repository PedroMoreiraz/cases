import { useState } from 'react';
import Carteira from './Carteira';
import FiniMinhoca from './images/finiminhoca.png';
import FiniBanana from './images/finibanana.png';
import FiniBeijos from './images/finibeijos.png';
import styles from './Machine.module.css';
import { FaLock, FaLockOpen, FaHistory,  FaAngleLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function Machine() {

    
    const [doceSelecionado, setDoceSelecionado] = useState(null);
    const [somaTotal, setSomaTotal] = useState(0);
    const [itensDrop, setItensDrop] = useState({
        nota: null,
        moeda: null,
        troco: null,
    });
    const [valoresNotas, setValoresNotas] = useState([]);
    const [selectOption, setSelectOption] = useState(null);
    const [itensMochila, setItensMochila] = useState([]);
    
    const adicionarNota = (valorNota) => {
        const novoTotal = somaTotal + valorNota;
        if (novoTotal <= 10) {
            setValoresNotas((prev) => [...prev, valorNota]);
            setSomaTotal(novoTotal);
        } else {
            toast.error('Valor máximo de R$ 10,00 atingido', {
                autoClose: 3000,
            });
        }
    };
    
    const calcularTroco = (valorProduto) => {
        const troco = somaTotal - valorProduto;
        if (troco >= 0) {
            setItensDrop((prev) => ({
                ...prev,
                troco: { id: `troco_${Date.now()}`, valor: troco },
            }));
            setSomaTotal(troco);
        } else {
            toast.error('Saldo insuficiente', {
                autoClose: 3000,
            });
        }
    };
    
    const manipularOption = (valorOpcao) => {
        setSelectOption(valorOpcao);
    };
    
    const confirmar = () => {
        if (selectOption !== null) {
            const troco = somaTotal - selectOption;
            if (troco >= 0) {
                setItensDrop((prev) => ({
                    ...prev,
                    troco: { id: `troco_${Date.now()}`, valor: troco },
                }));
                
                setSomaTotal(troco);
                
                let doceSelecionado = '';
                switch (selectOption) {
                    case 6:
                        doceSelecionado = 'A';
                        break;
                        case 7:
                            doceSelecionado = 'B';
                            break;
                            case 8:
                                doceSelecionado = 'C';
                                break;
                                default:
                                    doceSelecionado = '';
                                }
                                
                                setDoceSelecionado(doceSelecionado);
                                
                                if (troco > 0) {
                                    toast.success(`Você comprou o Doce ${doceSelecionado} e recebeu troco de R$ ${troco.toFixed(2)}`, {
                                        autoClose: 3000,
                                    });
                                } else {
                                    toast.success(`Você comprou o Doce ${doceSelecionado} e não recebeu troco`, {
                                        autoClose: 3000,
                                    });
                                }
                            } else {
                                toast.error('Coloque mais dinheiro', {
                                    autoClose: 3000,
                                });
                            }
                        } else {
                            toast.error('O valor de nenuma opção foi atingido', {
                                autoClose: 3000,
                            });
                        }
                    };
                    
                    const getClassName = (doce) => {
                        return doceSelecionado === doce
                        ? `${styles.doces} ${styles.docesAnimado}`
                        : styles.doces;
                    };
                    
                    const getDoceImagem = () => {
                        switch (doceSelecionado) {
                            case 'A':
                                return FiniMinhoca;
                                case 'B':
                                    return FiniBanana;
                                    case 'C':
                                        return FiniBeijos;
                                        default:
                                            return null;
                                        }
                                    };
                                    
                                    const moverParaMochila = () => {
                                        if (doceSelecionado) {
                                            setItensMochila((prev) => [...prev, doceSelecionado]);
                                            setDoceSelecionado(null);
                                        }
                                    };
                                    
                                    const drop = (e, tipo) => {
                                        e.preventDefault();
                                        const id = e.dataTransfer.getData('text/plain');
                                        const valorNota = getValorNota(id);
                                        const valorMoeda = getValorMoeda(id);
                                        const novoTotal = tipo === 'entrada' ? somaTotal + (valorNota || valorMoeda) : somaTotal;
                                        
                                        if (novoTotal <= 10) {
                                            if (id.startsWith('nota')) {
                                                if (tipo === 'entrada' && valorNota !== null) {
                                                    setItensDrop((prev) => ({ ...prev, nota: id }));
                                                    setValoresNotas((prev) => [...prev, valorNota]);
                                                    setSomaTotal(novoTotal);
                                                } else if (tipo === 'saida') {
                                                    setItensDrop((prev) => ({ ...prev, troco: { id: `troco_${Date.now()}`, valor: valorNota } }));
                                                }
                                            } else if (id.startsWith('moeda')) {
                                                if (tipo === 'entrada' && valorMoeda !== null) {
                                                    setItensDrop((prev) => ({ ...prev, moeda: id }));
                                                    setSomaTotal(novoTotal);
                                                }
                                            }
                                        } else {
                                            toast.error('Valor máximo de R$ 10,00 atingido', {
                                                autoClose: 3000,
                                            });
                                        }
                                    };
                                    
                                    const allowDrop = (e) => {
                                        e.preventDefault();
                                    };
                                    
                                    const getValorNota = (id) => {
                                        const valores = {
                                            nota1: 2,
                                            nota2: 5,
                                            nota3: 1,
                                        };
                                        return valores[id] || null;
                                    };
                                    
                                    const getValorMoeda = (id) => {
                                        const valores = {
                                            moeda1: 0.5,
                                            moeda2: 1,
                                            moeda3: 0.25,
                                        };
                                        return valores[id] || null;
                                    };
                                    
                                    const moverTrocoParaCarteira = () => {
                                        if (itensDrop.troco) {
                                            setItensDrop((prev) => ({ ...prev, troco: null }));
                                            setSomaTotal(0);
                                        }
                                    };
                                    
                                    const renderizarTroco = () => {
                                        if (!itensDrop.troco) return null;
                                        
                                        const troco = itensDrop.troco.valor;
                                        
                                        if (troco === 0) {
                                            return null;
                                        }
                                        
                                        if (troco === 1) {
                                            return (
                                                <div className={styles.trocoMoeda} onClick={moverTrocoParaCarteira}>
                    {`R$ ${troco.toFixed(2)}`}
                </div>
            );
        }
        
        if (troco === 2) {
            return (
                <div className={styles.troco} onClick={moverTrocoParaCarteira}>
                    {`R$ ${troco.toFixed(2)}`}
                </div>
            );
        }
        
        if (troco === 3) {
            return (
                <>
                    <div className={styles.trocoMoeda} onClick={moverTrocoParaCarteira}>
                        {`R$ 1.00`}
                    </div>
                    <div className={styles.troco} onClick={moverTrocoParaCarteira}>
                        {`R$ 2.00`}
                    </div>
                </>
            );
        }
        
        if (troco === 4) {
            return (
                <>
                    <div className={styles.troco} onClick={moverTrocoParaCarteira}>
                        {`R$ 2.00`}
                    </div>
                    <div className={styles.trocoDuplo} onClick={moverTrocoParaCarteira}>
                        {`R$ 2.00`}
                    </div>
                </>
            );
        }
        
        return null;
    };
    
    function reload(){
        window.location.reload();
    }

    return (
        <main className={styles.containerMaquina}>
            <ToastContainer/>
            <article className={styles.fundoMaquina}>
                <section className={styles.leftSide}>
                    {/* Vidro */}
                    <div className={styles.containerVidro}>
                        <div className={styles.vidro}>
                            <div className={styles.luz} />
                            <ul>
                                <div className={styles.shelf1}>
                                    <p className={styles.doceA}>A</p>
                                    <div className={styles.doces}>
                                        <li
                                            id="candyA"
                                            className={getClassName('A')}
                                            onClick={() => setDoceSelecionado('A')}
                                            >
                                            <div className={styles.fini1}>
                                                {doceSelecionado !== 'A' && !itensMochila.includes('A')&&(
                                                    <img
                                                        src={FiniMinhoca}
                                                        alt="Fini minhoca"
                                                        width={100}
                                                        height={100}
                                                    />
                                                )}
                                            </div>
                                        </li>
                                    </div>
                                </div>
                                <div className={styles.shelf2}>
                                    <p className={styles.doceB}>B</p>
                                    <div className={styles.doces}>
                                        <li
                                            id="candyB"
                                            className={getClassName('B')}
                                            onClick={() => setDoceSelecionado('B')}
                                        >
                                            <div className={styles.fini2}>
                                                {doceSelecionado !== 'B' && !itensMochila.includes('B') &&(
                                                    <img
                                                        src={FiniBanana}
                                                        alt="Fini banana"
                                                        width={100}
                                                        height={100}
                                                    />
                                                )}
                                            </div>
                                        </li>
                                    </div>
                                </div>
                                <div className={styles.shelf3}>
                                    <p className={styles.doceC}>C</p>
                                    <div className={styles.doces}>
                                        <li
                                            id="candyC"
                                            className={getClassName('C')}
                                            onClick={() => setDoceSelecionado('C')}
                                        >
                                            <div className={styles.fini3}>
                                                {doceSelecionado !== 'C' && !itensMochila.includes('C') &&(
                                                    <img
                                                        src={FiniBeijos}
                                                        alt="Fini beijos"
                                                        width={100}
                                                        height={100}
                                                    />
                                                )}
                                            </div>
                                        </li>
                                    </div>
                                </div>
                            </ul>
                        </div>
                        {/* Retirar Doces */}
                        <div className={styles.containerRetirarDoces}>
                            <div className={styles.saidaItens}>
                                {doceSelecionado && (
                                    <div className={styles.imagemDoce} onClick={moverParaMochila}>
                                        <img
                                            src={getDoceImagem()}
                                            alt={doceSelecionado}
                                            width={100}
                                            height={100}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
                <section className={styles.rightSide}>
                    {/* Opções*/}
                    <div className={styles.containerOpcoes}>
                        <div className={styles.visor}>
                            {somaTotal === 0 ? (
                                <div className={styles.textValues}>
                                    <p>Insira um valor</p>
                                </div>
                            ) : (
                                <div id="values" className={styles.values}>
                                    <h3>R$ {Math.min(somaTotal, 10).toFixed(2)}</h3>
                                </div>
                            )}
                        </div>

                        {/* Values */}
                        <div className={styles.opcoes}>
                            {somaTotal >= 6 ? (
                                <div className={styles.options} onClick={() => manipularOption(6)}>
                                    <label>A = R$6,00</label>
                                    <input type="radio" id="optionA" name="opcao" checked={selectOption === 6} readOnly />
                                    <FaLockOpen />
                                </div>
                            ) : (
                                <div className={styles.options}>
                                    <label>A = R$6,00</label>
                                    <input type="radio" id="optionA" disabled />
                                    <FaLock />
                                </div>
                            )}
                            {somaTotal >= 7 ? (
                                <div className={styles.options} onClick={() => manipularOption(7)}>
                                    <label>B = R$7,00</label>
                                    <input type="radio" id="optionB" name="opcao" checked={selectOption === 7} readOnly />
                                    <FaLockOpen />
                                </div>
                            ) : (
                                <div className={styles.options}>
                                    <label>B = R$7,00</label>
                                    <input type="radio" id="optionB" disabled />
                                    <FaLock />
                                </div>
                            )}
                            {somaTotal >= 8 ? (
                                <div className={styles.options} onClick={() => manipularOption(8)}>
                                    <label>C = R$8,00</label>
                                    <input type="radio" id="optionC" name="opcao" checked={selectOption === 8} readOnly />
                                    <FaLockOpen />
                                </div>
                            ) : (
                                <div className={styles.options}>
                                    <label>C = R$8,00</label>
                                    <input type="radio" id="optionC" disabled />
                                    <FaLock />
                                </div>
                            )}
                        </div>
                        <div>
                            <button onClick={confirmar} className={styles.btn}>Confirmar</button>
                        </div>
                    </div>
                    {/* Dinheiro */}
                    <main className={styles.containerDinheiro}>
                        <div
                            className={styles.dinheiroEntrada}
                            onDrop={(e) => drop(e, 'entrada')}
                            onDragOver={allowDrop}
                        >
                            <div className={styles.furoDinehiroEntrada}>
                                {itensDrop.nota && <div className="nota">{itensDrop.nota}</div>}
                            </div>
                        </div>
                        <div
                            className={styles.dinheiroSaida}
                            onDrop={(e) => drop(e, 'saida')}
                            onDragOver={allowDrop}
                        >
                            <div className={styles.furoDinheiroSaida}>
                                {renderizarTroco()}
                            </div>    
                        </div>
                        <div
                            className={styles.moeda}
                            onDrop={(e) => drop(e, 'entrada')}
                            onDragOver={allowDrop}
                        >
                            <div className={styles.furoMoeda} />
                            {itensDrop.moeda && <div className="moeda">{itensDrop.moeda}</div>}
                        </div>
                    </main>
                </section>
            </article>
            <article>
                {/* Carteira */}
                <Carteira itensDrop={itensDrop} setItensDrop={setItensDrop} />
            </article>
            <article>
                {/* Mochila */}
                    <main className={styles.containerMochila}>
                        <div className={styles.conteudoMochila}>
                            {itensMochila.map((doce, index) => (
                                <div key={index} className={styles.doceMochila}>
                                    <img
                                        src={doce === 'A' ? FiniMinhoca : doce === 'B' ? FiniBanana : FiniBeijos}
                                        alt={`Doce ${doce}`}
                                        width={100}
                                        height={100}
                                    />
                                </div>
                            ))}
                        </div>
                    </main>
            </article>
            <article>
                <button className={styles.reloadBtn} onClick={reload}>
                    <FaHistory/>
                </button>
                <Link to='/' className="btn btn-dark position-absolute top-0 start-0 m-3 rounded">
                    <FaAngleLeft/>
                </Link>
            </article>
        </main>
    );
}

export default Machine;
