
'use client'

import { Button, Col, Container, Form, FormControl, Nav, Navbar, InputGroup } from "react-bootstrap"
import { FaSearch } from "react-icons/fa";

export default function Menu() {
    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container className="mx-5" fluid>
                <Navbar.Brand clas href="#home">
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
                            style={{width:  '300px'}}
                        />
                        <Button variant="outline-light">
                            <FaSearch />
                        </Button>
                    </InputGroup>
                </Form>

                <Nav>
                    <Nav.Link href="/home">Active</Nav.Link>
                    <Nav.Link href="/home">Active</Nav.Link>
                    <Nav.Link href="/home">Active</Nav.Link>
                </Nav>

            </Container>
        </Navbar>
    )
}