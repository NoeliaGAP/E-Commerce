import { useContext, useState } from "react";
import { CartContext } from "./context/CartContext";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const Checkout = () => {
    const [nombre, setNombre] = useState();
    const [email, setEmail] = useState();
    const [telefono, setTelefono] = useState();
    const [orderId, setOrderId] = useState();
    const {cart, clear, SumaTotalProductos} = useContext(CartContext);

    const generarOrden = () => {
        if (nombre.length === 0) {
            return false;
        }

        if (email.length === 0) {
            return false;
        }

        if (telefono.length === 0) {
            return false;
        }

        const buyer = {name:nombre, email:email, phone:telefono};
        const items = cart.map(item => ({id:item.idx, titulo:item.titulo, precio:item.precio, cant: item.quantity, totalProd: item.quantity * item.precio}));
        const fecha = new Date();
        const date = `${fecha.getDate()}-${fecha.getMonth()+1}-${fecha.getFullYear()} ${fecha.getHours()}:${fecha.getMinutes()}`;
        const total = SumaTotalProductos();
        const order = {buyer:buyer, items:items, date:date, total:total};

        // Inserto Documento en Firestore
        const db = getFirestore();
        const ordersCollection = collection(db, "orders");
        addDoc(ordersCollection, order).then(resultado => {
            clear();
            setOrderId(resultado.id);
        });
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col text-center">
                    <h1 className="text-center textoPrimario fondoNegro">Checkout</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <input type="text" className="form-control" onInput={(e) => {setNombre(e.target.value)}} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="text" className="form-control" onInput={(e) => {setEmail(e.target.value)}} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Teléfono</label>
                            <input type="text" className="form-control" onInput={(e) => {setTelefono(e.target.value)}} />
                        </div>
                        <button type="button" className="btn fondoNegro textoPrimario" onClick={generarOrden}>Generar Orden</button>
                    </form>
                </div>
                <div className="col-md-6 text-center">
                    <table className="table">
                        <tbody>
                            {cart.map(product =>
                                <tr key={product.id}>
                                    <td className="align-middle"><img src={product.img} alt={product.titulo} width={80} /></td>
                                        <td className="text-start align-middle">{product.titulo}</td>
                                        <td className="text-start align-middle">${product.precio}</td>
                                        <td className="text-start align-middle">{product.quantity}</td>
                                        <td className="text-start align-middle">${product.quantity * product.precio}</td>
                                </tr>
                            )}
                            <tr>
                                <td className="text-center align-middle" colSpan={4}>&nbsp;</td>
                                <td className="text-start align-middle">${SumaTotalProductos()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="row my-5">
                <div className="col text-center">
                    {orderId ? <div class="alert fondoPrimario p-5 text-center" role="alert">
                        <p className="display-1">Excelente</p>
                        <h1>Gracias por tu compra</h1>
                        <p>ID de la compra: <b>{orderId}</b></p>
                    </div> : ""}
                </div>
            </div>
        </div>
    )
}

export default Checkout;