'use client';

import { useEffect, useState } from 'react';
import { Button, Container, Form, FormControl, Nav, Navbar, InputGroup, NavDropdown } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { BsCart2, BsHeart, BsPersonCircle } from "react-icons/bs";

export default function Menu() {
    const [usuarioLogado, setUsuarioLogado] = useState(null);

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (usuario) {
            setUsuarioLogado(usuario.usuario); // Armazena o nome do usuário logado
        }
    }, []);
    
    const handleLogout = () => {
        localStorage.removeItem('usuarioLogado'); 
        setUsuarioLogado(null); 
    };

    return (
        <Navbar style={{ background: '#13293D' }} data-bs-theme="dark">
            <Container className="mx-5" fluid>
                <Navbar.Brand href="/">
                    <img
                        src="/images/sportfy_logo.png"
                        height="50"
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo"
                    />
                </Navbar.Brand>

                <Form className="d-flex">
                    <InputGroup>
                        <FormControl
                            type="search"
                            placeholder="Pesquisar"
                            aria-label="Pesquisar"
                            style={{
                                width: '300px',
                                borderColor: 'white',
                                backgroundColor: 'white',
                                color: 'black'
                            }}
                        />
                        <Button variant="light">
                            <FaSearch size={20} />
                        </Button>
                    </InputGroup>
                </Form>

                <Nav className="p-1">
                    <Nav.Link className="mt-1" href="/listadesejos">
                        <BsHeart className="mx-2 mt-1" size={25} />Lista de Desejo
                    </Nav.Link>

                    {/* Menu Dropdown para Cadastros */}
                    {usuarioLogado === 'master' && (
                        <NavDropdown title="Cadastros" id="nav-dropdown" className="mt-1">
                            <NavDropdown.Item href="/cadastro/produtos">Cadastrar Produto</NavDropdown.Item>
                            <NavDropdown.Item href="/cadastro/categorias">Cadastrar Categoria</NavDropdown.Item>
                            <NavDropdown.Item href="/cadastro/marcas">Cadastrar Marca</NavDropdown.Item>
                            <NavDropdown.Item href="/cadastro/tamanhos">Cadastrar Tamanhos</NavDropdown.Item>
                        </NavDropdown>
                    )}

                    <NavDropdown
                        title={
                            <>
                                <BsPersonCircle className="mx-2" size={25} />
                                {usuarioLogado ? usuarioLogado : 'Entrar'}
                            </>
                        }
                        id="nav-dropdown-user"
                        className="mt-1"
                    >
                        {usuarioLogado ? (
                            <>
                                <NavDropdown.Item href="/profile">Perfil</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleLogout}>Sair</NavDropdown.Item>
                            </>
                        ) : (
                            <>
                                <NavDropdown.Item href="/login">Login</NavDropdown.Item>
                                <NavDropdown.Item href="/register">Cadastro</NavDropdown.Item>
                            </>
                        )}
                    </NavDropdown>

                    <Nav.Link href="/carrinho"><BsCart2 className="mx-3" size={30} /> </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}
