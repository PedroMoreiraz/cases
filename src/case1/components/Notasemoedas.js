import styles from './Notasemoedas.module.css';

function Notasemoedas({ id, conteudo, iniciarArrasto }) {
    const getClassName = () => {
        if (id === "nota1") {
            return styles.nota1;
        } else if (id === "nota2") {
            return styles.nota2;
        } else if (id === "nota3") {
            return styles.moeda;
        }
        return styles.Notas;
    };

    return (
        <div
            draggable
            onDragStart={(e) => iniciarArrasto(e, id)}
            className={getClassName()}
        >
            {conteudo}
        </div>
    );
}

export default Notasemoedas;
