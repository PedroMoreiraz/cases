import { useState } from 'react';
import Notasemoedas from './Notasemoedas';
import styles from './Carteira.module.css';

function Carteira({ setItensDrop, itensDrop }) {
    const [aberto, fechado] = useState(false);

    const [notasDisponiveis, setNotasDisponiveis] = useState([
        {id: 'nota1', valor: 2, conteudo: 'R$ 2.00'},
        {id: 'nota2', valor: 5, conteudo: 'R$ 5.00'},
        {id: 'nota3', valor: 3, conteudo: 'R$ 3.00'},
    ])

    const iniciarArrasto = (e, id) => {
        e.dataTransfer.setData('text/plain', id);
    };

    const toggleCarteira = () => {
        fechado(!aberto);
    };

    const dropCarteira = (e) => {
        e.preventDefault();
        const trocoData = e.dataTransfer.getData('text/plain');

        const { id, valor } = JSON.parse(trocoData);
        if (id && valor !== undefined) {
            setItensDrop((prev) => ({ ...prev, troco: { id, valor } }));
        }
    };

    return (
        <main className={`${styles.containerCarteira} ${aberto ? styles.aberto : ''}`} onClick={toggleCarteira}>
            {aberto && (
                <div className={styles.conteudoCarteira}>
                    <Notasemoedas id="nota1" conteudo="R$ 2,00" iniciarArrasto={iniciarArrasto} />
                    <Notasemoedas id="nota2" conteudo="R$ 5,00" iniciarArrasto={iniciarArrasto} />
                    <Notasemoedas id="nota3" conteudo="R$ 1,00" iniciarArrasto={iniciarArrasto} />
                </div>
            )}
        </main>
    );
}

export default Carteira;
