
'use client'

import { Button, Col, Container, Form, FormControl, Nav, Navbar, InputGroup, NavDropdown } from "react-bootstrap"
import { FaSearch, } from "react-icons/fa";
import { BsCart2, BsHeart, BsPersonCircle } from "react-icons/bs";

export default function Menu() {
    return (
        <Navbar style={{ background: '#13293D' }} data-bs-theme="dark">
            <Container className="mx-5" fluid>
                <Navbar.Brand clas href="/">
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
                    <Nav.Link className="mt-1" href="/listadesejos"><BsHeart className="mx-2 mt-1" size={25} />Lista de Desejo</Nav.Link>
                    <NavDropdown
                        title={
                            <>
                                <BsPersonCircle className="mx-2" size={25} />
                                Entrar
                            </>
                        }
                        id="nav-dropdown"
                        className="mt-1"
                    >
                        <NavDropdown.Item href="/login">Login</NavDropdown.Item>
                        <NavDropdown.Item href="/signup">Cadastro</NavDropdown.Item>
                        <NavDropdown.Item href="/profile">Perfil</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="/carrinho"><BsCart2 className="mx-3" size={30} /> </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}