import React, { useState } from "react";
import "./Login.css";
import { users } from "./dataUsers";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [getUser, setUser] = useState("");
    const [getPassword, setPassword] = useState("");
    const navigate = useNavigate();

    function login() {
        if (buscarUsuario()) {
            Swal.fire({
                title: "Bienvenido",
                icon: "success",
                timer: 950,
                timerProgressBar: true,
                didOpen: () => Swal.showLoading(),
                willClose: () => navigate("/home"),
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error de Credenciales",
                text: "Usuario y/o Contraseña Incorrecta",
            });
        }
    }

    function buscarUsuario() {
        return users.some(
            (user) => getUser === user.email && getPassword === user.password
        );
    }

    return (
        <div className="login-background">
            <section className="sectionLogin">
                <form>
                    <img
                        src="/Effitrack.jpg"
                        alt="Effitrack"
                        className="effitrack"
                    />
                    <h2>Bienvenido</h2>

                    <section>
                        <label htmlFor="">Usuario</label>
                        <input
                            value={getUser}
                            onChange={(e) => setUser(e.target.value)}
                            type="text"
                        />
                    </section>

                    <section>
                        <label htmlFor="">Contraseña</label>
                        <input
                            value={getPassword}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                        />
                    </section>
                    <br />
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            login();
                        }}
                        type="button"
                        className="login-button"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </section>
        </div>
    );
};

export default Login;
