const Alerta = ({ alerta }) => {
    let mensaje = alerta.msg;
    const msg = mensaje.split(".");
    console.log(msg);
    return (
        <div>
            <h3>{msg[0]}</h3>
            <br></br>
            <h4 className="titleConfirm2">{msg[1]}</h4> 
            <br />
        </div>
    )
};

export default Alerta;
